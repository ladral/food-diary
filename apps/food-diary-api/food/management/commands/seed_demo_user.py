from django.contrib.auth.models import User
from django.core.management import BaseCommand


class Command(BaseCommand):
    help = 'Seed demo user'

    def handle(self, *args, **kwargs):
        user_instance, created = User.objects.get_or_create(
            id=9999,
            defaults={
                'username': 'alice_wonderland',
                'email': 'alice@wonderland.ch',
            }
        )