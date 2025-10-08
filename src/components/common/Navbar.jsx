// components/common/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Heart, Menu, X, Package, User, ChevronDown, Sparkles, TrendingUp } from "lucide-react";
import { motion as Motion , AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const { cart, favorites } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Refs to detect clicks outside of menus
  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // --- Close menus when clicking outside ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Handle scroll for background effect ---
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Handle search form submission ---
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Navigate to the home page with the search query as a URL parameter
    navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery(""); // Clear the input after searching
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-slate-900/90 backdrop-blur-xl border-b border-white/10 shadow-2xl' 
        : 'bg-transparent'
    }`}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-slate-900/20 backdrop-blur-xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <Motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-xl">
                  <Package className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">ZapKart</span>
                <div className="flex items-center text-xs text-gray-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>Premium</span>
                </div>
              </div>
            </Motion.div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            {[
              { path: "/", label: "Home", icon: null },
              { path: "/favorites", label: "Favorites", icon: Heart },
              { path: "/cart", label: "Cart", icon: ShoppingCart },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  isActive(item.path)
                    ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/25'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.label}</span>
                {item.label === "Favorites" && favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
                {item.label === "Cart" && cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </Link>
            ))}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className={`relative w-full group transition-all duration-300 ${
              isSearchFocused ? 'scale-105' : ''
            }`}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className={`h-5 w-5 transition-colors duration-300 ${
                  isSearchFocused ? 'text-blue-400' : 'text-gray-400'
                }`} />
              </div>
              <input
                type="text"
                placeholder="Search premium products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/20 text-white placeholder-gray-400 transition-all duration-300"
              />
              {/* Search Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
            </form>
          </div>

          {/* Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Button */}
          
            
            {/* Profile Button */}
            <div className="relative" ref={profileMenuRef}>
              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="p-3 bg-white/10 backdrop-blur-sm rounded-xl text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <User className="h-5 w-5 cursor-pointer" />
              </Motion.button>
              
              <AnimatePresence>
                {profileMenuOpen && (
                  <Motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50"
                  >
                    <div className="p-2">
                      <Link to="/profile" className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-200">
                        <User className="h-4 w-4 mr-3 cursor-pointer" />
                        My Profile
                      </Link>
                      <Link to="/orders" className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-200">
                        <Package className="h-4 w-4 mr-3" />
                        Orders
                      </Link>
                      <Link to="/favorites" className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-200">
                        <Heart className="h-4 w-4 mr-3" />
                        Wishlist
                      </Link>
                      <div className="border-t border-white/10 my-2"></div>
                      <a href="#" className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-200">
                        Sign out
                      </a>
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 bg-white/10 backdrop-blur-sm rounded-xl text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400"
            />
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <Motion.div
            ref={mobileMenuRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-2">
              {[
                { path: "/", label: "Home", icon: null },
                { path: "/favorites", label: "Favorites", icon: Heart },
                { path: "/cart", label: "Cart", icon: ShoppingCart },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between w-full p-4 rounded-xl transition-all duration-300 ${
                    isActive(item.path)
                      ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center space-x-3">
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span className="font-medium">{item.label}</span>
                  </span>
                  {item.label === "Favorites" && favorites.length > 0 && (
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full px-2 py-1">
                      {favorites.length}
                    </span>
                  )}
                  {item.label === "Cart" && cart.length > 0 && (
                    <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs rounded-full px-2 py-1">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;