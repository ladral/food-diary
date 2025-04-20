from django.contrib import admin

from .models import Symptom, SymptomAdmin, Occurrence, OccurrenceAdmin

admin.site.register(Symptom, SymptomAdmin)
admin.site.register(Occurrence, OccurrenceAdmin)