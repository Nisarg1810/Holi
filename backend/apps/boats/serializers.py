from rest_framework import serializers
from .models import Boat

class BoatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Boat
        fields = [
            'id', 'name', 'type', 'capacity', 'price',
            'image', 'location', 'description',
            'features', 'schedules', 'reviews'
        ]
