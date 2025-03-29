from rest_framework import viewsets

from food_diary_api.IsAuthenticatedOIDC import IsAuthenticatedOIDC
from .models import DiaryEntry
from .serializers import DiaryEntrySerializer

class DiaryEntryViewSet(viewsets.ModelViewSet):
    queryset = DiaryEntry.objects.all()
    serializer_class = DiaryEntrySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            # No authentication required for list and retrieve
            return []
        elif self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Authentication required for create, update, and delete
            return [IsAuthenticatedOIDC()]
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