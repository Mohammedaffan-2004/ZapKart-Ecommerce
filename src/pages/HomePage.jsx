// src/pages/HomePage.jsx - FINAL VERSION
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {motion as Motion  } from "framer-motion";
import HeroSection from "../components/hero/HeroSection";
import ProductList from "../components/product/ProductList";
import HorizontalFilter from "../components/product/HorizontalFilter";
import FeaturesSection from "../components/sections/FeaturesSection";
import StatsSection from "../components/sections/StatsSection";
import NewsletterSection from "../components/sections/NewsletterSection";

const usdToInr = (usd) => Math.round(usd * 83);

const HomePage = () => {
  // --- STATE FOR PRODUCTS ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- STATE FOR ALL FILTERS (THE BRAIN) ---
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState(100000);
  const [selectedRatings, setSelectedRatings] = useState([]); // <-- STATE FOR RATINGS
  const [selectedBrands, setSelectedBrands] = useState([]); // <-- STATE FOR BRANDS

  // --- EFFECTS (fetching data, etc.) ---
  useEffect(() => { document.title = "ZapKart - Premium Shopping Experience"; }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); setError(null);
      try {
        const response = await fetch("https://dummyjson.com/products?limit=100");
        if (!response.ok) throw new Error(`API status: ${response.status}`);
        const data = await response.json();
        if (data.products?.length > 0) {
          setProducts(data.products);
        } else {
          throw new Error("No products found.");
        }
      } catch (err) {
        console.error("Using mock data:", err);
        setError("Could not load products from server. Showing sample data.");
        const mockProducts = Array.from({ length: 30 }, (_, i) => ({
          id: `mock-${i + 1}`, name: `Premium Product ${i + 1}`, title: `Premium Product ${i + 1}`,
          category: ["electronics", "fashion", "home", "sports", "books", "toys"][i % 6],
          price: Math.floor(Math.random() * 500) + 50, discountPercentage: Math.floor(Math.random() * 30),
          rating: (Math.random() * 2 + 3).toFixed(1), stock: Math.floor(Math.random() * 100) + 1,
          // IMPORTANT: Make sure mock data has a 'brand' property
          brand: ["Apple", "Samsung", "Nike", "Adidas", "Sony"][i % 5],
          thumbnail: `https://picsum.photos/seed/product${i + 1}/800/600`,
          image: `https://picsum.photos/seed/product${i + 1}/800/600`,
        }));
        setProducts(mockProducts);
      } finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  // --- MEMOIZED VALUES ---
  const categories = useMemo(() => [...new Set(products.map(p => p.category))], [products]);

  // --- THE CORE FILTERING LOGIC ---
  const filteredProducts = useMemo(() => {
    console.log("Filtering products with:", { selectedRatings, selectedBrands }); // <-- DEBUG LOG
    return products.filter(product => {
      const productName = product.name || product.title || "";
      const matchesSearch = productName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesPrice = usdToInr(product.price) <= priceRange;
      const matchesRating = selectedRatings.length === 0 || selectedRatings.some(r => product.rating >= r);
      const productBrand = product.brand || '';
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(productBrand);
      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesBrand;
    });
  }, [products, searchQuery, selectedCategory, priceRange, selectedRatings, selectedBrands]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <section className="py-16">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* --- PASSING ALL STATE AND FUNCTIONS TO THE FILTER --- */}
            <HorizontalFilter
              categories={categories}
              selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
              priceRange={priceRange} setPriceRange={setPriceRange}
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              selectedRatings={selectedRatings} setSelectedRatings={setSelectedRatings} // <-- PASSING STATE
              selectedBrands={selectedBrands} setSelectedBrands={setSelectedBrands} // <-- PASSING STATE
            />
            <ProductList products={filteredProducts} loading={loading} error={error} />
          </Motion.div>
        </div>
      </section>
      <NewsletterSection />
    </div>
  );
};

export default HomePage;