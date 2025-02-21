from rest_framework import serializers

from .models import CustomUser
import re


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = (
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
        )
        extra_kwarg = {"password": {"write_only": True}}

    def validate_password(self, value):
        if not re.findall("[A-Za-z0-9@#$%^&+=]{8,}", value) or len(value) > 150:
            raise serializers.ValidationError(
                "Password Should contain characters (upper and lower case) numbers and special characters and have 8 characters"
            )
        return value

    def create(self, validated_data):
        email = validated_data["email"]
        username = validated_data["username"]

        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError("This Email is already exist")
        if CustomUser.objects.filter(username=username).exists():
            raise serializers.ValidationError("This Username is already exists")

        return CustomUser.objects.create_user(**validated_data)


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    default_error_messages = {"bad_token": ("Token is expired or invalid")}
