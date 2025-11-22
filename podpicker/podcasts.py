import nh3, os, requests, time

from datetime import datetime

from .models import PodcastSeries, PodcastEpisode


# Max number of results per API call
API_PAGE_LIMIT = 25

# Min & max duration divisors
DURATION_DIVISOR_MIN = 2 # Find episodes of up to 1/2 the desired playlist duration
DURATION_DIVISOR_MAX = 6 # Find episodes of at least 1/6 the desired playlist duration


# HTML sanitizer
# Documentation: https://nh3.readthedocs.io/
nh3_cleaner = nh3.Cleaner(
    tags={"p", "br", "hr", "strong", "em", "b", "i", "u", "a"},
    attributes={
        "a": {"href"}
    },
    set_tag_attribute_values={
        "a": {
            "target": "_blank"
        }
    }
)


def get_podcasts(request):
    """
    Query Taddy Podcast API for suitable podcast episodes
    Returns a dict containing:
    - If successful, a `data` key with a list of podcast episodes
    - If unsuccessful, an `error` key with error information
    """
    # Construct API query
    try:
        duration = int(request.POST["duration"])
        (query, variables) = construct_api_query(request, duration)
    except:
        return {"error": {
            "error_heading": "Invalid request",
            "error_body": "Your query couldn't be processed. Please double-check and try again."
        }}

    # Send API query
    # Repeatedly query for more pages until at least 10 suitable episodes are found 
    page = 1
    podcast_data = []
    unique_uuids = set()
    rankings = {}

    while page <= 10 and len(podcast_data) < 10:
        variables["page"] = page

        # Send request
        try:
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
            raw_list = response.json()["data"]["search"]["podcastEpisodes"]
            ranking_list = response.json()["data"]["search"]["rankingDetails"]
            rankings.update({episode["uuid"] : episode["rankingScore"] for episode in ranking_list})
        except:
            return {"error": {
                "error_heading": "Connection failed",
                "error_body": "An error occurred in connecting to the podcast service. Please try again later."
            }}

        # Filter data for duplicates
        raw_list = [episode for episode in raw_list if episode["uuid"] not in unique_uuids and not unique_uuids.add(episode["uuid"])]
        
        # Process received data
        new_data = process_raw_data(request, raw_list)
        podcast_data.extend(new_data)

        # If there are no more non-duplicate results, exit loop
        has_next = False if len(new_data) < API_PAGE_LIMIT else True
        if len(new_data) == 0 or not has_next:
            break
    
    # If no episodes found, return error
    if len(podcast_data) == 0:
        return {"error": {
            "error_heading": "No podcasts found",
            "error_body": "No matching episodes could be found. Please expand your query and try again."
        }}
    
    # Insert search rankings
    for episode in podcast_data:
        episode["ranking"] = rankings[str(episode["uuid"])]
    
    # Process received data
    return {
        "data": podcast_data,
        "duration": duration
        }


def construct_api_query(request, duration):
    """
    Construct GraphQL query for Taddy API based on submitted form input
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
            $results_per_page: Int,
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
                limitPerPage: $results_per_page,
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
                rankingDetails {
                    id
                    uuid
                    rankingScore
                }
            }
        }
        """

    # Construct variable list
    variables = {
        "languages": request.POST.getlist("language"),
        "genres": request.POST.getlist("genre"),
        "duration_max": duration * 60 // DURATION_DIVISOR_MIN,
        "duration_min": duration * 60 // DURATION_DIVISOR_MAX,
        "results_per_page": API_PAGE_LIMIT
    }

    # Set search term
    if request.POST.get("term"):
        variables["term"] = request.POST.get("term")
    elif request.POST.getlist("genre"):
        # If no search terms have been entered, use genre selection
        variables["term"] = " ".join({word for genre in request.POST.getlist("genre") for word in genre.lower().split("_")} - {"podcastseries"})
    
    # Set sort order
    variables["sort"] = "EXACTNESS" if "term" in variables else "POPULARITY"

    # Compute publish date cut-off (as epoch time in seconds)
    try:
        recency = int(request.POST.get("date"))
    except:
        recency = 0
    if recency > 0:
        variables["date_earliest"] = int(time.time()) - recency * 24 * 60 * 60

    # User-specific series filters (logged-in users only)
    if request.user.is_authenticated:
        # Exclude blocked podcasts
        exclude_series = {str(uuid) for uuid in request.user.blocked_series.values_list("uuid", flat=True)}
        variables["series_exclude"] = list(exclude_series)
        
        # If searching for followed podcasts only
        if request.POST.get("source") == "following":
            include_series = {str(uuid) for uuid in request.user.followed_series.values_list("uuid", flat=True)}
            variables["series"] = list(include_series - exclude_series)
        
        # If searching for previously listened podcasts only
        if request.POST.get("source") == "history":
            include_series = request.user.get_finished_series()
            variables["series"] = list(include_series - exclude_series)
    
    return query, variables


def process_raw_data(request, raw_list):
    """
    Process raw podcast data received from the API.
    """
    processed_list = []

    # Check episode validity
    # - Discard episodes with no audio URL
    # - Discard episodes whose episodeType is not "FULL"
    # - Discard already finished episodes (logged-in users only)
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
