// components/product/ProductList.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion as Motion } from "framer-motion";
import { Loader2, Package, Sparkles, Grid, List, AlertCircle } from "lucide-react";
import ProductCard from "./ProductCard";

const ProductList = ({ 
  products = [], 
  loading = false, 
  onLoadMore // UPDATE: Added a prop for loading more products
}) => {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured"); // UPDATE: Added state for sorting
  const [error, setError] = useState(null);

  // --- UPDATE: Removed console.log statements for cleaner code ---

  useEffect(() => {
    if (products && !Array.isArray(products)) {
      console.error("Products is not an array:", products);
      setError("Invalid products data format");
    } else {
      setError(null);
    }
  }, [products]);

  // --- UPDATE: Implemented sorting logic with useMemo for performance ---
  const sortedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    const sortableProducts = [...products];
    switch (sortBy) {
      case "price-asc":
        return sortableProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-desc":
        return sortableProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "name-asc":
        return sortableProducts.sort((a, b) => (a.name || a.title || '').localeCompare(b.name || b.title || ''));
      case "rating-desc":
        return sortableProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "featured":
      default:
        return sortableProducts; // Return original order for 'featured'
    }
  }, [products, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur-xl opacity-50"></div>
            <div className="relative bg-slate-900 rounded-full p-8">
              <Loader2 className="h-12 w-12 text-blue-400 animate-spin" />
            </div>
          </div>
          <p className="mt-4 text-gray-400 font-medium">Loading Premium Products...</p>
        </Motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-8 bg-red-500/10 border border-red-500/30 rounded-xl">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Products</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-30"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Products Found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </div>
        </div>
      </Motion.div>
    );
  }

  return (
    <div className="relative">
      {/* Header */}
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white">Premium Collection</h2>
          <Sparkles className="h-5 w-5 text-blue-400" />
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          <span className="text-gray-400">{sortedProducts.length} Products Found</span>
          
          {/* View Toggle */}
          {/* --- UPDATE: Improved accessibility with fieldset --- */}
          <fieldset className="flex bg-white/10 backdrop-blur-sm rounded-lg p-1">
            <legend className="sr-only">View Mode</legend>
            <button
              onClick={() => setViewMode("grid")}
              aria-pressed={viewMode === "grid"}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              aria-pressed={viewMode === "list"}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </fieldset>
          
          {/* Sort Dropdown */}
          {/* --- UPDATE: Made the sort dropdown functional --- */}
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort products"
            className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="rating-desc">Best Rated</option>
          </select>
        </div>
      </Motion.div>

      {/* Product Grid/List */}
      <Motion.div 
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={
          viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
            : "space-y-4"
        }
      >
        {/* --- UPDATE: Map over the sorted products --- */}
        {sortedProducts.map((product, index) => (
          <Motion.div
            key={product.id || index}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.05,
              ease: "easeOut"
            }}
          >
            <ProductCard product={product} viewMode={viewMode} />
          </Motion.div>
        ))}
      </Motion.div>

      {/* Load More Button */}
      {/* --- UPDATE: Made the "Load More" button functional --- */}
      {onLoadMore && products.length > 0 && products.length >= 20 && (
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLoadMore}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
          >
            Load More Products
          </Motion.button>
        </Motion.div>
      )}
    </div>
  );
};

export default ProductList;