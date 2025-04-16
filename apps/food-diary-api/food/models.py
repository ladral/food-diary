from django.contrib.auth.models import User
from django.db import models
from django.contrib import admin


class FoodCategory(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class FoodCategoryAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)


class Synonym(models.Model):
    id = models.AutoField(primary_key=True)
    term = models.CharField(max_length=255)

    def __str__(self):
        return self.term

class SynonymAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)


class Food(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    categories = models.ManyToManyField(FoodCategory, related_name='foods')
    synonyms = models.ManyToManyField('Synonym', related_name='foods')

    def __str__(self):
        return f"Food ID: {self.id}"

class FoodAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)


class Intake(models.Model):
    id = models.AutoField(primary_key=True)
    food_id = models.ForeignKey(Food, related_name='intakes', on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()

    def __str__(self):
        return f"Intake ID: {self.id}"

class IntakeAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)