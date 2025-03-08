from urllib.parse import parse_qs

from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from jwt import DecodeError, ExpiredSignatureError, InvalidSignatureError
from jwt import decode as jwt_decode

from .models import CustomUser


class JWTAuthMiddleware(BaseMiddleware):
    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return AnonymousUser()

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        close_old_connections()
        try:
            # Check multiple sources for token
            token = None

            # 1. Check query string
            query_params = parse_qs(scope["query_string"].decode("utf-8"))
            if query_params and "token" in query_params:
                token = query_params["token"][0]

            # 2. Check headers (Postman WebSocket style)
            if not token and "headers" in scope:
                for name, value in scope["headers"]:
                    if name.decode("utf-8").lower() == "authorization":
                        # Assumes "Bearer <token>" format
                        token = value.decode("utf-8").split(" ")[-1]

            # 3. Check connection parameters
            if not token and "token" in scope:
                token = scope["token"]

            if not token:
                raise ValueError("No token found")

            payload = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            scope["user"] = await self.get_user(payload["user_id"])
        except (
            TypeError,
            KeyError,
            InvalidSignatureError,
            ExpiredSignatureError,
            DecodeError,
            ValueError,
        ):
            scope["user"] = AnonymousUser()

        return await self.inner(scope, receive, send)


def JWTAuthMiddlewareStack(inner):
    return JWTAuthMiddleware(AuthMiddlewareStack(inner))
