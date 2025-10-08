// src/components/product/HorizontalFilter.jsx - FINAL VERSION
import React, { useState } from "react";
import { Filter, Search, ChevronDown, Star, X, SlidersHorizontal, Sparkles, Tag, DollarSign } from "lucide-react";
import {motion as Motion , AnimatePresence } from "framer-motion";

// --- RECEIVING ALL PROPS FROM THE HOMEPAGE (THE BRAIN) ---
const HorizontalFilter = ({ 
  categories, selectedCategory, setSelectedCategory, priceRange, setPriceRange,
  searchQuery, setSearchQuery, selectedRatings, setSelectedRatings,
  selectedBrands, setSelectedBrands
}) => {
  const [expandedSections, setExpandedSections] = useState({ category: false, price: false, rating: false, brand: false });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleSection = (section) => setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));

  // --- THESE HANDLERS CALL THE FUNCTIONS FROM PROPS ---
  const handleRatingChange = (rating) => {
    // This tells the HomePage to update its state
    setSelectedRatings(prev => prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]);
  };
  const handleBrandChange = (brand) => {
    // This tells the HomePage to update its state
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };
  const clearAllFilters = () => {
    setSelectedCategory("all"); setPriceRange(100000); setSelectedRatings([]); setSelectedBrands([]); setSearchQuery("");
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search Bar */}
        <div className="relative flex-1 lg:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
          <input type="text" placeholder="Search premium products..." value={searchQuery} onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400" />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <button onClick={() => toggleSection('category')} className={`flex items-center space-x-2 px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 ${selectedCategory !== "all" ? "bg-blue-600/20 border-blue-500/30" : ""}`}>
            <Tag className="h-4 w-4 text-blue-400" />
            <span className="text-white font-medium">{selectedCategory === "all" ? "All Categories" : selectedCategory}</span>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${expandedSections.category ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>{expandedSections.category && (<Motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 z-50 overflow-hidden">
            <div className="p-2 max-h-64 overflow-y-auto">
              <button onClick={() => setSelectedCategory && setSelectedCategory("all")} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedCategory === "all" ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white" : "text-gray-300 hover:bg-white/10"}`}>All Categories</button>
              {categories.map(cat => (<button key={cat} onClick={() => setSelectedCategory && setSelectedCategory(cat)} className={`w-full text-left px-3 py-2 rounded-lg capitalize text-sm ${selectedCategory === cat ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white" : "text-gray-300 hover:bg-white/10"}`}>{cat}</button>))}
            </div></Motion.div>)}</AnimatePresence>
        </div>

        {/* Price Range */}
        <div className="relative">
          <button onClick={() => toggleSection('price')} className={`flex items-center space-x-2 px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 ${priceRange < 100000 ? "bg-blue-600/20 border-blue-500/30" : ""}`}>
            <DollarSign className="h-4 w-4 text-blue-400" />
            <span className="text-white font-medium">Under ₹{priceRange.toLocaleString('en-IN')}</span>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>{expandedSections.price && (<Motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 z-50 p-4">
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-400"><span>₹0</span><span className="font-semibold text-blue-400">₹{priceRange.toLocaleString('en-IN')}</span></div>
              <input type="range" min="0" max="100000" step="1000" value={priceRange} onChange={(e) => setPriceRange && setPriceRange(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" style={{ background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(priceRange / 100000) * 100}%, #374151 ${(priceRange / 100000) * 100}%, #374151 100%)` }} />
              <div className="grid grid-cols-2 gap-2 mt-3">{['5000', '25000', '50000', '100000'].map(v => (<button key={v} onClick={() => setPriceRange && setPriceRange(Number(v))} className="px-2 py-1 text-xs bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 rounded-lg border border-white/10 hover:border-blue-500/30">₹{Number(v).toLocaleString('en-IN')}</button>))}</div>
            </div></Motion.div>)}</AnimatePresence>
        </div>

        {/* Rating Filter */}
        <div className="relative">
          <button onClick={() => toggleSection('rating')} className={`flex items-center space-x-2 px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 ${selectedRatings.length > 0 ? "bg-blue-600/20 border-blue-500/30" : ""}`}>
            <Star className="h-4 w-4 text-blue-400" />
            <span className="text-white font-medium">{selectedRatings.length > 0 ? `${selectedRatings.length}+ Stars` : "Rating"}</span>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${expandedSections.rating ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>{expandedSections.rating && (<Motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 z-50 p-2">
            <div className="space-y-1">{[4, 3, 2, 1].map(rating => (<label key={rating} className="flex items-center p-2 rounded-lg hover:bg-white/5 cursor-pointer">
              <input type="checkbox" checked={selectedRatings.includes(rating)} onChange={() => handleRatingChange(rating)} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 bg-white/10 border-white/20" />
              <div className="flex items-center ml-3 flex-1"><div className="flex items-center mr-2">{[...Array(5)].map((_, i) => (<Star key={i} className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />))}</div><span className="text-sm text-gray-300">& Up</span></div>
            </label>))}</div></Motion.div>)}</AnimatePresence>
        </div>

        {/* Advanced Filters */}
        <Motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/25">
          <SlidersHorizontal className="h-4 w-4" /><span className="font-medium">Advanced</span>
        </Motion.button>

        {/* Clear Filters */}
        {(selectedCategory !== "all" || priceRange < 100000 || selectedRatings.length > 0 || selectedBrands.length > 0) && (<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={clearAllFilters} className="px-4 py-3 bg-white/10 backdrop-blur-sm text-gray-300 rounded-xl hover:bg-white/20 border border-white/10">Clear All</motion.button>)}
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>{isFilterOpen && (<Motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-6 pt-6 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-3 flex items-center"><Sparkles className="h-4 w-4 mr-2 text-blue-400" />Popular Brands</h3>
            <div className="space-y-2">{['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony'].map(brand => (<label key={brand} className="flex items-center p-2 rounded-lg hover:bg-white/5 cursor-pointer">
              <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => handleBrandChange(brand)} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 bg-white/10 border-white/20" />
              <span className="ml-3 text-sm text-gray-300">{brand}</span>
            </label>))}</div>
          </div>
        </div>
      </Motion.div>)}</AnimatePresence>
    </div>
  );
};

export default HorizontalFilter;