import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { productService } from "../services/api";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(id);
      if (response.data.product) {
        setProduct(response.data.product);
        // Set default selections
        if (response.data.product.sizes?.length > 0) {
          setSelectedSize(response.data.product.sizes[0]);
        }
        if (response.data.product.colors?.length > 0) {
          setSelectedColor(response.data.product.colors[0]);
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error loading product:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await addToCart(product.id, quantity, selectedSize, selectedColor);
      // You could add a success toast here
      console.log("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  const discountPercentage = product?.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h2>
          <Button onClick={() => navigate("/")}>Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
        ← Back to Products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 lg:h-[600px] object-cover rounded-lg"
          />
          {!product.inStock && (
            <Badge variant="destructive" className="absolute top-4 left-4">
              Out of Stock
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="absolute top-4 right-4 bg-red-500">
              -{discountPercentage}% OFF
            </Badge>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600">{product.category}</p>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex text-yellow-400 text-lg">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < Math.floor(product.rating) ? "★" : "☆"}
                </span>
              ))}
            </div>
            <span className="text-gray-600">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          {/* Description */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </CardContent>
          </Card>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    size="sm"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    onClick={() => setSelectedColor(color)}
                    size="sm"
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="space-y-4">
            <Button
              className="w-full"
              size="lg"
              onClick={handleAddToCart}
              disabled={!product.inStock || addingToCart}
            >
              {addingToCart
                ? "Adding to Cart..."
                : product.inStock
                ? `Add to Cart - $${(product.price * quantity).toFixed(2)}`
                : "Out of Stock"}
            </Button>

            {!product.inStock && (
              <p className="text-sm text-gray-500 text-center">
                This item is currently out of stock. Please check back later.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
