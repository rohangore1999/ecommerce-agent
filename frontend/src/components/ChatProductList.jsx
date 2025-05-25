import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { productService } from "../services/api";
import { useCart } from "../context/CartContext";

const ChatProductList = ({ productIds }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!productIds || productIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const productPromises = productIds.map((id) =>
          productService.getProductById(id)
        );

        const responses = await Promise.all(productPromises);
        const productsData = responses.map(
          (response) => response?.data?.product
        );
        setProducts(productsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productIds]);

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCart(productId);
      console.log(`Added product ${productId} to cart`);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 p-3 rounded-lg mb-2">
        <div className="text-sm text-gray-600">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-3 rounded-lg mb-2">
        <div className="text-sm text-red-600">{error}</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-gray-50 p-3 rounded-lg mb-2">
        <div className="text-sm text-gray-600">No products found</div>
      </div>
    );
  }

  console.log({ products });

  return (
    <div className="bg-white p-2 rounded-lg mb-2 border">
      <div className="space-y-2">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-2">
              <div className="flex space-x-2">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-xs font-medium text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {product.category}
                      </p>

                      <div className="flex items-center space-x-1 mt-1">
                        <span className="text-xs font-bold text-gray-900">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1 mt-1">
                        <div className="flex text-yellow-400 text-xs">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < Math.floor(product.rating) ? "★" : "☆"}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          ({product.reviews})
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-col items-end">
                      {!product.inStock && (
                        <Badge variant="destructive" className="text-xs">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="mt-1">
                    <Button
                      size="sm"
                      className="w-full text-xs h-6"
                      onClick={(e) => handleAddToCart(e, product.id)}
                      disabled={!product.inStock}
                      variant={product.inStock ? "default" : "secondary"}
                    >
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChatProductList;
