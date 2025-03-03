import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser

from .models import Message, Room, PrivateChat
from accounts.models import CustomUser
from django.db.models import Q

import logging


logger = logging.getLogger(__name__)


class ChatGroupConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.name = self.scope["url_route"]["kwargs"]["group_name"]
        self.group_name = f"chat_{self.name}"

        if self.scope["user"] == AnonymousUser():
            await self._reject_connection("Unauthorize User", 4001)
            return

        self.group = await self.is_group_exist()

        if not self.group:
            await self._reject_connection("This group don't exists", 4004)
            return

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.get_history()

    async def disconnect(self, code):
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

    async def _reject_connection(self, error_message, code):
        await self.accept()
        await self.send(text_data=json.dumps({"error": error_message}))
        await self.close(code=code)


class PrivateChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]

        logger.info(f"we got user {self.user} and user_id {self.user_id}")

        if self.user == AnonymousUser():
            await self._reject_connection("Unauthorize User", 4001)
            return

        logger.info(f"{self.user} is valid user")

        self.other_user = await self._is_user_exist()
        logger.info(f"we got the other user instance {self.other_user}")

        if not self.other_user:
            await self._reject_connection("User doesn't exist", 4004)
            return

        logger.info(f"we got the other user instance {self.other_user}")

        self.chat = await self.get_create_chat()

        self.chat_name = f"private_chat{self.chat.id}"

        await self.channel_layer.group_add(self.chat_name, self.channel_name)
        await self.accept()
        await self._history()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.chat_name, self.channel_name)

    async def receive(self, text_data=None):
        json_text = json.loads(text_data)

        message = json_text["message"]

        await self.save_message(message)

        await self.channel_layer.group_send(
            self.chat_name,
            {
                "type": "chat.message",
                "message": message,
            },
        )

    async def chat_message(self, event):
        message = event["message"]

        await self.send(text_data=json.dumps({"message": message}))

    @database_sync_to_async
    def save_message(self, message):
        if self.chat is None:
            return None
        return Message.objects.create(content=message, sender=self.user, chat=self.chat)

    @database_sync_to_async
    def _is_user_exist(self):
        return CustomUser.objects.filter(id=self.user_id).first()

    @database_sync_to_async
    def get_create_chat(self):
        chat = PrivateChat.objects.filter(
            (Q(user_1=self.user) & Q(user_2=self.other_user))
            | (Q(user_1=self.other_user) & Q(user_2=self.user))
        ).first()
        logger.info("Check if the chat id exist")
        if not chat:
            chat = PrivateChat.objects.create(user_1=self.user, user_2=self.other_user)
            logger.info("chat not exist, create a new one")
        logger.info(f"return chat {chat.id}")
        return chat

    @database_sync_to_async
    def list_past_message(self):
        return list(Message.objects.filter(chat=self.chat.id).order_by("-timestamp"))

    async def _history(self):
        messages = await self.list_past_message()
        messages.reverse()

        history = [
            {
                "message": msg.content,
                "sender": await database_sync_to_async(lambda: msg.sender.username)(),
                "timestamp": msg.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            }
            for msg in messages
        ]
        await self.send(text_data=json.dumps({"history": history}))

    async def _reject_connection(self, error_message, code):
        await self.accept()
        await self.send(text_data=json.dumps({"error": error_message}))
        await self.close(code=code)
