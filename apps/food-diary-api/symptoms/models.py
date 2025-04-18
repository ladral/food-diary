from django.contrib.auth.models import User
from django.db import models
from django.contrib import admin

class Symptom(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class SymptomAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)


class Occurrence(models.Model):
    id = models.AutoField(primary_key=True)
    symptom_id = models.ForeignKey(Symptom, related_name='occurrence', on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()

    def __str__(self):
        return f"Occurrence ID: {self.id}"

class OccurrenceAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)