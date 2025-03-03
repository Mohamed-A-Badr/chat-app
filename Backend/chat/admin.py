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
        "chat",
    )
    list_filter = ("timestamp", "group", "chat")

    def truncated_content(self, obj):
        return obj.content[:50] + "..." if len(obj.content) > 50 else obj.content
    truncated_content.short_description = "Content"


@admin.register(PrivateChat)
class PrivateChatAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user_1",
        "user_2",
        "created_at",
    )
    list_filter = ("created_at",)
