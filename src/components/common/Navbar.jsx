// components/common/Navbar.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Heart, Menu, X, Package, User, ChevronDown, Sparkles, TrendingUp,Hexagon,Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";

// --- Custom Utility Hook for Debouncing ---
// This hook delays updating the debounced value until after the delay has passed.
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to clear the timeout if value or delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// --- Simple Throttle Function ---
// This function ensures a given function is not called more than once in a specified time frame.
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// --- Extracted Components for Organization ---

const MobileMenu = ({ isOpen, onClose, isActive, cart, favorites }) => {
  const menuRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-xl"
          id="mobile-menu"
        >
          <div className="px-4 py-3 space-y-1">
            {[
              { path: "/", label: "Home", icon: null },
              { path: "/favorites", label: "Favorites", icon: Heart },
              { path: "/cart", label: "Cart", icon: ShoppingCart },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between w-full p-3 rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="flex items-center space-x-3">
                  {item.icon && <item.icon className="h-4 w-4" />}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProfileMenu = ({ isOpen, onClose, onSignOut }) => {
  const menuRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50"
        >
          <div className="p-2">
            <Link to="/profile" className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-all duration-200">
              <User className="h-4 w-4 mr-3" />
              My Profile
            </Link>
            <Link to="/orders" className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-all duration-200">
              <Package className="h-4 w-4 mr-3" />
              Orders
            </Link>
            <Link to="/favorites" className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-all duration-200">
              <Heart className="h-4 w-4 mr-3" />
              Wishlist
            </Link>
            <div className="border-t border-white/10 my-2"></div>
            <button onClick={onSignOut} className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-all duration-200">
              Sign out
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


// --- Main Navbar Component ---

const Navbar = () => {
  const { cart, favorites } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Use our custom debounce hook on the search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Memoize the isActive function to prevent unnecessary re-renders
  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  // --- Debounced Search Effect ---
  // This effect will run only when the debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(debouncedSearchQuery.trim())}`);
    }
  }, [debouncedSearchQuery, navigate]); // Dependency array ensures it runs on debounced query change

  // --- Handle scroll for background effect with our custom throttle function ---
  useEffect(() => {
    const handleScroll = throttle(() => {
      setScrolled(window.scrollY > 20);
    }, 100);
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // --- Handle keyboard navigation ---
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Handle search form submission ---
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  };

  // --- Handle sign out ---
  const handleSignOut = () => {
    // Implement your sign out logic here
    // Example: localStorage.removeItem('authToken');
    setProfileMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-slate-900/90 backdrop-blur-xl border-b border-white/10 shadow-2xl' 
        : 'bg-transparent'
    }`}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-slate-900/20 backdrop-blur-xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group" aria-label="ZapKart Home">
            <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 p-1.5 rounded-lg">
<Zap className="h-5 w-5 text-white" />      </div>
              </div>
              <div>
                <span className="text-xl font-bold text-white">ZapKart</span>
                <div className="flex items-center text-xs text-gray-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>Premium</span>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Navigation Links - Desktop */}
 

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <form onSubmit={handleSearch} className={`relative w-full group transition-all duration-300 ${ isSearchFocused ? 'scale-105' : '' }`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-4 w-4 transition-colors duration-300 ${ isSearchFocused ? 'text-blue-400' : 'text-gray-400' }`} />
              </div>
              <label htmlFor="desktop-search-input" className="sr-only">Search products</label>
              <input
                id="desktop-search-input"
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Simpler onChange
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-10 pr-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/20 text-white placeholder-gray-400 text-sm transition-all duration-300"
              />
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
            </form>
          </div>

                   <nav aria-label="Main navigation">
            <div className="hidden lg:flex items-center space-x-1">
              {[
                { path: "/", label: "Home", icon: null },
                { path: "/favorites", label: "Favorites", icon: Heart },
                { path: "/cart", label: "Cart", icon: ShoppingCart },
              ].map((item) => (
                <Link key={item.path} to={item.path} className={`group relative px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                  isActive(item.path)
                    ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/25'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}>
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
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </Link>
              ))}
            </div>
          </nav>

          {/* Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {/* <Link to="/cart" className="relative p-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-all duration-300 border border-white/20" aria-label={`Shopping cart with ${cart.reduce((sum, item) => sum + item.quantity, 0)} items`}>
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link> */}
            
            <div className="relative">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="p-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-all duration-300 border border-white/20" aria-expanded={profileMenuOpen} aria-haspopup="true" aria-label="User profile menu">
                <User className="h-5 w-5" />
              </motion.button>
              <ProfileMenu isOpen={profileMenuOpen} onClose={() => setProfileMenuOpen(false)} onSignOut={handleSignOut} />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-all duration-300 border border-white/20" aria-expanded={mobileMenuOpen} aria-controls="mobile-menu" aria-label="Toggle mobile menu">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <label htmlFor="mobile-search-input" className="sr-only">Search products</label>
            <input id="mobile-search-input" type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 text-sm" />
          </form>
        </div>

        {/* Mobile Menu */}
        <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} isActive={isActive} cart={cart} favorites={favorites} />
      </div>
    </nav>
  );
};

export default Navbar;