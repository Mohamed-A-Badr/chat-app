from rest_framework import serializers

from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ("name",)

    def validate(self, attrs):
        name = attrs.get("name")

        if Room.objects.filter(name=name).exists():
            raise serializers.ValidationError("Group with this name already exits")

        return super().validate(attrs)


class GroupListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ("name",)
