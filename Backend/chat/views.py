from rest_framework import generics, permissions

from .serializers import RoomSerializer
from .models import Room


class CreateRoomView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]


create_group = CreateRoomView.as_view()
