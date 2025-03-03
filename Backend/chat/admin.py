from django.contrib import admin

from .models import Message, Room, PrivateChat


# Register your models here.
@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "created_at",
        "updated_at",
    )
    list_filter = ("created_at",)
    search_fields = ("name",)


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "content",
        "sender",
        "timestamp",
        "group",
    )


@admin.register(PrivateChat)
class PrivateChatAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user_1",
        "user_2",
        "created_at",
    )
    list_filter = ("created_at",)
    