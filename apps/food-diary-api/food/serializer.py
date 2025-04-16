from rest_framework import serializers
from .models import Food, FoodCategory, Synonym, Intake


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


class IntakeSerializer(serializers.ModelSerializer):
    food = serializers.SerializerMethodField()

    class Meta:
        model = Intake
        fields = ['id', 'food', 'user_id', 'date']

    def get_food(self, obj):
        return {
            'id': obj.food_id.id,
            'name': obj.food_id.name
        }