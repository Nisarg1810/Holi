from django.db import models

class Boat(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=150)
    type = models.CharField(max_length=100, blank=True, null=True)
    capacity = models.CharField(max_length=50, default="6 Guests")
    price = models.DecimalField(max_digits=12, decimal_places=2)
    image = models.CharField(max_length=512, blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    features = models.JSONField(default=list, blank=True)
    schedules = models.JSONField(default=list, blank=True)
    reviews = models.JSONField(default=list, blank=True)

    class Meta:
        db_table = 'boats'

    def __str__(self):
        return self.name
