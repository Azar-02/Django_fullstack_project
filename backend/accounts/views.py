from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer
from rest_framework.permissions import IsAuthenticated
from .serializers import ProfileSerializer
from rest_framework.response import Response
from rest_framework import generics




class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]


class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user