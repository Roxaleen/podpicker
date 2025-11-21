from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import redirect, render

from .models import *
from .podcasts import *
from .playlists import *


def view_picker(request):
    """
    Render (GET) or process (POST) podcast picker form
    """
    # If method is POST (user submitted podcast search form)
    if request.method == "POST":
        # Search podcasts
        data = get_podcasts(request)
        if "error" in data:
            return render(request, "podpicker/error.html", data["error"])
        
        # Create recommended playlist
        (playlist_data, extra_data) = build_playlist(data["data"], data["duration"])

        # Render result page
        return render(request, "podpicker/picker-selection.html", {
            "playlist_action": "select",
            "app_data": {
                "username": "" if not request.user.is_authenticated else request.user.username,
                "playlist_data": playlist_data,
                "extra_data": extra_data
            }
        })

    # If method is GET
    return render(request, "podpicker/picker-form.html")


def view_create_playlist(request):
    """
    Create new playlist
    """
    # Get list of playlist episodes
    episodes_uuids = request.POST.getlist("uuid")
    if len(episodes_uuids) == 0:
        return render(request, "podpicker/error.html")

    # Get current session key
    if not request.session.session_key:
        request.session.create() # If there's no existing session, create a new one

    # Create new playlist
    playlist = Playlist.objects.create(
        user = request.user if request.user.is_authenticated else None,
        session = None if request.user.is_authenticated else request.session.session_key
    )

    # Set playlist content
    for uuid in episodes_uuids:
        playlist.episodes.add(PodcastEpisode.objects.get(uuid=uuid))

    return redirect("player", item_type="playlist", item_id=str(playlist.id))


def view_player(request, item_type, item_id):
    """
    Play playlists or podcast episodes
    """
    # Get playlist data
    if item_type == "playlist":
        try:
            playlist = Playlist.objects.get(id=item_id)
            player_data = playlist.get_metadata_list(request.user)["episodes"]
        except:
            return render(request, "podpicker/error.html")
        player_info = f"Playlist by <strong>{'Guest' if playlist.user is None else playlist.user.username}</strong>"

    # Get episode data
    elif item_type == "episode":
        try:
            episode = PodcastEpisode.objects.get(uuid=item_id)
            player_data = [episode.get_metadata(request.user)]
        except:
            return render(request, "podpicker/error.html")
        player_info = f"Podcast episode"

    # If item type invalid, display error page
    else:
        return render(request, "podpicker/error.html")

    # Render player page
    return render(request, "podpicker/player.html", {
        "playlist_action": "play",
        "player_info": player_info,
        "app_data": {
            "username": "" if not request.user.is_authenticated else request.user.username,
            "player_data": player_data
        }
    })


@login_required
def view_finish_episode(request):
    """
    Mark an episode as finished
    """
    # Get target episode
    try:
        uuid = request.POST["uuid"]
        episode = PodcastEpisode.objects.get(uuid=uuid)
        finish_action = request.POST["finish"] == "true"
    except:
        return JsonResponse({"error": "Bad request"}, status=400)

    # Update finish status
    if finish_action:
        request.user.finished_episodes.add(episode)
    else:
        request.user.finished_episodes.remove(episode)

    return JsonResponse({"newStatus": finish_action}, status=200)


@login_required
def view_bookmark_episode(request):
    """
    Bookmark an episode
    """
    # Get target episode
    try:
        uuid = request.POST["uuid"]
        episode = PodcastEpisode.objects.get(uuid=uuid)
        bookmark_action = request.POST["bookmark"] == "true"
    except:
        return JsonResponse({"error": "Bad request"}, status=400)

    # Update finish status
    if bookmark_action:
        request.user.bookmarked_episodes.add(episode)
    else:
        request.user.bookmarked_episodes.remove(episode)

    return JsonResponse({"newStatus": bookmark_action}, status=200)


@login_required
def view_follow_series(request):
    """
    Follow a series
    """
    # Get target series
    try:
        uuid = request.POST["uuid"]
        series = PodcastSeries.objects.get(uuid=uuid)
        follow_action = request.POST["follow"] == "true"
    except:
        return JsonResponse({"error": "Bad request"}, status=400)

    # Update finish status
    if follow_action:
        request.user.followed_series.add(series)
    else:
        request.user.followed_series.remove(series)

    return JsonResponse({"newStatus": follow_action}, status=200)


