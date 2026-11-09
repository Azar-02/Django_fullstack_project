from rest_framework import serializers


class AssistantChatSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=2000, allow_blank=False, trim_whitespace=True)
    history = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        allow_empty=True,
        max_length=12,
    )
