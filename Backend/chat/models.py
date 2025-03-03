from django.db import models
from django.utils.translation import gettext_lazy as _

from accounts.models import CustomUser


class PrivateChat(models.Model):
    user_1 = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="sender"
    )
    user_2 = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="receiver"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user_1", "user_2")

    def __str__(self):
        return f"Chat between {self.user_1} and {self.user_2}"


class Room(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Room")
        verbose_name_plural = _("Rooms")
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["name"]),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.name = self.name.lower()
        return super().save(*args, **kwargs)


class Message(models.Model):
    content = models.TextField()
    sender = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="messages"
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    group = models.ForeignKey(
        Room, on_delete=models.CASCADE, related_name="messages", null=True, blank=True
    )
    chat = models.ForeignKey(
        PrivateChat,
        on_delete=models.CASCADE,
        related_name="messages",
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = _("Message")
        verbose_name_plural = _("Messages")
