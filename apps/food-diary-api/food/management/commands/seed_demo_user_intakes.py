import json
import os
from datetime import date, timedelta

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from food.models import Intake, Food


class Command(BaseCommand):
    help = 'Seed demo user food intakes'

    def handle(self, *args, **kwargs):

        user_instance = User.objects.get(id=9999)

        intakes_demo_data = os.path.join(os.path.dirname(__file__), '../../..', 'data_seed', 'demo_user_data', 'intakes.json')

        with open(intakes_demo_data, encoding='utf-8') as f:
            intakes = json.load(f)

        current_date = date.today()

        for intake in intakes:
            days_ago = intake['days_ago']
            food_id = intake['food_id']
            intake_id = intake['id']

            intake_date = current_date - timedelta(days=days_ago)

            try:
                food_instance = Food.objects.get(id=food_id)
            except Food.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'Food with ID {food_id} does not exist.'))
                continue

            intake_obj = Intake.objects.get_or_create(
                id= intake_id,
                date=intake_date,
                food_id=food_instance,
                user_id=user_instance,
            )

            self.stdout.write(self.style.SUCCESS(f'Intake created: {intake_obj}'))
