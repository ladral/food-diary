import json
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from food.models import FoodCategory

class Command(BaseCommand):
    help = 'Seed the database with default food categories'

    def handle(self, *args, **kwargs):
        json_file_path = os.path.join(os.path.dirname(__file__), '../../..', 'data_seed', 'swiss_nutritional_database', settings.SWISS_NUTRITIONAL_DATABASE_VERSION + '/categories.json')

        with open(json_file_path, encoding='utf-8') as f:
            categories = json.load(f)

        for category in categories:
            FoodCategory.objects.update_or_create(
                id=category['id'],
                defaults={'name': category['name']}
            )

        self.stdout.write(self.style.SUCCESS('Successfully updated food categories'))
