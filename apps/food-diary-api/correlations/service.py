from collections import defaultdict
from food.models import Intake
from symptoms.models import Occurrence
from datetime import timedelta

def gather_intakes(user, ignored_food_ids=None):
    if ignored_food_ids is None:
        ignored_food_ids = []
    return Intake.objects.filter(user_id=user).exclude(food_id__in=ignored_food_ids).select_related('food_id')


def gather_occurrences(user):
    return Occurrence.objects.filter(user_id=user).select_related('symptom_id')


def calculate_phi(table):
    a, b, c, d = table  # a: no symptom, no food; b: no symptom, food; c: symptom, no food; d: symptom, food

    if a == 0 and b == 0 and c == 0 and d == 0:
        return 0

    denominator = ((c + d) * (a + b) * (b + d) * (a + c)) ** 0.5
    if denominator == 0:
        return -1

    return (d * a - c * b) / denominator


def calculate_correlations(intakes, occurrences, days_back=1):
    correlation_map = defaultdict(lambda: defaultdict(list))
    all_dates = set(intake.date for intake in intakes).union(occurrence.date for occurrence in occurrences)

    unique_food_ids = set(intake.food_id.id for intake in intakes)
    unique_symptom_ids = set(occurrence.symptom_id.id for occurrence in occurrences)

    for food_id in unique_food_ids:
        for symptom_id in unique_symptom_ids:
            counts = [0, 0, 0, 0]
            occurrence_counts = {
                "no_symptom_no_food": 0,
                "no_symptom_food": 0,
                "symptom_no_food": 0,
                "symptom_food": 0
            }

            for date in sorted(all_dates):
                food_taken = any(
                    intake.date >= date - timedelta(days=days_back) and intake.date <= date - timedelta(days=days_back) and intake.food_id.id == food_id
                    for intake in intakes
                )
                symptom_occurred = any(
                    occurrence.date == date and occurrence.symptom_id.id == symptom_id for occurrence in occurrences)

                if not symptom_occurred and not food_taken:
                    counts[0] += 1
                    occurrence_counts["no_symptom_no_food"] += 1
                elif not symptom_occurred and food_taken:
                    counts[1] += 1
                    occurrence_counts["no_symptom_food"] += 1
                elif symptom_occurred and not food_taken:
                    counts[2] += 1
                    occurrence_counts["symptom_no_food"] += 1
                elif symptom_occurred and food_taken:
                    counts[3] += 1
                    occurrence_counts["symptom_food"] += 1

            correlation_coefficient = calculate_phi(counts)

            filtered_intakes = [intake for intake in intakes if intake.food_id.id == food_id]
            matching_intake = filtered_intakes[0] if filtered_intakes else None

            if matching_intake:
                correlation_map[symptom_id][food_id] = {
                    "food_name": matching_intake.food_id.name,
                    "correlation_coefficient": correlation_coefficient,
                    "occurrence_counts": occurrence_counts
                }

    return correlation_map


def find_correlations(user, days_back=1, ignored_food_ids=None):
    intakes = gather_intakes(user, ignored_food_ids)
    occurrences = gather_occurrences(user)
    correlation_map = calculate_correlations(intakes, occurrences, days_back)

    response = {
        "correlations": []
    }

    for symptom_id, food_correlations in correlation_map.items():
        symptom_name = occurrences.filter(symptom_id=symptom_id).first().symptom_id.name
        sorted_food_list = sorted(
            [
                {
                    "food_id": food_id,
                    "food_name": food_info["food_name"],
                    "correlation_coefficient": food_info["correlation_coefficient"],
                    "occurrence_counts": food_info["occurrence_counts"]
                }
                for food_id, food_info in food_correlations.items()
            ],
            key=lambda x: x["correlation_coefficient"],
            reverse=True
        )

        response["correlations"].append({
            "symptom_id": symptom_id,
            "symptom_name": symptom_name,
            "food_correlations": sorted_food_list
        })

    return response
