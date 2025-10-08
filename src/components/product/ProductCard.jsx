// components/product/ProductCard.jsx
import React, { useState } from "react";
import { Heart, ShoppingCart, Star, Eye, Zap, Shield, ArrowRight } from "lucide-react";
import { motion as Motion , AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext"; // UPDATE: Imported useCart

const ProductCard = ({ product, viewMode = "grid" }) => {
  const { addToCart, addToFavorites, isFavorite } = useCart(); // UPDATE: Connected to context
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // --- UPDATE: Removed console.log statements for cleaner code ---

  // Check if product exists
  if (!product) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
        <p className="text-red-400">Product data is missing</p>
      </div>
    );
  }

  // Helper function to convert USD to INR
  const usdToInr = (price) => {
    return Math.round(price * 82);
  };

  // --- UPDATE: Replaced placeholder functions with context actions ---
  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleToggleFavorite = () => {
    addToFavorites(product);
  };

  // List View Layout
  if (viewMode === "list") {
    return (
      <div className="flex gap-6 p-4 bg-slate-800/50 rounded-xl border border-white/10">
        <div className="w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden flex-shrink-0">
          <img
            // --- UPDATE: Standardized image property order ---
            src={product.image || product.thumbnail || `https://picsum.photos/seed/${product.id || 'product'}/200/200.jpg`}
            alt={product.name || product.title || "Product"}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-contain p-3 transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-700 animate-pulse" />
          )}
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 uppercase tracking-wider">
                {product.category || "Category"}
              </span>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm font-medium text-gray-300">{product.rating || 0}</span>
              </div>
            </div>
            
            {/* --- UPDATE: Standardized name property --- */}
            <h3 className="font-bold text-white text-lg mb-3 line-clamp-1">
              {product.name || product.title || "Product Title"}
            </h3>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
              <span>{product.stock || 0} in stock</span>
              {product.discountPercentage > 10 && (
                <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {Math.round(product.discountPercentage)}% OFF
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-3">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                ₹{usdToInr(product.price || 0).toLocaleString('en-IN')}
              </span>
              {product.discountPercentage > 10 && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{usdToInr((product.price || 0) * (1 + (product.discountPercentage || 0) / 100)).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleToggleFavorite}
                // --- UPDATE: Added aria-label for accessibility ---
                aria-label="Add to favorites"
                className="p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-200 cursor-pointer"
              >
                <Heart 
                  className="h-5 w-5" 
                  // --- UPDATE: Favorite state is now from context ---
                  fill={isFavorite(product.id) ? "#EF4444" : "none"}
                  color={isFavorite(product.id) ? "#EF4444" : "#9CA3AF"}
                />
              </button>
              
              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                aria-label="Add product to cart"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 cursor-pointer text-white font-semibold rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </Motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Layout
  return (
    <Motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-blue-500/30 transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
        <img
          // --- UPDATE: Standardized image property order ---
          src={product.image || product.thumbnail || `https://picsum.photos/seed/${product.id || 'product'}/300/300.jpg`}
          alt={product.name || product.title || "Product"}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-contain p-8 transition-all duration-700 relative z-5 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-700 animate-pulse" />
        )}
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
          {product.discountPercentage > 10 && (
            <Motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
            >
              {Math.round(product.discountPercentage)}% OFF
            </Motion.div>
          )}
{/*           
          {product.stock > 50 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
            >
              New
            </motion.div>
          )} */}
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 z-20">
          <Motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFavorite}
            aria-label="Add to favorites"
            className="p-3 bg-white/10 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/20 transition-all duration-200 cursor-pointer"
          >
            <Heart 
              className="h-5 w-5" 
              // --- UPDATE: Favorite state is now from context ---
              fill={isFavorite(product.id) ? "#EF4444" : "none"}
              color={isFavorite(product.id) ? "#EF4444" : "#9CA3AF"}
            />
          </Motion.button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-6">
        <div className="mb-3">
          <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 uppercase tracking-wider">
            {product.category || "Category"}
          </span>
        </div>
        
        {/* --- UPDATE: Standardized name property --- */}
        <h3 className="font-bold text-white mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-300">
          {product.name || product.title || "Product Title"}
        </h3>
        
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm font-medium text-gray-300">{product.rating || 0}</span>
          </div>
          <span className="mx-2 text-gray-600">•</span>
          <span className="text-sm text-gray-400">{product.stock || 0} in stock</span>
        </div>

        <div className="flex items-baseline space-x-2 mb-4">
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            ₹{usdToInr(product.price || 0).toLocaleString('en-IN')}
          </span>
          {product.discountPercentage > 10 && (
            <span className="text-sm text-gray-500 line-through">
              ₹{usdToInr((product.price || 0) * (1 + (product.discountPercentage || 0) / 100)).toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <Motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          aria-label="Add product to cart"
          className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>Add to Cart</span>
          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1" />
        </Motion.button>
      </div>
    </Motion.div>
  );
};

export default ProductCard;