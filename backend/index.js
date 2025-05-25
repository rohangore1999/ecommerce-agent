const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mock data (moved from frontend)
const products = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: 29.99,
    originalPrice: 39.99,
    category: "T-Shirts",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop",
    description:
      "A timeless classic white t-shirt made from 100% organic cotton. Perfect for everyday wear with a comfortable fit.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Gray"],
    inStock: true,
    rating: 4.5,
    reviews: 128,
  },
  {
    id: 2,
    name: "Denim Jacket",
    price: 89.99,
    originalPrice: 119.99,
    category: "Jackets",
    image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcT4NYsH8SxZRzgzTwyUYykgGHodB_7y_z9Jwpn8XyZrVZz43F4vEkr-s5oE-DqtVopSwgdaW2_zfjkT6fLl5WDt-Q_pkkOE__G2jUIb-EPDg1F44oTh2RZJ1yw&w=500&h=600&fit=crop",
    description:
      "Vintage-style denim jacket with a modern fit. Features classic button closure and chest pockets.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Black", "Light Blue"],
    inStock: true,
    rating: 4.8,
    reviews: 89,
  },
  {
    id: 3,
    name: "Summer Floral Dress",
    price: 79.99,
    originalPrice: 99.99,
    category: "Dresses",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=600&fit=crop",
    description:
      "Beautiful floral print dress perfect for summer occasions. Lightweight and breathable fabric.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Floral", "Pink", "Blue"],
    inStock: true,
    rating: 4.6,
    reviews: 156,
  },
  {
    id: 4,
    name: "Casual Chinos",
    price: 59.99,
    originalPrice: 79.99,
    category: "Pants",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=600&fit=crop",
    description:
      "Comfortable chino pants perfect for casual and semi-formal occasions. Made with premium cotton blend.",
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Khaki", "Navy", "Black"],
    inStock: true,
    rating: 4.3,
    reviews: 92,
  },
  {
    id: 5,
    name: "Striped Hoodie",
    price: 69.99,
    originalPrice: 89.99,
    category: "Hoodies",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop",
    description:
      "Cozy striped hoodie with kangaroo pocket. Perfect for layering or wearing alone on cool days.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Gray/White", "Navy/White", "Black/White"],
    inStock: false,
    rating: 4.7,
    reviews: 74,
  },
];

const categories = [
  "All",
  "T-Shirts",
  "Jackets",
  "Dresses",
  "Pants",
  "Hoodies",
];

// In-memory cart storage (in production, use a database)
let carts = {};

// Helper function to get or create cart for a session
const getCart = (sessionId) => {
  if (!carts[sessionId]) {
    carts[sessionId] = [];
  }
  return carts[sessionId];
};

// Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// Products Routes

