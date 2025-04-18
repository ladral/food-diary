from django.contrib import admin

from .models import Symptom, SymptomAdmin

admin.site.register(Symptom, SymptomAdmin)