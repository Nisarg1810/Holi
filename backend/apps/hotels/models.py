from django.db import models


class Hotel(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=150)
    city = models.CharField(max_length=100, default='Goa')
    location = models.CharField(max_length=255, blank=True, null=True)
    rating = models.CharField(max_length=10, default='4.8/5.0')
    stars = models.IntegerField(default=5)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    original_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    image = models.CharField(max_length=255, blank=True, null=True)
    gallery = models.JSONField(default=list, blank=True)
    amenities = models.JSONField(default=list, blank=True)
    description = models.TextField(blank=True, null=True)
    tag = models.CharField(max_length=50, default='GOISAFE LUXURY')

    class Meta:
        db_table = 'hotels'

    def __str__(self):
        return self.name
