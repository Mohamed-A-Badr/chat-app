import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser

from .models import Message, Room


class ChatGroupConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.name = self.scope["url_route"]["kwargs"]["group_name"]
        self.group_name = f"chat_{self.name}"

        if self.scope["user"] == AnonymousUser():
            await self.accept()
            await self.send(text_data=json.dumps({"error": "Unauthorize User"}))
            await self.close(code=4003)
            return

        self.group = await self.is_group_exist()

        if not self.group:
            await self.accept()
            await self.send(text_data=json.dumps({"error": "This group don't exist"}))
            await self.close(code=4001)
            return

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.get_history()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data=None):
        json_text = json.loads(text_data)

        message = json_text["message"]
        user = self.scope["user"]

        await self.save_message(message, user)

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "chat.message",
                "message": message,
            },
        )

    async def chat_message(self, event):
        message = event["message"]

        await self.send(text_data=json.dumps({"message": message}))

    @database_sync_to_async
    def save_message(self, message, user):
        if self.group is None:
            return None
        return Message.objects.create(content=message, sender=user, group=self.group)

    @database_sync_to_async
    def is_group_exist(self):
        return Room.objects.filter(name=self.name).first()

    @database_sync_to_async
    def list_past_message(self):
        return list(Message.objects.filter(group=self.group).order_by("-timestamp"))

    async def get_history(self):
        messages = await self.list_past_message()
        messages.reverse()

        history = [
            {
                "message": msg.content,
                "sender": await database_sync_to_async(lambda: msg.sender.username)(),
                "timestamp": msg.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                "group": await database_sync_to_async(lambda: msg.group.name)(),
            }
            for msg in messages
        ]

        await self.send(text_data=json.dumps({"history": history}))
