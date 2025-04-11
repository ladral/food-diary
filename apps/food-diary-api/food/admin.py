from django.contrib import admin

from .models import FoodCategory, Food, Synonym, SynonymAdmin, FoodCategoryAdmin, FoodAdmin

admin.site.register(FoodCategory, FoodCategoryAdmin)
admin.site.register(Food, FoodAdmin)
admin.site.register(Synonym, SynonymAdmin)
