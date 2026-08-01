from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from products.models import Product
from .models import CartItem
from .serializers import (
    AddToCartSerializer,
    CartSerializer,
)
from .utils import get_or_create_cart


class AddToCartView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = AddToCartSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        product = get_object_or_404(
            Product,
            id=serializer.validated_data["product_id"],
        )

        cart = get_or_create_cart(request.user)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={
                "quantity": serializer.validated_data["quantity"]
            },
        )

        if not created:
            cart_item.quantity += serializer.validated_data["quantity"]
            cart_item.save()

        return Response(
            CartSerializer(cart).data,
            status=status.HTTP_200_OK,
        )

class CartView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        cart = get_or_create_cart(request.user)

        serializer = CartSerializer(cart)

        return Response(serializer.data)

class UpdateCartItemView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, item_id):

        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = get_or_create_cart(request.user)

        cart_item = get_object_or_404(
            CartItem,
            id=item_id,
            cart=cart,
        )

        cart_item.quantity = serializer.validated_data["quantity"]
        cart_item.save()

        return Response(CartSerializer(cart).data)

class RemoveCartItemView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):

        cart = get_or_create_cart(request.user)

        cart_item = get_object_or_404(
            CartItem,
            id=item_id,
            cart=cart,
        )

        cart_item.delete()

        return Response(CartSerializer(cart).data)