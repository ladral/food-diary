from rest_framework import viewsets
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework.permissions import IsAuthenticated

from .models import DiaryEntry
from .serializers import DiaryEntrySerializer


@extend_schema_view(
    list=extend_schema(responses={200: DiaryEntrySerializer(many=True)}, tags=['Diary']),
    retrieve=extend_schema(responses={200: DiaryEntrySerializer}, tags=['Diary']),
    create=extend_schema(request=DiaryEntrySerializer, responses={201: DiaryEntrySerializer}, tags=['Diary']),
    update=extend_schema(request=DiaryEntrySerializer, responses={200: DiaryEntrySerializer}, tags=['Diary']),
    partial_update=extend_schema(request=DiaryEntrySerializer, responses={200: DiaryEntrySerializer}, tags=['Diary']),
    destroy=extend_schema(responses={204: None}, tags=['Diary']),
)
class DiaryEntryViewSet(viewsets.ModelViewSet):
    queryset = DiaryEntry.objects.all()
    serializer_class = DiaryEntrySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            # No authentication required for list and retrieve
            return []
        elif self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Authentication required for create, update, and delete
            return [IsAuthenticated()]
        return super().get_permissions()

    def list(self, request, *args, **kwargs):
        request.auth_required = False
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        request.auth_required = False
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        request.auth_required = False
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        request.auth_required = False
        return super().destroy(request, *args, **kwargs)