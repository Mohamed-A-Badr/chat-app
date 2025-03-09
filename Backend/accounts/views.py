from typing import override
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import LogoutSerializer, RegisterSerializer, ProfileSerializer
from .models import CustomUser


class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            serializer.save()
            return Response(
                {"message": "User Created Successfully"},
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(TokenObtainPairView):
    pass


class RefreshTokenView(TokenRefreshView):
    pass


class LogoutView(generics.GenericAPIView):
    serializer_class = LogoutSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )
        try:
            refresh = serializer.validated_data["refresh"]
            token = RefreshToken(refresh)
            token.blacklist()
            return Response(
                {"message": "User Logout successfully"}, status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(generics.GenericAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class ListUserView(generics.ListAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    @override
    def get_queryset(self):
        try:
            users = CustomUser.objects.all().exclude(id=self.request.user.id)
            return users
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


register = RegisterView.as_view()
login = LoginView.as_view()
refresh_token = RefreshTokenView.as_view()
logout = LogoutView.as_view()
profile = ProfileView.as_view()
list_users = ListUserView.as_view()
