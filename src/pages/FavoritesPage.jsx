// components/favorites/FavoritesPage.jsx
import React, { useState, useMemo } from "react"; // UPDATE: Added useMemo
import { Heart, ShoppingCart, Package, Search } from "lucide-react"; // UPDATE: Imported Search icon
import {motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

// --- UPDATE: Moved helper function here to make the component self-contained ---
const usdToInr = (usd) => Math.round(usd * 83);

const FavoritesPage = () => {
  const { 
    favorites = [], 
    addToCart, 
    addToFavorites, // UPDATE: Consistent with CartContext
    isFavorite 
  } = useCart();
  
  const [searchQuery, setSearchQuery] = useState("");

  // --- UPDATE: Used useMemo for performance ---
  const filteredFavorites = useMemo(() => {
    return favorites.filter(product => {
      const productName = product.name || product.title || "";
      return productName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [favorites, searchQuery]);

  return (
    // --- UPDATE: Changed background to match the site's dark theme ---
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 py-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- UPDATE: Used whileInView for self-contained scroll animations --- */}
        <Motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center">
            <Heart className="h-8 w-8 mr-3 text-red-500" fill="currentColor" />
            Your Favorites
          </h1>
          <p className="text-gray-300">
            {filteredFavorites.length} {filteredFavorites.length === 1 ? 'product' : 'products'} in your wishlist
          </p>
        </Motion.div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search your favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Favorites Grid */}
        {filteredFavorites.length === 0 ? (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Heart className="h-16 w-16 mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {favorites.length === 0 ? "You haven't added any favorites yet" : "No favorites match your search"}
            </h3>
            <p className="text-gray-400 mb-6">
              {favorites.length === 0 
                ? "Start adding products to your wishlist to see them here" 
                : "Try a different search term"}
            </p>
            {favorites.length === 0 && (
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Shopping
              </Link>
            )}
          </Motion.div>
        ) : (
          <Motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredFavorites.map((product, index) => (
              <Motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                // --- UPDATE: Updated styling to match the dark theme ---
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-red-500/30 shadow-lg hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                  {/* --- UPDATE: Standardized image property --- */}
                  <img
                    src={product.image || product.thumbnail}
                    alt={product.name || product.title}
                    className="w-full h-full object-contain p-8 hover:scale-110 transition-transform duration-300"
                  />
                  <Motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addToFavorites(product)}
                    aria-label="Remove from favorites"
                    className="absolute top-3 right-3 p-2 bg-white/10 backdrop-blur-sm rounded-full shadow-md hover:bg-red-500/20 transition-colors cursor-pointer"
                  >
                    <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
                  </Motion.button>
                  {product.discountPercentage > 10 && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {Math.round(product.discountPercentage)}% OFF
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 uppercase tracking-wider">{product.category}</span>
                  </div>
                  {/* --- UPDATE: Standardized name property --- */}
                  <h3 className="font-semibold text-white mb-2 line-clamp-2 min-h-[3rem]">
                    {product.name || product.title}
                  </h3>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 fill-yellow-400 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm font-medium text-gray-300">{product.rating}</span>
                    </div>
                    <span className="mx-2 text-gray-600">•</span>
                    <span className="text-sm text-gray-400">{product.stock} in stock</span>
                  </div>

                  <div className="flex items-baseline space-x-2 mb-4">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                      ₹{usdToInr(product.price).toLocaleString('en-IN')}
                    </span>
                    {product.discountPercentage > 10 && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{usdToInr(product.price * (1 + product.discountPercentage / 100)).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addToCart(product)}
                      aria-label="Add product to cart"
                      className="flex-1 cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-1 shadow-md text-sm"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </Motion.button>
                    <Motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addToFavorites(product)}
                      aria-label="Remove from favorites"
                      className="p-2 cursor-pointer bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-red-500/20 hover:border-red-500/30 transition-colors"
                    >
                      <Heart className="h-4 w-4 text-red-500" fill="currentColor" />
                    </Motion.button>
                  </div>
                </div>
              </Motion.div>
            ))}
          </Motion.div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;