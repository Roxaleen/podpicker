from django.urls import path

from . import views

urlpatterns = [
    path("", views.view_picker, name="picker"),
    path("playlist", views.view_create_playlist, name="create_playlist"),
    path("player/<str:item_type>/<str:item_id>", views.view_player, name="player"),
    path("action/episode/finish", views.view_finish_episode, name="finish_episode"),
    path("action/episode/bookmark", views.view_bookmark_episode, name="bookmark_episode"),
    path("action/series/follow", views.view_follow_series, name="follow_series"),
    path("action/series/block", views.view_block_series, name="block_series"),
    path("profile/<str:list_type>", views.view_profile, name="profile"),
    path("profile/data/<str:list_type>", views.view_profile_data, name="profile_data"),
    path("login", views.view_login, name="login"),
    path("logout", views.view_logout, name="logout"),
    path("register", views.view_register, name="register")
]
