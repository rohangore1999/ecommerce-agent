import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useCart } from "../context/CartContext";
import ChatWidget from "../components/ChatWidget";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart, getCartTotal } = useCart();

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  const total = getCartTotal();
  const shipping = total > 50 ? 0 : 9.99;
  const finalTotal = total + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
        <ChatWidget />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />

                  {/* Product Details */}
                  <div className="flex-1">
                    <Link
                      to={`/product/${item.product.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-gray-600">{item.product.category}</p>

                    {/* Size and Color */}
                    <div className="flex space-x-4 text-sm text-gray-500 mt-1">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>

                    <p className="text-lg font-bold text-gray-900 mt-2">
                      ${item.product.price}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                    >
                      -
                    </Button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </Button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              {total < 50 && (
                <p className="text-sm text-gray-600">
                  Add ${(50 - total).toFixed(2)} more for free shipping!
                </p>
              )}

              <hr />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    // Here you would typically navigate to checkout
                    alert("Checkout functionality would be implemented here!");
                  }}
                >
                  Proceed to Checkout
                </Button>

                <Link to="/">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Security Badge */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-500">
                  🔒 Secure Checkout • 30-Day Returns
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ChatWidget />
    </div>
  );
};

export default Cart;
