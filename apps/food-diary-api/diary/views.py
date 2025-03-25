from rest_framework import viewsets
from .models import DiaryEntry
from .serializers import DiaryEntrySerializer

class DiaryEntryViewSet(viewsets.ModelViewSet):
    queryset = DiaryEntry.objects.all()
    serializer_class = DiaryEntrySerializer