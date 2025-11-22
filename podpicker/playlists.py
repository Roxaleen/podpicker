from datetime import datetime


def build_playlist(podcast_data, duration):
    """
    Generate podcast playlist with specified target duration
    Returns two separate lists: one containing playlist items and one containing unused items
    """
    # Convert minutes to seconds
    duration = duration * 60

    # Adjust rankings to account for recency
    adjust_rankings(podcast_data)

    # Sort episodes by ranking
    podcast_data.sort(key=lambda episode: episode["ranking"], reverse=True)

    # Determine shortest episode duration
    duration_min = min(podcast_data, key=lambda episode: episode["duration"])["duration"]

    # Perform branch and bound algorithm to determine best playlist
    params = {
        "duration": duration,
        "duration_min": duration_min,
        "best_score": 0,
        "best_path": []
    }
    branch_and_bound(podcast_data, params)

    # Construct best playlist
    # Start from back of list to avoid shifting indices when items are removed from list
    playlist_data = []
    best_path = params["best_path"]
    for i in reversed(range(len(best_path))):
        if not best_path[i]:
            continue
        else:
            # Move episode to playlist
            playlist_data.append(podcast_data.pop(i))
    playlist_data.reverse()

    # Re-sort remaining episodes by series
    podcast_data.sort(key=lambda episode: str(episode["podcastSeries"]["uuid"]))

    return playlist_data, podcast_data


def adjust_rankings(podcast_data):
    """
    Adjust search rankings to account for episode recency
    Original rankings (0-100) reflect the relevance of a search result
    Adjusted ranking = Original ranking - Months since publish date (capped at 20)
    """
    now = datetime.now()
    for episode in podcast_data:
        try:
            published = episode["published"]
            ranking = episode["ranking"]
            episode["ranking"] = max(ranking - min((now - published).days // 30, 20), 0)
        except:
            continue


def branch_and_bound(podcast_data, params, path=[]):
    """
    Recursively perform branch and bound algorithm on possible playlists
    """
    # Calculate playlist parameters
    playlist_params = calculate_playlist_params(path, podcast_data)

    # Base case: Playlist duration exceeds target duration
    if playlist_params["duration"] > params["duration"]:
        return
    
    # Base case: There are no items left, or no more items can be added without exceeding target duration
    if playlist_params["next_ranking"] is None or playlist_params["duration"] + params["duration_min"] > params["duration"]:
        
        # Calculate playlist score
        score = calculate_playlist_score(playlist_params, params)

        # If playlist score exceeds current best score, update best playlist
        if score > params["best_score"]:
            params["best_score"] = score
            params["best_path"] = path
        
        return
    
    # Calculate optimistic upper bound for current branch
    upper_bound = calculate_upper_bound(playlist_params, params)

    # If upper bound is below current best score, prune current branch
    if upper_bound < params["best_score"]:
        return
    
    # Recursively consider left and right branches
    branch_and_bound(podcast_data, params, path + [True])
    branch_and_bound(podcast_data, params, path + [False])


def calculate_playlist_params(path, podcast_data):
    """
    Calculate the necessary variables for evaluating or approximating playlist score
    """
    duration = 0
    ranking_total = 0
    episode_count = 0
    series_uuids = set()

    for i in range(len(path)):
        if not path[i]:
            continue
        duration += podcast_data[i]["duration"]
        ranking_total += podcast_data[i]["ranking"]
        episode_count += 1
        series_uuids.add(podcast_data[i]["podcastSeries"]["uuid"])
    
    return {
        "duration": duration,
        "ranking_total": ranking_total,
        "episode_count": episode_count,
        "series_count": len(series_uuids),
        "next_ranking": None if len(path) == len(podcast_data) else podcast_data[len(path)]["ranking"]
    }


def calculate_playlist_score(playlist_params, params):
    """
    Calculate playlist score for a given playlist
    Diversity score = Number of unique series / Number of episodes
    Duration score = Playlist duration / Target duration
    Playlist score = Average episode ranking * Diversity score * (Duration score)^2
    """
    # If playlist is empty, score = 0
    if playlist_params["episode_count"] == 0:
        return 0
    
    # Calculate average episode ranking
    ranking_score = playlist_params["ranking_total"] / playlist_params["episode_count"]

    # Calculate diversity score
    diversity_score = playlist_params["series_count"] / playlist_params["episode_count"]

    # Calculate duration score
    duration_score = playlist_params["duration"] / params["duration"]

    # Calculate playlist score
    return ranking_score * diversity_score * (duration_score * duration_score)


def calculate_upper_bound(playlist_params, params):
    """
    Calculate optimistic upper bound for the current branch
    """
    # Calculate maximum number of remaining episodes
    max_remaining_episodes = (params["duration"] - playlist_params["duration"]) // params["duration_min"]

    # Calculate ranking upper bound
    # Ranking upper bound = Average ranking of (episodes in current playlist + next highest-ranking episode)
    ranking_bound = (playlist_params["ranking_total"] + playlist_params["next_ranking"]) / (playlist_params["episode_count"] + 1)

    # Calculate diversity upper bound
    # Assume that the maximum number of remaining episodes will be added, all of which will be unique
    diversity_bound = (playlist_params["series_count"] + max_remaining_episodes) / (playlist_params["episode_count"] + max_remaining_episodes)

    # Set duration upper bound
    # Assume that the full target duration will be reached
    duration_bound = 1

    # Calculate playlist score
    return ranking_bound * diversity_bound * (duration_bound * duration_bound)