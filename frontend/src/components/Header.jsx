import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useCart } from "../context/CartContext";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { getCartItemCount } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">ClothingStore</h1>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8"
              >
                🔍
              </Button>
            </div>
          </form>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link to="/cart" className="relative">
              <Button variant="ghost" className="relative">
                🛒 Cart
                {getCartItemCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {getCartItemCount()}
                  </Badge>
                )}
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
