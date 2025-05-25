import React, { createContext, useContext, useReducer, useEffect } from "react";
import { cartService } from "../services/api";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return {
        ...state,
        items: action.payload,
        loading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "ADD_TO_CART":
      return {
        ...state,
        items: action.payload,
      };
    case "UPDATE_CART_ITEM":
      return {
        ...state,
        items: action.payload,
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: action.payload,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    loading: false,
  });

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await cartService.getCart();
      dispatch({ type: "SET_CART", payload: response.data.cart });
    } catch (error) {
      console.error("Error loading cart:", error);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addToCart = async (
    productId,
    quantity = 1,
    size = null,
    color = null
  ) => {
    try {
      const response = await cartService.addToCart(
        productId,
        quantity,
        size,
        color
      );
      dispatch({ type: "ADD_TO_CART", payload: response.data.cart });
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await cartService.updateCartItem(itemId, quantity);
      dispatch({ type: "UPDATE_CART_ITEM", payload: response.data.cart });
      return response.data;
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await cartService.removeFromCart(itemId);
      dispatch({ type: "REMOVE_FROM_CART", payload: response.data.cart });
      return response.data;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart: state.items,
    loading: state.loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    getCartTotal,
    getCartItemCount,
    loadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
