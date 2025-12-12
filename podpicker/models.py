from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class User(AbstractUser):
    finished_episodes = models.ManyToManyField("PodcastEpisode", related_name="+")
    bookmarked_episodes = models.ManyToManyField("PodcastEpisode", related_name="+")
    followed_series = models.ManyToManyField("PodcastSeries", related_name="+")
    blocked_series = models.ManyToManyField("PodcastSeries", related_name="+")

    def __str__(self):
        return self.username

    def get_finished(self):
        return [rel.podcastepisode.get_metadata(self) for rel in User.finished_episodes.through.objects.filter(user=self).order_by("-id")]

    def get_bookmarked(self):
        return [rel.podcastepisode.get_metadata(self) for rel in User.bookmarked_episodes.through.objects.filter(user=self).order_by("-id")]

    def get_followed(self):
        return [rel.podcastseries.get_metadata(self) for rel in User.followed_series.through.objects.filter(user=self).order_by("-id")]

    def get_blocked(self):
        return [rel.podcastseries.get_metadata(self) for rel in User.blocked_series.through.objects.filter(user=self).order_by("-id")]

    def get_finished_series(self):
        return {str(rel.podcastepisode.series.uuid) for rel in User.finished_episodes.through.objects.filter(user=self).order_by("-id")}


class PodcastSeries(models.Model):
    uuid = models.UUIDField(primary_key=True, editable=False)
    hash = models.CharField(null=True)
    title = models.CharField()
    description = models.TextField()
    imageUrl = models.URLField(null=True)
    language = models.CharField()
    genres = models.JSONField(default=list)

    class Meta:
        verbose_name_plural = "podcast series"

    def __str__(self):
        return self.title

    # Get series info in dict format
    def get_metadata(self, user):
        metadata = {
            "uuid": self.uuid,
            "title": self.title,
            "description": self.description,
            "imageUrl": self.imageUrl,
            "language": self.language,
            "genres": self.genres
        }

        # Get user interaction state
        if user.is_authenticated:
            metadata["isFollowing"] = self in user.followed_series.all()
            metadata["isBlocked"] = self in user.blocked_series.all()

        return metadata


class PodcastEpisode(models.Model):
    uuid = models.UUIDField(primary_key=True, editable=False)
    hash = models.CharField(null=True)
    title = models.CharField()
    description = models.TextField()
    duration = models.IntegerField()
    imageUrl = models.URLField(null=True)
    audioUrl = models.URLField()
    published = models.DateTimeField(null=True)
    series = models.ForeignKey(PodcastSeries, on_delete=models.PROTECT, related_name="episodes")

    def __str__(self):
        return f"{self.series.title} | {self.title}"

    # Get episode info in dict format
    def get_metadata(self, user):
        metadata = {
            "uuid": self.uuid,
            "title": self.title,
            "description": self.description,
            "duration": self.duration,
            "imageUrl": self.imageUrl,
            "audioUrl": self.audioUrl,
            "published": None if self.published is None else self.published.timestamp(),
            "podcastSeries": self.series.get_metadata(user)
        }

        # Get user interaction state
        if user.is_authenticated:
            metadata["isFinished"] = self in user.finished_episodes.all()
            metadata["isBookmarked"] = self in user.bookmarked_episodes.all()

        return metadata


class Playlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, related_name="playlists")
    session = models.CharField(blank=True, null=True)
    episodes = models.ManyToManyField(PodcastEpisode, related_name="playlists")
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [models.CheckConstraint(
            condition=(models.Q(user__isnull=False) | models.Q(session__isnull=False)),
            name="playlist_user_or_session_required"
            )]

    def __str__(self):
        return f"Playlist ({self.episodes.count()} items) by {self.user.username if self.user else "Guest"}"

    # Get info for all episodes in list format
    def get_metadata_list(self, user):
        metadata_list = {
            "id": self.id,
            "created": self.created,
            "episodes": [episode.get_metadata(user) for episode in self.episodes.all()]
        }
        return metadata_list
