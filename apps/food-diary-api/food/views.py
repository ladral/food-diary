from rest_framework import viewsets
from rest_framework.exceptions import MethodNotAllowed

from food.models import Food
from food.serializer import FoodSerializer

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
