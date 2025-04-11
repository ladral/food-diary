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
