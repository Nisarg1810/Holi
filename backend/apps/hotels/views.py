from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Hotel
from .serializers import HotelSerializer
from .booking_client import BookingDemandClient

class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        city = self.request.query_params.get('city') or self.request.query_params.get('destination')
        search = self.request.query_params.get('search') or self.request.query_params.get('query')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        stars = self.request.query_params.get('stars')

        if city and city.lower() != 'all':
            qs = qs.filter(Q(city__icontains=city) | Q(location__icontains=city) | Q(name__icontains=city))

        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(location__icontains=search) | Q(city__icontains=search) | Q(description__icontains=search))

        if min_price:
            try:
                qs = qs.filter(price__gte=float(min_price))
            except ValueError:
                pass

        if max_price:
            try:
                qs = qs.filter(price__lte=float(max_price))
            except ValueError:
                pass

        if stars:
            try:
                qs = qs.filter(stars=int(stars))
            except ValueError:
                pass

        return qs

    @action(detail=False, methods=['post', 'get'], url_path='search')
    def search(self, request):
        data = request.data if request.method == 'POST' else request.query_params
        
        destination = data.get('destination') or data.get('city') or 'Goa'
        checkin = data.get('checkin', '2026-07-10')
        checkout = data.get('checkout', '2026-07-15')
        try:
            guests = int(data.get('guests', 2))
        except ValueError:
            guests = 2

        # First filter local database hotels matching destination
        db_hotels = self.get_queryset()
        serializer = self.get_serializer(db_hotels, many=True)

        return Response({
            "destination": destination,
            "checkin": checkin,
            "checkout": checkout,
            "guests": guests,
            "total": len(serializer.data),
            "results": serializer.data
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='locations')
    def locations(self, request):
        cities = list(Hotel.objects.values_list('city', flat=True).distinct())
        locations_list = list(set(cities + ["Goa", "Mussoorie", "Badrinath", "Udaipur", "Mumbai", "Delhi"]))
        return Response(locations_list, status=status.HTTP_200_OK)
