from typing import Required

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter

from diary.enums import EntryType
from food.models import Intake
from symptoms.models import Occurrence

intake_occurrence_response_schema = {
    'type': 'object',
    'properties': {
        'id': {
            'type': 'integer',
            'description': 'The unique identifier for the entry'
        },
        'date': {
            'type': 'string',
            'format': 'date',
            'description': 'The date of the entry'
        },
        'name': {
            'type': 'string',
            'description': 'The name of the food or symptom'
        },
        'type': {
            'type': 'string',
            'enum': ['intake', 'occurrence'],
            'description': 'The type of entry (food intake or symptom occurrence)'
        }
    },
    'required': ['id', 'date', 'name', 'type']
}


class UserEntriesPagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    max_page_size = 100


@extend_schema_view(
    get=extend_schema(
        responses={
            200: {
                'type': 'array',
                'items': intake_occurrence_response_schema
            }
        },
        tags=['User Entries'],
        summary='Retrieve all intakes and occurrences for the user',
        description='This endpoint returns a list of all food intakes and symptom occurrences for the authenticated user, including the ID, date, name, and type of each entry. Use the `all` query parameter to retrieve all entries without pagination.',
        parameters=[
            OpenApiParameter(name='all', description='Set to true to retrieve all entries without pagination.', type=bool, required=False),
            OpenApiParameter(name='page', description='The page number to retrieve (default is 1).', type=int, required=False),
            OpenApiParameter(name='page_size', description='The number of entries to return per page (default is 10, max is 100).', type=int, required=False),
        ]
    )
)
class UserEntriesAPIView(APIView):
    pagination_class = UserEntriesPagination

    def get(self, request):
        user = request.user
        all_entries = []

        intakes = Intake.objects.filter(user_id=user).select_related('food_id')
        intake_data = [
            {
                "id": intake.id,
                "date": intake.date,
                "name": intake.food_id.name,
                "type": EntryType.FOOD.value
            }
            for intake in intakes
        ]
        all_entries.extend(intake_data)

        occurrences = Occurrence.objects.filter(user_id=user).select_related('symptom_id')
        occurrence_data = [
            {
                "id": occurrence.id,
                "date": occurrence.date,
                "name": occurrence.symptom_id.name,
                "type": EntryType.SYMPTOM.value
            }
            for occurrence in occurrences
        ]
        all_entries.extend(occurrence_data)

        all_entries.sort(key=lambda x: x['date'], reverse=True)

        if request.query_params.get('all', 'false').lower() == 'true':
            return Response(all_entries, status=status.HTTP_200_OK)

        paginator = self.pagination_class()
        paginated_entries = paginator.paginate_queryset(all_entries, request)

        return paginator.get_paginated_response(paginated_entries)
