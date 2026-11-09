import logging
import os

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .agent import run_shopping_agent
from .serializers import AssistantChatSerializer

logger = logging.getLogger(__name__)


class AssistantChatView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AssistantChatSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not os.getenv("GROQ_API_KEY"):
            return Response(
                {"detail": "AI assistant is not configured yet. Add GROQ_API_KEY to backend/.env."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            result = run_shopping_agent(
                message=serializer.validated_data["message"],
                history=serializer.validated_data.get("history", []),
                request=request,
            )
            return Response(result, status=status.HTTP_200_OK)
        except Exception:
            logger.exception("T Palace AI assistant request failed")
            return Response(
                {"detail": "The AI assistant is temporarily unavailable. Please try again."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
