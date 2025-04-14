from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from food.models import (Food)
from food.serializer import FoodSerializer


class FoodsView(APIView):
    def get(self, request):
        search = request.GET.get('search', None)

        if search is not None and search.strip() != '':
            foods = Food.objects.filter(name__icontains=search).distinct()
            synonyms = Food.objects.filter(synonyms__term__icontains=search).distinct()
            results = foods | synonyms
        else:
            results = Food.objects.all()

        serializer = FoodSerializer(results, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
