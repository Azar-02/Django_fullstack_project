from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from cart.utils import get_or_create_cart
from .models import Order, OrderItem
from .serializers import OrderSerializer
from rest_framework import generics

class PlaceOrderView(APIView):

    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):

        cart = get_or_create_cart(request.user)

        if not cart.items.exists():
            return Response(
                {"detail": "Cart is empty."},
                status=400,
            )

        order = Order.objects.create(
            user=request.user,
        )

        total = 0

        for item in cart.items.all():

            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price,
            )

            total += item.product.price * item.quantity

        order.total = total
        order.save()

        cart.items.all().delete()

        return Response(
            OrderSerializer(order).data
        )



class OrderHistoryView(generics.ListAPIView):

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(
            user=self.request.user
        )