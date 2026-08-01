from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    userId = serializers.IntegerField(source='user_id', read_only=True)
    ticketId = serializers.CharField(source='ticket_id', required=False, allow_null=True, allow_blank=True)
    tripId = serializers.CharField(source='trip_id', required=False, allow_null=True, allow_blank=True)
    bookingDate = serializers.DateField(source='booking_date', required=False, read_only=True)
    travelDate = serializers.DateField(source='travel_date', required=False, allow_null=True)
    paymentStatus = serializers.CharField(source='payment_status', required=False)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
