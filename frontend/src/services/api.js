import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:3001/api",
  timeout: 5000,
});

// Generate or get session ID for cart management
const getSessionId = () => {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = "session_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
};

// Product service with real API calls
export const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get("/products");
      return response;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await api.get(`/products/category/${category}`);
      return response;
    } catch (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }
  },

  // Search products
  searchProducts: async (query) => {
    try {
      const response = await api.get(
        `/products/search/${encodeURIComponent(query)}`
      );
      return response;
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      const response = await api.get("/categories");
      return response;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
};

// Cart service with real API calls
export const cartService = {
  getCart: async () => {
    try {
      const sessionId = getSessionId();
      const response = await api.get(`/cart/${sessionId}`);
      return response;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },

  addToCart: async (productId, quantity = 1, size = null, color = null) => {
    try {
      const sessionId = getSessionId();
      const response = await api.post(`/cart/${sessionId}/add`, {
        productId,
        quantity,
        size,
        color,
      });
      return response;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  },

  updateCartItem: async (itemId, quantity) => {
    try {
      const sessionId = getSessionId();
      const response = await api.put(`/cart/${sessionId}/update`, {
        itemId,
        quantity,
      });
      return response;
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  },

  removeFromCart: async (itemId) => {
    try {
      const sessionId = getSessionId();
      const response = await api.delete(`/cart/${sessionId}/remove/${itemId}`);
      return response;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const sessionId = getSessionId();
      const response = await api.delete(`/cart/${sessionId}/clear`);
      return response;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  },
};

export default api;
