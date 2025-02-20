import json

from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data=None):
        message = "Empty Json"
        if text_data:
            json_data = json.loads(text_data)
            message = json_data["message"]

        await self.send(text_data=json.dumps({"message": message}))
