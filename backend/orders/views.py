
from decimal import Decimal

from django.db import transaction
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cart.utils import get_or_create_cart
from .models import Order, OrderItem
from .serializers import OrderSerializer


class PlaceOrderView(APIView):

    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):

        cart = get_or_create_cart(request.user)

        cart_items = list(
            cart.items.select_related("product").all()
        )

        if not cart_items:
            return Response(
                {"detail": "Cart is empty."},
                status=400,
            )

        # Check product availability before creating an order
        unavailable_products = [
            item.product.name
            for item in cart_items
            if not item.product.available
        ]

        if unavailable_products:
            return Response(
                {
                    "detail": "Some products are currently unavailable.",
                    "unavailable_products": unavailable_products,
                },
                status=400,
            )

        # Create order only when all products are available
        order = Order.objects.create(
            user=request.user,
        )

        total = Decimal("0.00")

        for item in cart_items:

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
