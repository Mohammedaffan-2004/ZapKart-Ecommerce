// components/product/ProductList.jsx - UPDATED VERSION
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Package, Sparkles, Grid, List, AlertCircle, ChevronDown } from "lucide-react";
import ProductCard from "./ProductCard";

const ProductList = ({ 
  products = [], 
  loading = false, 
  error = null,
  onLoadMore,
  hasMore = false,
  loadingMore = false
}) => {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Memoized sorting logic
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
      case "discount-desc":
        return sortableProducts.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
      case "featured":
      default:
        return sortableProducts;
    }
  }, [products, sortBy]);

  // Memoized sort options
  const sortOptions = useMemo(() => [
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "rating-desc", label: "Best Rated" },
    { value: "discount-desc", label: "Biggest Discount" }
  ], []);

  // Get current sort label
  const currentSortLabel = useMemo(() => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return option ? option.label : "Featured";
  }, [sortBy, sortOptions]);

  // Handle sort change
  const handleSortChange = useCallback((value) => {
    setSortBy(value);
    setSortDropdownOpen(false);
  }, []);

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
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
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error && products.length === 0) {
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

  // Empty state
  if (!products || products.length === 0) {
    return (
      <motion.div
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
      </motion.div>
    );
  }

  return (
    <div className="relative">
      {/* Header */}
      <motion.div
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
          <div ref={sortRef} className="relative">
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              aria-expanded={sortDropdownOpen}
              aria-haspopup="listbox"
            >
              <span className="mr-2">{currentSortLabel}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {sortDropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 z-50 overflow-hidden"
                  role="listbox"
                >
                  {sortOptions.map((option) => (
                    <li key={option.value}>
                      <button
                        onClick={() => handleSortChange(option.value)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          sortBy === option.value
                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                            : "text-gray-300 hover:bg-white/10"
                        }`}
                        role="option"
                        aria-selected={sortBy === option.value}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Product Grid/List */}
      <motion.div 
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
        <AnimatePresence>
          {sortedProducts.map((product, index) => (
            <motion.div
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
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load More Button */}
      {onLoadMore && hasMore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLoadMore}
            disabled={loadingMore}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center mx-auto disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Products"
            )}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default ProductList;