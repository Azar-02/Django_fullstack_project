from django.urls import path
from .views import (
    OrderHistoryView,
    PlaceOrderView,
)

urlpatterns = [
    path("orders/place/", PlaceOrderView.as_view(),),

    path("orders/", OrderHistoryView.as_view(),),
]