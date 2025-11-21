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
    playlist_data = []
    best_path = params["best_path"]
    for i in range(len(best_path)):
        if not best_path[i]:
            continue
        else:
            # Move episode to playlist
            playlist_data.append(podcast_data.pop(i))

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
    # Construct current playlist
    current_playlist = []
    current_duration = 0

    for i in range(len(path)):
        if not path[i]:
            continue
        current_playlist.append(podcast_data[i])
        current_duration += podcast_data[i]["duration"]
    
    # Base case: There are no items left, or no more items can be added without exceeding target duration
    if len(path) >= len(podcast_data) or current_duration + params["duration_min"] > params["duration"]:
        
        # Calculate playlist score
        score = calculate_playlist_score(current_playlist, current_duration, params["duration"])

        # If playlist score exceeds current best score, update best playlist
        if score > params["best_score"]:
            params["best_score"] = score
            params["best_path"] = path
        
        return
    
    # Calculate optimistic upper bound for current branch
    upper_bound = calculate_upper_bound(current_playlist, current_duration, path, podcast_data, params)

    # If upper bound is below current best score, prune current branch
    if upper_bound < params["best_score"]:
        return
    
    # Recursively consider left and right branches
    branch_and_bound(podcast_data, params, path + [True])
    branch_and_bound(podcast_data, params, path + [False])


def calculate_playlist_score(current_playlist, current_duration, duration):
    """
    Calculate playlist score for a given playlist
    Diversity score = Number of unique series / Number of episodes
    Duration score = Playlist duration / Target duration
    Playlist score = Average episode ranking * Diversity score * Duration score
    """
    # If playlist is empty or exceeds target duration, return 0
    if len(current_playlist) == 0 or current_duration > duration:
        return 0
    
    # Calculate average episode ranking
    ranking_score = sum(episode["ranking"] for episode in current_playlist) / len(current_playlist)

    # Calculate diversity score
    unique_series_uuids = {episode["podcastSeries"]["uuid"] for episode in current_playlist}
    diversity_score = len(unique_series_uuids) / len(current_playlist)

    # Calculate duration score
    duration_score = current_duration / duration

    # Calculate playlist score
    return ranking_score * diversity_score * duration_score


def calculate_upper_bound(current_playlist, current_duration, path, podcast_data, params):
    """
    Calculate optimistic upper bound for the current branch
    """
    # Calculate maximum number of remaining episodes
    max_remaining_episodes = (params["duration"] - current_duration) // params["duration_min"]

    # Calculate ranking upper bound
    # Ranking upper bound = Average ranking of (episodes in current playlist + next highest-ranking episode)
    rankings = [episode["ranking"] for episode in current_playlist] + [podcast_data[len(path)]["ranking"]]
    ranking_bound = sum(rankings) / len(rankings)

    # Calculate diversity upper bound
    # Assume that the maximum number of remaining episodes will be added, all of which will be unique
    current_repeats = len(current_playlist) - len({episode["podcastSeries"]["uuid"] for episode in current_playlist})
    diversity_bound = (current_repeats + max_remaining_episodes) / (len(current_playlist) + max_remaining_episodes)

    # Set duration upper bound
    # Assume that the full target duration will be reached
    duration_bound = 1

    # Calculate playlist score
    return ranking_bound * diversity_bound * duration_bound