import json

from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.name = self.scope["url_route"]["kwargs"]["chat_name"]
        self.chat_name = f"chat_{self.name}"

        await self.channel_layer.group_add(self.chat_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.chat_name, self.channel_name)

    async def receive(self, text_data=None):
        json_text = json.loads(text_data)
        message = json_text["message"]

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
