import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleQuickAdd = async (e) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();

    try {
      await addToCart(product.id);
      // You could add a toast notification here
      console.log(`Added ${product.name} to cart`);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!product.inStock && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Out of Stock
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600">{product.category}</p>

            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    {i < Math.floor(product.rating) ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.reviews} reviews)
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            variant={product.inStock ? "default" : "secondary"}
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
