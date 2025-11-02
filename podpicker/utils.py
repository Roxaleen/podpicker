import nh3, os, random, requests, time

from datetime import datetime

from .models import PodcastSeries, PodcastEpisode, Playlist


# HTML sanitizer
# Documentation: https://nh3.readthedocs.io/
nh3_cleaner = nh3.Cleaner(
    tags=set(["p", "br", "hr", "strong", "em", "b", "i", "u", "a"]),
    attributes={
        "a": set(["href"])
    },
    set_tag_attribute_values={
        "a": {
            "target": "_blank"
        }
    }
)


def get_podcasts(request, duration, page):
    """
    Query Taddy Podcast API for suitable podcast episodes
    Returns a list of podcast episodes if successful, else None
    """
    # Construct GraphQL query
    query = """
        query SearchEpisodes(
            $term: String = "",
            $languages: [Language] = [ENGLISH],
            $genres: [Genre]!,
            $series: [ID] = [],
            $series_exclude: [ID] = [],
            $date_earliest: Int,
            $duration_max: Int!,
            $duration_min: Int!,
            $sort: SearchSortOrder,
            $page: Int = 1
        ) {
            search(
                term: $term,
                filterForTypes: PODCASTEPISODE,
                filterForLanguages: $languages,
                filterForGenres: $genres,
                filterForSeriesUuids: $series,
                filterForNotInSeriesUuids: $series_exclude,
                filterForPodcastContentType: AUDIO,
                filterForPublishedAfter: $date_earliest,
                filterForDurationLessThan: $duration_max,
                filterForDurationGreaterThan: $duration_min,
                sortBy: $sort,
                limitPerPage: 25,
                page: $page
            ){
                searchId
                podcastEpisodes {
                    uuid,
                    hash,
                    name,
                    description,
                    duration,
                    imageUrl,
                    audioUrl,
                    episodeType,
                    datePublished,
                    podcastSeries {
                        uuid,
                        hash,
                        name,
                        description,
                        imageUrl,
                        genres,
                        language
                    }
                }
            }
        }
        """

    # Construct variable list
    variables = {
        "term": request.POST.get("term"),
        "languages": request.POST.getlist("language"),
        "genres": request.POST.getlist("genre"),
        "duration_max": duration * 60 / 2, # Find episodes of up to 1/2 the desired playlist duration
        "duration_min": duration * 60 / 6, # Find episodes of at least 1/6 the desired playlist duration
        "sort": "EXACTNESS" if request.POST.get("term") else "POPULARITY",
        "page": page
    }

    # Compute publish date cut-off (as epoch time in seconds)
    try:
        recency = int(request.POST.get("date"))
    except:
        recency = 0
    if recency > 0:
        variables["date_earliest"] = int(time.time()) - recency * 24 * 60 * 60

    # User-specific series filters (logged-in users only)
    if request.user.is_authenticated:
        # If searching for any podcasts
        if request.POST.get("source") == "any":
            variables["series_exclude"] = [str(uuid) for uuid in request.user.blocked_series.values_list("uuid", flat=True)]
        # If searching for followed podcasts only
        elif request.POST.get("source") == "following":
            variables["series"] = [str(uuid) for uuid in request.user.followed_series.values_list("uuid", flat=True)]

    # Send request
    response = requests.post(
        "https://api.taddy.org",
        json={
            "query": query,
            "variables": variables
        },
        headers={
            "Content-Type": "application/json",
            "X-USER-ID": os.getenv("X_USER_ID"),
            "X-API-KEY": os.getenv("X_API_KEY")
        }
    )

    # Check response
    if response.status_code != 200:
        return None
    try:
        raw_list = response.json()["data"]["search"]["podcastEpisodes"]
    except:
        return None

    # Process received data
    # - Discard episodes with no audio URL
    # - Discard episodes whose episodeType is not "FULL"
    # - Discard already finished episodes (logged-in users only)
    processed_list = []

    for episode in raw_list:
        if episode["audioUrl"] is None or episode["episodeType"] != "FULL":
            raw_list.remove(episode)
        elif request.user.is_authenticated and episode["uuid"] in request.user.finished_episodes.values_list("uuid", flat=True):
            raw_list.remove(episode)

        # If all checks passed, save episode to database
        series, series_created = PodcastSeries.objects.update_or_create(
            uuid=episode["podcastSeries"]["uuid"],
            defaults={
                "hash": episode["podcastSeries"]["hash"],
                "title": episode["podcastSeries"]["name"],
                "description": nh3_cleaner.clean(episode["podcastSeries"]["description"]) if episode["podcastSeries"]["description"] else "",
                "imageUrl": episode["podcastSeries"]["imageUrl"],
                "language": episode["podcastSeries"]["language"],
                "genres": episode["podcastSeries"]["genres"]
            }
        )
        episode, epidode_created = PodcastEpisode.objects.update_or_create(
            uuid=episode["uuid"],
            defaults={
                "hash": episode["hash"],
                "title": episode["name"],
                "description": nh3_cleaner.clean(episode["description"]) if episode["description"] else "",
                "duration": episode["duration"],
                "imageUrl": episode["imageUrl"],
                "audioUrl": episode["audioUrl"],
                "published": datetime.fromtimestamp(episode["datePublished"]),
                "series": series
            }
        )
        processed_list.append(episode.get_metadata(request.user))

    return processed_list


def pick_podcasts(podcast_data, duration):
    """
    Generate podcast playlist with specified maximum duration
    """
    # Convert minutes to seconds
    duration = duration * 60

    # Copy podcast data into new list
    extra_data = podcast_data.copy()

    # Randomly shuffle podcast list
    random.shuffle(extra_data)

    # Keep moving items from podcast list to playlist until maximum duration is reached
    playlist_data = []
    for playlist_item in extra_data:
        if playlist_item["duration"] < duration:
            extra_data.remove(playlist_item)
            playlist_data.append(playlist_item)
            duration -= playlist_item["duration"]
        if duration < 0:
            break

    return playlist_data, extra_data
