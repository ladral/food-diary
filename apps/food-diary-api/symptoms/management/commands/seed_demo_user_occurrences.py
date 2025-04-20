import json
import os
from datetime import date, timedelta

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from food.models import Intake, Food
from symptoms.models import Symptom, Occurrence


class Command(BaseCommand):
    help = 'Seed demo user food intakes'

    def handle(self, *args, **kwargs):

        user_instance = User.objects.get(id=9999)

        occurrence_demo_data = os.path.join(os.path.dirname(__file__), '../../..', 'data_seed', 'demo_user_data', 'occurrence.json')

        with open(occurrence_demo_data, encoding='utf-8') as f:
            occurrences = json.load(f)

        current_date = date.today()

        for occurrence in occurrences:
            days_ago = occurrence['days_ago']
            symptom_id = occurrence['symptom_id']
            occurrence_id = occurrence['id']

            occurrence_date = current_date - timedelta(days=days_ago)

            try:
                symptom_instance = Symptom.objects.get(id=symptom_id)
            except Symptom.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'Symptom with ID {symptom_id} does not exist.'))
                continue

            occurrence_obj = Occurrence.objects.get_or_create(
                id = occurrence_id,
                date=occurrence_date,
                symptom_id=symptom_instance,
                user_id=user_instance,
            )

            self.stdout.write(self.style.SUCCESS(f'Occurrence created: {occurrence_obj}'))
