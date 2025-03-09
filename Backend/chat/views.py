from rest_framework import generics, permissions

from .serializers import RoomSerializer, GroupListSerializer
from .models import Room


class CreateRoomView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]


class ListGroupView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = GroupListSerializer
    permission_classes = [permissions.IsAuthenticated]


create_group = CreateRoomView.as_view()
list_group = ListGroupView.as_view()
