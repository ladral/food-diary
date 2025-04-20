from django.contrib.auth.models import User
from django.core.management import BaseCommand

from symptoms.models import Symptom


class Command(BaseCommand):
    help = 'Seed demo user symptoms'

    def handle(self, *args, **kwargs):
        user_instance = User.objects.get(id=9999)

        symptom_obj= Symptom(
            id=9999,
            name="Gelenkschmerzen",
            user_id=user_instance,
        )
        (symptom_obj.save())