// Get all products
app.get("/api/products", (req, res) => {
  try {
    res.json({
      success: true,
      products: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
});

// Get product by ID
app.get("/api/products/:id", (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
});

// Get products by category
app.get("/api/products/category/:category", (req, res) => {
  try {
    const category = req.params.category;
    let filteredProducts;

    if (category === "All") {
      filteredProducts = products;
    } else {
      filteredProducts = products.filter((p) => p.category === category);
    }

    res.json({
      success: true,
      products: filteredProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products by category",
      error: error.message,
    });
  }
});

// Search products
app.get("/api/products/search/:query", (req, res) => {
  try {
    const query = req.params.query.toLowerCase();
    const filteredProducts = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );

    res.json({
      success: true,
      products: filteredProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching products",
      error: error.message,
    });
  }
});

// Get product recommendations
app.get("/api/products/:id/recommendations", (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const limit = parseInt(req.query.limit) || 4; // Default to 4 recommendations

    const targetProduct = products.find((p) => p.id === productId);

    if (!targetProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Recommendation algorithm
    const recommendations = products
      .filter((p) => p.id !== productId) // Exclude the target product
      .map((product) => {
        let score = 0;

        // Category match (highest weight)
        if (product.category === targetProduct.category) {
          score += 50;
        }

        // Price similarity (within 30% range)
        const priceDiff = Math.abs(product.price - targetProduct.price);
        const priceRange = targetProduct.price * 0.3;
        if (priceDiff <= priceRange) {
          score += 30 - (priceDiff / priceRange) * 30;
        }

        // Rating similarity
        const ratingDiff = Math.abs(product.rating - targetProduct.rating);
        score += Math.max(0, 20 - ratingDiff * 10);

        // Boost for in-stock items
        if (product.inStock) {
          score += 10;
        }

        // Boost for highly rated products
        if (product.rating >= 4.5) {
          score += 5;
        }

        return {
          ...product,
          recommendationScore: score,
        };
      })
      .sort((a, b) => b.recommendationScore - a.recommendationScore) // Sort by score descending
      .slice(0, limit) // Limit results
      .map(({ recommendationScore, ...product }) => product); // Remove score from response

    res.json({
      success: true,
      targetProduct: {
        id: targetProduct.id,
        name: targetProduct.name,
        category: targetProduct.category,
      },
      recommendations: recommendations,
      count: recommendations.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product recommendations",
      error: error.message,
    });
  }
});

// Get product ID by name
app.get("/api/products/name/:productName/id", (req, res) => {
  try {
    const productName = req.params.productName.toLowerCase();
    const exact = req.query.exact === "true"; // Query parameter for exact match

    let matchedProducts;

    if (exact) {
      // Exact name match (case-insensitive)
      matchedProducts = products.filter(
        (p) => p.name.toLowerCase() === productName
      );
    } else {
      // Partial name match (case-insensitive)
      matchedProducts = products.filter((p) =>
        p.name.toLowerCase().includes(productName)
      );
    }

    if (matchedProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: exact
          ? "No product found with exact name match"
          : "No products found matching the name",
      });
    }

    // If exact match or only one result, return single product
    if (exact || matchedProducts.length === 1) {
      const product = matchedProducts[0];
      return res.json({
        success: true,
        productId: product.id,
        productName: product.name,
        category: product.category,
        price: product.price,
      });
    }

    // Multiple matches - return all matching products
    const results = matchedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
    }));

    res.json({
      success: true,
      message: "Multiple products found matching the name",
      products: results,
      count: results.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error finding product by name",
      error: error.message,
    });
  }
});

// Get categories
app.get("/api/categories", (req, res) => {
  try {
    res.json({
      success: true,
      categories: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
});

// Cart Routes

// Get cart
app.get("/api/cart/:sessionId", (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const cart = getCart(sessionId);

    res.json({
      success: true,
      cart: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message,
    });
  }
});

// Add to cart
app.post("/api/cart/:sessionId/add", (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const { productId, quantity = 1, size = null, color = null } = req.body;

    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const cart = getCart(sessionId);
    const existingItem = cart.find(
      (item) =>
        item.productId === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: uuidv4(),
        productId,
        quantity,
        size,
        color,
        product,
      });
    }

    res.json({
      success: true,
      cart: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding to cart",
      error: error.message,
    });
  }
});

// Update cart item
app.put("/api/cart/:sessionId/update", (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const { itemId, quantity } = req.body;

    const cart = getCart(sessionId);
    const itemIndex = cart.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }

    res.json({
      success: true,
      cart: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating cart item",
      error: error.message,
    });
  }
});

// Remove from cart by itemId (original endpoint)
app.delete("/api/cart/:sessionId/remove/:itemId", (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const itemId = req.params.itemId;

    const cart = getCart(sessionId);
    const itemIndex = cart.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    cart.splice(itemIndex, 1);

    res.json({
      success: true,
      cart: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing from cart",
      error: error.message,
    });
  }
});

// Remove from cart by productId (removes all variants of the product)
app.delete("/api/cart/:sessionId/remove/product/:productId", (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const productId = parseInt(req.params.productId);

    const cart = getCart(sessionId);

    // Find all items with the given productId
    const itemsToRemove = cart.filter((item) => item.productId === productId);

    if (itemsToRemove.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No cart items found with this product ID",
      });
    }

    // Remove all items with the given productId
    const updatedCart = cart.filter((item) => item.productId !== productId);
    carts[sessionId] = updatedCart;

    console.log("cart after removal >>> ", updatedCart);
    console.log(
      `Removed ${itemsToRemove.length} item(s) with productId ${productId}`
    );

    res.json({
      success: true,
      cart: updatedCart,
      removedItems: itemsToRemove.length,
      message: `Removed ${itemsToRemove.length} item(s) from cart`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing from cart",
      error: error.message,
    });
  }
});

// Clear cart
app.delete("/api/cart/:sessionId/clear", (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    carts[sessionId] = [];

    res.json({
      success: true,
      cart: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error clearing cart",
      error: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
