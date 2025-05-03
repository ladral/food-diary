from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import viewsets, status
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.response import Response

from symptoms.models import Symptom, Occurrence
from symptoms.serializer import SymptomSerializer, OccurrenceSerializer, OccurrenceCreateOrUpdateSerializer


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
        queryset = Symptom.objects.filter(user_id=user)
        search_term = self.request.query_params.get('search', None)

        if search_term:
            queryset = queryset.filter(name__icontains=search_term)

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = SymptomSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user

        symptom = serializer.save(user_id=user)
        response_serializer = self.get_serializer(symptom)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PATCH method is not allowed.")



@extend_schema_view(
    list=extend_schema(responses={200: OccurrenceSerializer(many=True)}, tags=['Occurrence']),
    retrieve=extend_schema(responses={200: OccurrenceSerializer}, tags=['Occurrence']),
    create=extend_schema(request=OccurrenceCreateOrUpdateSerializer, responses={201: OccurrenceSerializer}, tags=['Occurrence']),
    update=extend_schema(request=OccurrenceCreateOrUpdateSerializer, responses={200: OccurrenceSerializer}, tags=['Occurrence']),
    partial_update=extend_schema(exclude=True),
    destroy=extend_schema(responses={204: None}, tags=['Occurrence']),
)
class OccurrenceViewSet(viewsets.ModelViewSet):
    queryset = Occurrence.objects.all()
    serializer_class = OccurrenceSerializer

    def get_queryset(self):
        user = self.request.user
        return Occurrence.objects.filter(user_id=user)

    def create(self, request, *args, **kwargs):
        # user ID must be passed to the serializer to evaluate if a symptom belongs to the user or not
        serializer = OccurrenceCreateOrUpdateSerializer(data=request.data, user=request.user)
        serializer.is_valid(raise_exception=True)

        occurrence = serializer.save(user_id=request.user)
        response_serializer = self.get_serializer(occurrence)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        occurrence = self.get_queryset().filter(id=kwargs['pk']).first()

        if not occurrence:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # user ID must be passed to the serializer to evaluate if a symptom belongs to the user or not
        serializer = OccurrenceCreateOrUpdateSerializer(occurrence, data=request.data, user=request.user)
        serializer.is_valid(raise_exception=True)

        updated_occurrence = serializer.save(user_id=occurrence.user_id)
        response_serializer = self.get_serializer(updated_occurrence)
        return Response(response_serializer.data, status=status.HTTP_200_OK)


    def partial_update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PATCH method is not allowed.")


    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
