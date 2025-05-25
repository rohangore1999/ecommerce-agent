import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Button } from "../components/ui/button";
import { productService } from "../services/api";
import { mockCategories } from "../data/mockData";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      let response;

      if (searchQuery) {
        response = await productService.searchProducts(searchQuery);
      } else {
        response = await productService.getProductsByCategory(selectedCategory);
      }

      setProducts(response.data.products);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {searchQuery ? `Search results for "${searchQuery}"` : "Our Products"}
        </h1>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {mockCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => handleCategoryChange(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchQuery
              ? "No products found for your search."
              : "No products found in this category."}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductListing;
