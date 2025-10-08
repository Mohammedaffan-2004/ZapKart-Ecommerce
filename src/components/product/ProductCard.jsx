// components/product/ProductCard.jsx - COMPACT VERSION
import React, { useState } from "react";
import { Heart, ShoppingCart, Star, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product, viewMode = "grid" }) => {
  const { addToCart, addToFavorites, isFavorite } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if product exists
  if (!product) {
    return (
      <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-md">
        <p className="text-red-400 text-xs">Product data is missing</p>
      </div>
    );
  }

  // Helper function to convert USD to INR
  const usdToInr = (price) => {
    return Math.round(price * 82);
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleToggleFavorite = () => {
    addToFavorites(product);
  };

  // List View Layout
  if (viewMode === "list") {
    return (
      <div className="flex gap-3 p-2 bg-slate-800/50 rounded-md border border-white/10 hover:border-blue-500/30 transition-all duration-300">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={product.image || product.thumbnail || `https://picsum.photos/seed/${product.id || 'product'}/200/200.jpg`}
            alt={product.name || product.title || "Product"}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-contain p-1 transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-700 animate-pulse" />
          )}
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 uppercase tracking-wider">
                {product.category || "Category"}
              </span>
              <div className="flex items-center">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-xs font-medium text-gray-300">{product.rating || 0}</span>
              </div>
            </div>
            
            <h3 className="font-bold text-white text-sm mb-1 line-clamp-1">
              {product.name || product.title || "Product Title"}
            </h3>
            
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>{product.stock || 0} in stock</span>
              {product.discountPercentage > 10 && (
                <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-1 py-0.5 rounded-full text-xs font-semibold">
                  {Math.round(product.discountPercentage)}% OFF
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-1">
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                ₹{usdToInr(product.price || 0).toLocaleString('en-IN')}
              </span>
              {product.discountPercentage > 10 && (
                <span className="text-xs text-gray-500 line-through">
                  ₹{usdToInr((product.price || 0) * (1 + (product.discountPercentage || 0) / 100)).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={handleToggleFavorite}
                aria-label="Add to favorites"
                className="p-2 bg-white/10 backdrop-blur-sm rounded-md hover:bg-white/20 transition-all duration-200 cursor-pointer"
              >
                <Heart 
                  className="h-4 w-4" 
                  fill={isFavorite(product.id) ? "#EF4444" : "none"}
                  color={isFavorite(product.id) ? "#EF4444" : "#9CA3AF"}
                />
              </button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                aria-label="Add product to cart"
                className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-md transition-all duration-200 flex items-center space-x-1 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
              >
                <ShoppingCart className="h-3 w-3" />
                <span className="text-xs">Add</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Layout
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-slate-800/50 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden hover:border-blue-500/30 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
        <img
          src={product.image || product.thumbnail || `https://picsum.photos/seed/${product.id || 'product'}/300/300.jpg`}
          alt={product.name || product.title || "Product"}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-contain p-2 transition-all duration-500 relative z-5 ${
            isHovered ? 'scale-105' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-700 animate-pulse" />
        )}
        
        {/* Top Badges */}
        <div className="absolute top-1 left-1 right-1 flex justify-between z-20">
          {product.discountPercentage > 10 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold shadow-lg"
            >
              {Math.round(product.discountPercentage)}% OFF
            </motion.div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-1 right-1 z-20">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFavorite}
            aria-label="Add to favorites"
            className="p-1.5 bg-white/10 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/20 transition-all duration-200 cursor-pointer"
          >
            <Heart 
              className="h-3 w-3" 
              fill={isFavorite(product.id) ? "#EF4444" : "none"}
              color={isFavorite(product.id) ? "#EF4444" : "#9CA3AF"}
            />
          </motion.button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3">
        <div className="mb-1">
          <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 uppercase tracking-wider">
            {product.category || "Category"}
          </span>
        </div>
        
        <h3 className="font-bold text-white mb-1 line-clamp-1 min-h-[1.2rem] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-300">
          {product.name || product.title || "Product Title"}
        </h3>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-xs font-medium text-gray-300">{product.rating || 0}</span>
          </div>
          <span className="mx-2 text-gray-600">•</span>
          <span className="text-xs text-gray-400">{product.stock || 0} in stock</span>
        </div>

        <div className="flex items-baseline space-x-1 mb-2">
          <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            ₹{usdToInr(product.price || 0).toLocaleString('en-IN')}
          </span>
          {product.discountPercentage > 10 && (
            <span className="text-xs text-gray-500 line-through">
              ₹{usdToInr((product.price || 0) * (1 + (product.discountPercentage || 0) / 100)).toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          aria-label="Add product to cart"
          className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 px-2.5 rounded-md transition-all duration-200 flex items-center justify-center space-x-1 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="text-xs">Add to Cart</span>
          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;