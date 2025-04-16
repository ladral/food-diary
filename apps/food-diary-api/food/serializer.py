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


class FoodIntakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = ['id', 'name']


class IntakeSerializer(serializers.ModelSerializer):
    food = FoodIntakeSerializer(source='food_id')

    class Meta:
        model = Intake
        fields = ['id', 'food', 'user_id', 'date']


class IntakeCreateSerializer(serializers.ModelSerializer):
    food_id = serializers.PrimaryKeyRelatedField(queryset=Food.objects.all())

    class Meta:
        model = Intake
        fields = ['food_id', 'date']

    def create(self, validated_data):
        return Intake.objects.create(**validated_data)