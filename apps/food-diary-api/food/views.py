from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import viewsets, status
from rest_framework.exceptions import MethodNotAllowed, ValidationError
from rest_framework.response import Response

from food.models import Food, Intake
from food.serializer import FoodSerializer, IntakeSerializer, IntakeCreateSerializer


@extend_schema_view(
    list=extend_schema(responses={200: FoodSerializer(many=True)}, tags=['Food']),
    retrieve=extend_schema(responses={200: FoodSerializer}, tags=['Food']),
    create=extend_schema(exclude=True),
    update=extend_schema(exclude=True),
    partial_update=extend_schema(exclude=True),
    destroy=extend_schema(exclude=True),
)
class FoodsViewSet(viewsets.ModelViewSet):
    queryset = Food.objects.all()
    serializer_class = FoodSerializer

    def get_queryset(self):
        search = self.request.GET.get('search', None)
        if search is not None and search.strip() != '':
            foods = Food.objects.filter(name__icontains=search).distinct()
            synonyms = Food.objects.filter(synonyms__term__icontains=search).distinct()
            return foods | synonyms
        return Food.objects.all()

    def create(self, request, *args, **kwargs):
        raise MethodNotAllowed("POST method is not allowed.")

    def update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PUT method is not allowed.")

    def partial_update(self, request, *args, **kwargs):
        raise MethodNotAllowed("PATCH method is not allowed.")

    def destroy(self, request, *args, **kwargs):
        raise MethodNotAllowed("DELETE method is not allowed.")


@extend_schema_view(
    list=extend_schema(responses={200: IntakeSerializer(many=True)}, tags=['Intake']),
    retrieve=extend_schema(responses={200: IntakeSerializer}, tags=['Intake']),
    create=extend_schema(request=IntakeCreateSerializer, responses={201: IntakeSerializer}, tags=['Intake']),
    update=extend_schema(request=IntakeSerializer, responses={200: IntakeSerializer}, tags=['Intake']),
    partial_update=extend_schema(request=IntakeSerializer, responses={200: IntakeSerializer}, tags=['Intake']),
    destroy=extend_schema(responses={204: None}, tags=['Intake']),
)
class IntakeViewSet(viewsets.ModelViewSet):
    queryset = Intake.objects.all()
    serializer_class = IntakeSerializer

    def get_queryset(self):
        user = self.request.user
        return Intake.objects.filter(user_id=user)

    def create(self, request, *args, **kwargs):
        serializer = IntakeCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user

        intake = serializer.save(user_id=user)
        response_serializer = self.get_serializer(intake)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


def update(self, request, *args, **kwargs):
    return super().update(request, *args, **kwargs)


def partial_update(self, request, *args, **kwargs):
    return super().partial_update(request, *args, **kwargs)


def destroy(self, request, *args, **kwargs):
    return super().destroy(request, *args, **kwargs)