@login_required
def view_block_series(request):
    """
    Block a series
    """
    # Get target series
    try:
        uuid = request.POST["uuid"]
        series = PodcastSeries.objects.get(uuid=uuid)
        block_action = request.POST["block"] == "true"
    except:
        return JsonResponse({"error": "Bad request"}, status=400)

    # Update finish status
    if block_action:
        request.user.blocked_series.add(series)
    else:
        request.user.blocked_series.remove(series)

    return JsonResponse({"newStatus": block_action}, status=200)


@login_required
def view_profile(request, list_type):
    """
    Display user profile page
    """
    if list_type == "finished" or list_type == "bookmarked":
        playlist_action = "go"
    elif list_type == "playlists" or list_type == "following" or list_type == "blocked":
        playlist_action = "none"
    else:
        return render(request, "podpicker/error.html")

    return render(request, "podpicker/profile.html", {
        "list_type": list_type,
        "playlist_action": playlist_action,
        "app_data": {
            "username": "" if not request.user.is_authenticated else request.user.username,
            "list_type": list_type
        }
    })


@login_required
def view_profile_data(request, list_type):
    """
    Get user-specific profile data
    """
    page_number = request.GET.get("page", 1)

    # Get playlists
    if list_type == "playlists":
        results = [playlist.get_metadata_list(request.user) for playlist in request.user.playlists.all().order_by("-created")]
        page = Paginator(results, 10).page(page_number)

    # Get finished episodes
    elif list_type == "finished":
        results = request.user.get_finished()
        page = Paginator(results, 30).page(page_number)

    # Get bookmarked episodes
    elif list_type == "bookmarked":
        results = request.user.get_bookmarked()
        page = Paginator(results, 30).page(page_number)

    # Get followed series
    elif list_type == "following":
        results = request.user.get_followed()
        page = Paginator(results, 30).page(page_number)

    # Get blocked series
    elif list_type == "blocked":
        results = request.user.get_blocked()
        page = Paginator(results, 30).page(page_number)

    else:
        return JsonResponse({"error": "Invalid list type"}, status=400)

    return JsonResponse({
        "has_next": page.has_next(),
        "items": list(page)
    }, status=200)


def view_login(request):
    """
    Log user in
    """
    # If method is POST (user submitted login form)
    if request.method == "POST":

        # Extract form input
        try:
            username = request.POST["username"]
            password = request.POST["password"]
        except:
            return render(request, "podpicker/login.html", {
                "error": "Invalid form input"
            })

        # Authenticate user
        user = authenticate(request, username=username, password=password)
        if user is None:
            return render(request, "podpicker/login.html", {
                "error": "Invalid username and/or password"
            })

        # Record current session key (if there is one)
        session_key = request.session.session_key

        # Log user in
        login(request, user)

        # Migrate any playlists created before login to user's account
        Playlist.objects.filter(session=session_key).update(user=user, session=None)

        # Redirect to target destination if applicable, else home
        return redirect(request.POST.get("next", "picker"))

    # If method is GET
    return render(request, "podpicker/login.html", {
        "next": request.GET.get("next")
    })


def view_logout(request):
    """
    Log user out
    """
    # Log user out
    logout(request)

    # Redirect to homepage
    return redirect("picker")


def view_register(request):
    """
    Register new user
    """
    # If method is POST (user submitted registration form)
    if request.method == "POST":

        # Extract form input
        try:
            username = request.POST["username"]
            password = request.POST["password"]
            password_confirm = request.POST["password-confirm"]
        except:
            return render(request, "podpicker/register.html", {
                "error": "Invalid form input"
            })

        # Check if passwords match
        if password != password_confirm:
            return render(request, "podpicker/register.html", {
                "error": "Mismatching passwords"
            })

        # Attempt to create user
        try:
            user = User.objects.create_user(username, password=password)
            user.save()
        except IntegrityError:
            return render(request, "podpicker/register.html", {
                "error": "Username unavailable"
            })

        # Record current session key (if there is one)
        session_key = request.session.session_key

        # Log user in
        login(request, user)

        # Migrate any playlists created before login to user's account
        Playlist.objects.filter(session=session_key).update(user=user, session=None)

        # Redirect to homepage
        return redirect("picker")

    # If method is GET
    return render(request, "podpicker/register.html")
