import json
import os
from django.core.management.base import BaseCommand
from food.models import Food, FoodCategory, Synonym

class Command(BaseCommand):
    help = 'Seed the database with food data'

    def handle(self, *args, **kwargs):
        json_file_path = os.path.join(os.path.dirname(__file__), '../..', 'data', 'swiss nutritional database', 'v_6_5', 'food_old.json')

        with open(json_file_path) as f:
            foods = json.load(f)

        for food in foods:
            name_data = food.get('names', [{}])[0]
            food_id = name_data.get('id')
            food_name = name_data.get('term')

            food_obj, created = Food.objects.update_or_create(
                id=food_id
            )

            food_obj.name = food_name
            food_obj.save()

            for category_id in food.get('categories', []):
                category_obj, _ = FoodCategory.objects.get_or_create(id=category_id)
                food_obj.categories.add(category_obj)

            synonyms_list = food.get('synonyms', [])
            if isinstance(synonyms_list, list):
                for synonym in synonyms_list:
                    synonym_obj, _ = Synonym.objects.update_or_create(
                        id=synonym['id'],
                        defaults={
                            'term': synonym['term']
                        }
                    )
                    food_obj.synonyms.add(synonym_obj)

        self.stdout.write(self.style.SUCCESS('Successfully updated food data'))
