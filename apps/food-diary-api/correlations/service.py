from collections import defaultdict
from food.models import Intake
from symptoms.models import Occurrence
from datetime import timedelta

def phi(table):
    a, b, c, d = table  # a: no symptom, no food; b: no symptom, food; c: symptom, no food; d: symptom, food

    denominator = ((c + d) * (a + b) * (b + d) * (a + c)) ** 0.5

    if denominator == 0:
        return 0

    return (d * a - c * b) / denominator

def find_correlations(user, days_back=1):
    intakes = Intake.objects.filter(user_id=user).select_related('food_id')
    occurrences = Occurrence.objects.filter(user_id=user).select_related('symptom_id')

    correlation_map = defaultdict(lambda: defaultdict(list))

    all_dates = set(intake.date for intake in intakes).union(occurrence.date for occurrence in occurrences)

    unique_food_ids = set(intake.food_id.id for intake in intakes)
    unique_symptom_ids = set(occurrence.symptom_id.id for occurrence in occurrences)

    for food_id in unique_food_ids:
        for symptom_id in unique_symptom_ids:
            counts = [0, 0, 0, 0]

            for date in sorted(all_dates):
                food_taken = any(
                    intake.date >= date - timedelta(days=days_back) and intake.date <= date - timedelta(days=days_back) and intake.food_id.id == food_id
                    for intake in intakes
                )
                symptom_occurred = any(
                    occurrence.date == date and occurrence.symptom_id.id == symptom_id for occurrence in occurrences)

                if not symptom_occurred and not food_taken:
                    counts[0] += 1
                elif not symptom_occurred and food_taken:
                    counts[1] += 1
                elif symptom_occurred and not food_taken:
                    counts[2] += 1
                elif symptom_occurred and food_taken:
                    counts[3] += 1

            correlation_coefficient = phi(counts)

            correlation_map[symptom_id][food_id] = {
                "food_name": intakes.filter(food_id=food_id).first().food_id.name,
                "correlation_coefficient": correlation_coefficient
            }

    response = {
        "correlations": []
    }

    for symptom_id, food_correlations in correlation_map.items():
        symptom_name = occurrences.filter(symptom_id=symptom_id).first().symptom_id.name
        food_list = [
            {
                "food_id": food_id,
                "food_name": food_info["food_name"],
                "correlation_coefficient": food_info["correlation_coefficient"]
            }
            for food_id, food_info in food_correlations.items()
        ]

        response["correlations"].append({
            "symptom_id": symptom_id,
            "symptom_name": symptom_name,
            "food_correlations": food_list
        })

    return response
