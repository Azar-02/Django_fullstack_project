from django.urls import path

from .views import AddToCartView

urlpatterns = [
    path("cart/", CartView.as_view(), name="cart"),

    path("cart/add/", AddToCartView.as_view(), name="cart-add"),

    path("cart/items/<int:item_id>/", UpdateCartItemView.as_view(),name="cart-item-update",),

    path("cart/items/<int:item_id>/delete/", RemoveCartItemView.as_view(), name="cart-item-delete",),

]