from rest_framework import serializers
from .models import Food, FoodCategory, Synonym

class FoodCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodCategory
        fields = ['id', 'name']

class SynonymSerializer(serializers.ModelSerializer):
    class Meta:
        model = Synonym
        fields = ['id', 'term']


class FoodSerializer(serializers.ModelSerializer):
    categories = FoodCategorySerializer(many=True, read_only=True)
    synonyms = SynonymSerializer(many=True, read_only=True)

    class Meta:
        model = Food
        fields = ['id', 'name', 'categories', 'synonyms']

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if not representation['synonyms']:
            representation.pop('synonyms')

        return representation