from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from correlations.service import find_correlations


class CorrelationView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        correlations = find_correlations(user)
        return Response(correlations)