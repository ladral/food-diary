from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiParameter
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from correlations.service import find_correlations

correlation_response_schema = {

    'type': 'object',
    'properties': {
        'symptom_id': {
            'type': 'integer',
            'description': 'The unique identifier for the symptom'
        },
        'symptom_name': {
            'type': 'string',
            'description': 'The name of the symptom'
        },
        'food_correlations': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'food_id': {
                        'type': 'integer',
                        'description': 'The unique identifier for the food'
                    },
                    'food_name': {
                        'type': 'string',
                        'description': 'The name of the food'
                    },
                    'correlation_coefficient': {
                        'type': 'number',
                        'description': 'The correlation coefficient of the food related to the symptom'
                    },
                    'occurrence_counts': {
                        'type': 'object',
                        'properties': {
                            'no_symptom_no_food': {
                                'type': 'integer',
                                'description': 'Count of occurrences with no symptom and no food'
                            },
                            'no_symptom_food': {
                                'type': 'integer',
                                'description': 'Count of occurrences with no symptom but with food'
                            },
                            'symptom_no_food': {
                                'type': 'integer',
                                'description': 'Count of occurrences with symptom but no food'
                            },
                            'symptom_food': {
                                'type': 'integer',
                                'description': 'Count of occurrences with both symptom and food'
                            }
                        },
                        'required': ['no_symptom_no_food', 'no_symptom_food', 'symptom_no_food',
                                     'symptom_food']
                    }
                },
                'required': ['food_id', 'food_name', 'correlationCoefficient',
                             'occurrence_counts']
            }
        }
    },
    'required': ['symptom_id', 'symptom_name', 'food_correlations']
}


@extend_schema_view(
    get=extend_schema(
        responses={
            200: {
                'type': 'object',
                'properties': {
                    'correlations': {
                        'type': 'array',
                        'items': correlation_response_schema
                    }
                }
            }
        },

        parameters=[
            OpenApiParameter('ignored_foods', OpenApiTypes.STR,
                             description='Comma-separated list of food IDs to ignore')
        ],
        tags=['Correlations']
    )
)
class CorrelationView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        ignored_foods_param = request.query_params.get('ignored_foods', '')
        ignored_foods = [int(food_id) for food_id in ignored_foods_param.split(',') if food_id.strip().isdigit()]

        correlations = find_correlations(user, ignored_food_ids=ignored_foods)

        return Response(correlations)
