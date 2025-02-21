import os

import jwt
from django.conf import settings
from django.utils.http import urlsafe_base64_decode

from .models import CustomUser, VerificationToken


def verify_email_link(uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = CustomUser.objects.get(pk=uid)
    except (TypeError, ValueError, CustomUser.DoesNotExist, OverflowError):
        return None
    verify_token = VerificationToken.objects.filter(token=token).first()
    if not verify_token:
        return None
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=os.environ.get("JWT_ALGORITHM")
        )
        if payload.get("user_id") == user.id:
            return user, payload.get("purpose"), verify_token
    except (jwt.DecodeError, jwt.ExpiredSignatureError):
        return None
