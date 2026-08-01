from .models import Cart


def get_or_create_cart(user):
    """
    Return the user's cart.
    Create one if it doesn't exist.
    """

    cart, created = Cart.objects.get_or_create(user=user)

    return cart