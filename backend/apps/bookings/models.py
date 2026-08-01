from django.db import models

class Booking(models.Model):
    STATUS_CHOICES = (
        ('Confirmed', 'Confirmed'),
        ('Pending', 'Pending'),
        ('Cancellation Requested', 'Cancellation Requested'),
        ('Cancelled', 'Cancelled'),
        ('Refunded', 'Refunded'),
        ('In Flight', 'In Flight'),
    )
    
    TRIP_TYPE_CHOICES = (
        ('One Way', 'One Way'),
        ('Round Trip', 'Round Trip'),
        ('Multi-City', 'Multi-City'),
    )

    id = models.CharField(max_length=50, primary_key=True)
    user = models.ForeignKey('authentication.User', on_delete=models.CASCADE, related_name='user_bookings', null=True, blank=True)
    user_email = models.CharField(max_length=100)
    contact_email = models.CharField(max_length=100, blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    type = models.CharField(max_length=50) # 'helicopter', 'package', 'hotel', 'boat'
    name = models.CharField(max_length=100)
    details = models.TextField(blank=True, null=True)
    date = models.CharField(max_length=50)
    return_date = models.CharField(max_length=50, blank=True, null=True)
    trip_type = models.CharField(max_length=20, choices=TRIP_TYPE_CHOICES, default='One Way')
    passengers = models.IntegerField(default=2)
    adults = models.IntegerField(default=1)
    children = models.IntegerField(default=0)
    infants = models.IntegerField(default=0)
    legs = models.JSONField(default=list, blank=True)
    selected_seats = models.JSONField(default=list, blank=True)
    passenger_manifest = models.JSONField(default=list, blank=True)
    addons = models.JSONField(default=list, blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Confirmed')
    cancellation_data = models.JSONField(default=dict, blank=True)
    fare_type = models.CharField(max_length=50, default='Regular')
    gst_number = models.CharField(max_length=50, blank=True, null=True)
    
    # Required ticket booking database fields
    ticket_id = models.CharField(max_length=100, blank=True, null=True)
    trip_id = models.CharField(max_length=100, blank=True, null=True)
    booking_date = models.DateField(auto_now_add=True, null=True, blank=True)
    travel_date = models.DateField(blank=True, null=True)
    payment_status = models.CharField(max_length=50, default='Paid')
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bookings'

    def __str__(self):
        return f"{self.id} - {self.name} ({self.user_email})"
