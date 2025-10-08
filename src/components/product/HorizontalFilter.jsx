// src/components/product/HorizontalFilter.jsx - FINAL FIXED VERSION
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Filter, Search, ChevronDown, Star, X, SlidersHorizontal, Sparkles, Tag, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HorizontalFilter = ({ 
  categories, brands, selectedCategory, setSelectedCategory, priceRange, setPriceRange,
  searchQuery, setSearchQuery, selectedRatings, setSelectedRatings,
  selectedBrands, setSelectedBrands
}) => {
  const [expandedSections, setExpandedSections] = useState({ category: false, price: false, rating: false, brand: false });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const categoryRef = useRef(null);
  const priceRef = useRef(null);
  const ratingRef = useRef(null);

  // --- FIX: Consolidated and more robust click outside handler ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside any of the dropdown containers
      if (
        (categoryRef.current && !categoryRef.current.contains(event.target)) &&
        (priceRef.current && !priceRef.current.contains(event.target)) &&
        (ratingRef.current && !ratingRef.current.contains(event.target))
      ) {
        // Close all dropdowns
        setExpandedSections({ category: false, price: false, rating: false, brand: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({ 
      ...prev, 
      [section]: !prev[section] 
    }));
  }, []);

  const handleRatingChange = useCallback((rating) => {
    setSelectedRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating) 
        : [...prev, rating]
    );
  }, [setSelectedRatings]);

  const handleBrandChange = useCallback((brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand) 
        : [...prev, brand]
    );
  }, [setSelectedBrands]);

  const clearAllFilters = useCallback(() => {
    setSelectedCategory("all");
    setPriceRange(100000);
    setSelectedRatings([]);
    setSelectedBrands([]);
    setSearchQuery("");
    setExpandedSections({ category: false, price: false, rating: false, brand: false });
  }, [setSelectedCategory, setPriceRange, setSelectedRatings, setSelectedBrands, setSearchQuery]);

  const hasActiveFilters = selectedCategory !== "all" || 
                          priceRange < 100000 || 
                          selectedRatings.length > 0 || 
                          selectedBrands.length > 0 ||
                          searchQuery !== "";

  return (
    // FIX: Added 'relative z-40' to ensure the filter container is above other content but below modals/navbars.
    <div className="relative z-40 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4 md:p-6 mb-8">
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px] lg:min-w-[300px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full pl-12 pr-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all text-sm" 
          />
        </div>

        {/* Category Filter */}
        <div ref={categoryRef} className="relative">
          <button 
            onClick={() => toggleSection('category')} 
            className={`flex items-center space-x-2 px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all whitespace-nowrap ${
              selectedCategory !== "all" ? "bg-blue-600/20 border-blue-500/30" : ""
            }`}
          >
            <Tag className="h-4 w-4 text-blue-400" />
            <span className="text-white font-medium text-sm">
              {selectedCategory === "all" ? "Category" : selectedCategory}
            </span>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${expandedSections.category ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {expandedSections.category && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                // FIX: Added 'z-50' to the dropdown to ensure it appears above the filter container and other page elements.
                className="absolute top-full left-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 z-50 overflow-hidden"
              >
                <div className="p-2 max-h-64 overflow-y-auto">
                  <button 
                    onClick={() => {
                      setSelectedCategory("all");
                      setExpandedSections(prev => ({ ...prev, category: false }));
                    }} 
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      selectedCategory === "all" 
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white" 
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => {
                        setSelectedCategory(cat);
                        setExpandedSections(prev => ({ ...prev, category: false }));
                      }} 
                      className={`w-full text-left px-3 py-2 rounded-lg capitalize text-sm ${
                        selectedCategory === cat 
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white" 
                          : "text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Range */}
        <div ref={priceRef} className="relative">
          <button 
            onClick={() => toggleSection('price')} 
            className={`flex items-center space-x-2 px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all whitespace-nowrap ${
              priceRange < 100000 ? "bg-blue-600/20 border-blue-500/30" : ""
            }`}
          >
            <DollarSign className="h-4 w-4 text-blue-400" />
            <span className="text-white font-medium text-sm">
              Price
            </span>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {expandedSections.price && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                // FIX: Added 'z-50' to the dropdown.
                className="absolute top-full left-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 z-50 p-4"
              >
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>₹0</span>
                    <span className="font-semibold text-blue-400">₹{priceRange.toLocaleString('en-IN')}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100000" 
                    step="1000" 
                    value={priceRange} 
                    onChange={(e) => setPriceRange(Number(e.target.value))} 
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" 
                    style={{ 
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(priceRange / 100000) * 100}%, #374151 ${(priceRange / 100000) * 100}%, #374151 100%)` 
                    }} 
                  />
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {['5000', '25000', '50000', '100000'].map(v => (
                      <button 
                        key={v} 
                        onClick={() => setPriceRange(Number(v))} 
                        className="px-2 py-1 text-xs bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 rounded-lg border border-white/10 hover:border-blue-500/30 transition-all"
                      >
                        ₹{Number(v).toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rating Filter */}
        <div ref={ratingRef} className="relative">
          <button 
            onClick={() => toggleSection('rating')} 
            className={`flex items-center space-x-2 px-4 py-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all whitespace-nowrap ${
              selectedRatings.length > 0 ? "bg-blue-600/20 border-blue-500/30" : ""
            }`}
          >
            <Star className="h-4 w-4 text-blue-400" />
            <span className="text-white font-medium text-sm">
              {selectedRatings.length > 0 ? `${Math.min(...selectedRatings)}+ Stars` : "Rating"}
            </span>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${expandedSections.rating ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {expandedSections.rating && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                // FIX: Added 'z-50' to the dropdown.
                className="absolute top-full left-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 z-50 p-2"
              >
                <div className="space-y-1">
                  {[4, 3, 2, 1].map(rating => (
                    <label 
                      key={rating} 
                      className="flex items-center p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedRatings.includes(rating)} 
                        onChange={() => handleRatingChange(rating)} 
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 bg-white/10 border-white/20" 
                      />
                      <div className="flex items-center ml-3 flex-1">
                        <div className="flex items-center mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-300">& Up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons Group */}
        <div className="flex items-center gap-2 ml-auto">
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            onClick={() => setIsFilterOpen(!isFilterOpen)} 
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="font-medium text-sm">More</span>
          </motion.button>

          {hasActiveFilters && (
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              onClick={clearAllFilters} 
              className="px-4 py-2.5 bg-white/10 backdrop-blur-sm text-gray-300 rounded-xl hover:bg-white/20 border border-white/10 transition-all flex items-center space-x-2"
              title="Clear all filters"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }} 
            exit={{ opacity: 0, height: 0 }} 
            className="mt-4 pt-4 border-t border-white/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-blue-400" />
                  Popular Brands
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {Array.isArray(brands) && brands.length > 0 ? (
                    brands.map(brand => (
                      <label 
                        key={brand} 
                        className="flex items-center p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                      >
                        <input 
                          type="checkbox" 
                          checked={selectedBrands.includes(brand)} 
                          onChange={() => handleBrandChange(brand)} 
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 bg-white/10 border-white/20" 
                        />
                        <span className="ml-3 text-sm text-gray-300">{brand}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No brands available</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4">
          {searchQuery && (
            <div className="flex items-center bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 text-xs text-blue-300">
              Search: {searchQuery}
              <button 
                onClick={() => setSearchQuery("")} 
                className="ml-2 text-blue-300 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {selectedCategory !== "all" && (
            <div className="flex items-center bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 text-xs text-blue-300">
              Category: {selectedCategory}
              <button 
                onClick={() => setSelectedCategory("all")} 
                className="ml-2 text-blue-300 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {priceRange < 100000 && (
            <div className="flex items-center bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 text-xs text-blue-300">
              Price: Under ₹{priceRange.toLocaleString('en-IN')}
              <button 
                onClick={() => setPriceRange(100000)} 
                className="ml-2 text-blue-300 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {selectedRatings.map(rating => (
            <div 
              key={rating} 
              className="flex items-center bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 text-xs text-blue-300"
            >
              {rating}+ Stars
              <button 
                onClick={() => handleRatingChange(rating)} 
                className="ml-2 text-blue-300 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {selectedBrands.map(brand => (
            <div 
              key={brand} 
              className="flex items-center bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 text-xs text-blue-300"
            >
              {brand}
              <button 
                onClick={() => handleBrandChange(brand)} 
                className="ml-2 text-blue-300 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HorizontalFilter;