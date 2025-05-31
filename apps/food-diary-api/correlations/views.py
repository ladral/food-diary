from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from correlations.service import find_correlations


class CorrelationView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        ignored_foods_param = request.query_params.get('ignored_foods', '')
        ignored_foods = [int(food_id) for food_id in ignored_foods_param.split(',') if food_id.strip().isdigit()]

        correlations = find_correlations(user, ignored_food_ids=ignored_foods)

        return Response(correlations)
