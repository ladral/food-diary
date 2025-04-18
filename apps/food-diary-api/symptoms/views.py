from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import viewsets, status
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.response import Response

from symptoms.models import Symptom
from symptoms.serializer import SymptomSerializer


@extend_schema_view(
    list=extend_schema(responses={200: SymptomSerializer(many=True)}, tags=['Symptom']),
    retrieve=extend_schema(responses={200: SymptomSerializer}, tags=['Symptom']),
    create=extend_schema(request=SymptomSerializer, responses={200: SymptomSerializer}, tags=['Symptom']),
    update=extend_schema(request=SymptomSerializer, responses={200: SymptomSerializer}, tags=['Symptom']),
    partial_update=extend_schema(exclude=True),
    destroy=extend_schema(responses={204: None}, tags=['Symptom']),
)
class SymptomsViewSet(viewsets.ModelViewSet):
    queryset = Symptom.objects.all()
    serializer_class = SymptomSerializer

    def get_queryset(self):
        user = self.request.user
        return Symptom.objects.filter(user_id=user)

    def create(self, request, *args, **kwargs):
        serializer = SymptomSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user

        symptom = serializer.save(user_id=user)
        response_serializer = self.get_serializer(symptom)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PATCH method is not allowed.")