import random


def build_playlist(podcast_data, duration):
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
