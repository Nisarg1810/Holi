from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Booking
from .serializers import BookingSerializer

class BookingViewSet(viewsets.ModelViewSet):
    """
    Booking ViewSet.
    - Requires JWT Authentication.
    - Scopes queryset to the logged-in user unless the user is an admin/superadmin.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = BookingSerializer

    def get_queryset(self):
        user = self.request.user
        # Admins and superadmins can view all bookings
        if user.role in ['superadmin', 'admin']:
            queryset = Booking.objects.all().order_by('-created_at')
            email = self.request.query_params.get('email', None)
            if email:
                queryset = queryset.filter(user__email=email)
            return queryset
        
        # Regular users are strictly limited to their own bookings
        return Booking.objects.filter(user=user).order_by('-created_at')

    def perform_create(self, serializer):
        user = self.request.user
        import random
        
        # Generate custom values if not provided
        booking_id = self.request.data.get('id') or self.request.data.get('bookingId')
        if not booking_id:
            booking_id = f"BK-{random.randint(100000, 999999)}"
            
        ticket_id = self.request.data.get('ticketId') or self.request.data.get('ticket_id')
        if not ticket_id:
            ticket_id = f"TCK-{random.randint(100000, 999999)}"
            
        trip_id = self.request.data.get('tripId') or self.request.data.get('trip_id')
        if not trip_id:
            trip_id = f"TRIP-{random.randint(100000, 999999)}"
            
        amount = self.request.data.get('amount') or self.request.data.get('price') or 0.00
        user_email = user.email if user else self.request.data.get('user_email', 'guest@example.com')
        
        travel_date = self.request.data.get('travelDate') or self.request.data.get('travel_date') or self.request.data.get('date')
        # If travel_date is string '2026-07-31' convert to date object or handle
        if isinstance(travel_date, str) and travel_date:
            from datetime import date
            try:
                travel_date = date.fromisoformat(travel_date)
            except ValueError:
                travel_date = None

        serializer.save(
            user=user,
            id=booking_id,
            user_email=user_email,
            ticket_id=ticket_id,
            trip_id=trip_id,
            travel_date=travel_date,
            amount=amount,
            price=amount
        )

    @action(detail=True, methods=['post', 'patch'], url_path='cancel')
    def cancel(self, request, pk=None):
        try:
            booking = self.get_object()
            
            # Security authorization check
            if request.user.role not in ['superadmin', 'admin'] and booking.user != request.user:
                return Response({"error": "Unauthorized access to this booking resource."}, status=status.HTTP_403_FORBIDDEN)
                
            booking.status = 'Cancelled'
            booking.save()
            return Response(BookingSerializer(booking).data, status=status.HTTP_200_OK)
        except Booking.DoesNotExist:
            return Response({"error": "Booking record not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['patch'], url_path='complete')
    def complete(self, request, pk=None):
        try:
            booking = self.get_object()
            
            # Security authorization check
            if request.user.role not in ['superadmin', 'admin'] and booking.user != request.user:
                return Response({"error": "Unauthorized access to this booking resource."}, status=status.HTTP_403_FORBIDDEN)
                
            booking.status = 'Completed'
            booking.save()
            return Response(BookingSerializer(booking).data, status=status.HTTP_200_OK)
        except Booking.DoesNotExist:
            return Response({"error": "Booking record not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], url_path='request-cancel')
    def request_cancel(self, request, pk=None):
        try:
            booking = self.get_object()
            
            if request.user.role not in ['superadmin', 'admin'] and booking.user != request.user:
                return Response({"error": "Unauthorized access to this booking resource."}, status=status.HTTP_403_FORBIDDEN)
                
            booking.status = 'Cancellation Requested'
            booking.cancellation_data = request.data.get('cancellation_data', {})
            booking.save()
            return Response(BookingSerializer(booking).data, status=status.HTTP_200_OK)
        except Booking.DoesNotExist:
            return Response({"error": "Booking record not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], url_path='approve-refund')
    def approve_refund(self, request, pk=None):
        try:
            if request.user.role not in ['superadmin', 'admin']:
                return Response({"error": "Only administrators can authorize refunds."}, status=status.HTTP_403_FORBIDDEN)
                
            booking = self.get_object()
            booking.status = 'Refunded'
            booking.save()
            return Response(BookingSerializer(booking).data, status=status.HTTP_200_OK)
        except Booking.DoesNotExist:
            return Response({"error": "Booking record not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], url_path='reject-cancel')
    def reject_cancel(self, request, pk=None):
        try:
            if request.user.role not in ['superadmin', 'admin']:
                return Response({"error": "Only administrators can reject cancellation requests."}, status=status.HTTP_403_FORBIDDEN)
                
            booking = self.get_object()
            booking.status = 'Confirmed'
            booking.save()
            return Response(BookingSerializer(booking).data, status=status.HTTP_200_OK)
        except Booking.DoesNotExist:
            return Response({"error": "Booking record not found."}, status=status.HTTP_404_NOT_FOUND)
