from rest_framework import serializers

from .models import Symptom, Occurrence


class SymptomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Symptom
        fields = ['id', 'name']


class OccurrenceSerializer(serializers.ModelSerializer):
    symptom = SymptomSerializer(source='symptom_id')

    class Meta:
        model = Occurrence
        fields = ['id', 'symptom', 'user_id', 'date']



class OccurrenceCreateOrUpdateSerializer(serializers.ModelSerializer):
    symptom_id = serializers.PrimaryKeyRelatedField(queryset=Symptom.objects.all())

    class Meta:
        model = Occurrence
        fields = ['symptom_id', 'date']

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)

    def validate_symptom_id(self, value):
        if value.user_id != self.user:
            # Raise a validation error if the symptom does not exist or does not belong to the user
            # This is done to mimic the behavior of an entry not existing and is implemented for security considerations
            raise serializers.ValidationError(f'Invalid pk "{value.id}" - object does not exist.')
        return value

    def create(self, validated_data):
        return Occurrence.objects.create(**validated_data)