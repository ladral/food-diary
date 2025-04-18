from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

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
        description='This endpoint returns a list of all food intakes and symptom occurrences for the authenticated user, including the ID, date, name, and type of each entry.'
    )
)
class UserEntriesAPIView(APIView):
    def get(self, request):
        user = request.user

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

        all_entries = intake_data + occurrence_data

        return Response(all_entries, status=status.HTTP_200_OK)