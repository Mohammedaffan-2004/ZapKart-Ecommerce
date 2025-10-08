// components/hero/HeroSection.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // UPDATE: Imported useNavigate
import { ArrowRight, Play, Star, Shield, Truck, Sparkles, ChevronDown, Zap, Award, CheckCircle, ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext"; // UPDATE: Imported useCart

const HeroSection = () => {
  const navigate = useNavigate(); // UPDATE: Hook for navigation
  const { addToCart } = useCart(); // UPDATE: Hook for cart functionality

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const words = ["Innovation", "Quality", "Style", "Comfort", "Excellence"];
  
  // --- UPDATE: Replaced useScrollAnimation with a simpler approach ---
  // We will use Framer Motion's `whileInView` prop directly on the motion.divs.
  // This removes the dependency on a custom hook.
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // --- UPDATE: Created a sample product object for the hero card ---
  const heroProduct = {
    id: 'hero-headphones-1',
    name: 'Premium Wireless Headphones',
    price: 299,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  };

  const handleAddToCart = () => {
    addToCart(heroProduct);
    // Optional: You could add a toast notification here
    console.log(`${heroProduct.name} added to cart!`);
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated Background with Images */}
      <div className="absolute inset-0">
        {/* Background Image Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
            alt="Background" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-purple-900/30 to-slate-900/70"></div>
        
        {/* Floating Image Elements */}
        <motion.div
          animate={{ 
            y: [0, -30, 0], 
            rotate: [0, 5, -5, 0] 
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-20 left-10 w-32 h-32 opacity-30"
        >
          <img 
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            alt="Floating Product 1" 
            className="w-full h-full object-cover rounded-full"
          />
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, 30, 0], 
            rotate: [0, -5, 5, 0] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-40 right-20 w-40 h-40 opacity-25"
        >
          <img 
            src="https://images.unsplash.com/photo-1572635146651-36d4966be5f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            alt="Floating Product 2" 
            className="w-full h-full object-cover rounded-full"
          />
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, -20, 0], 
            x: [0, 20, 0] 
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-40 left-1/4 w-36 h-36 opacity-20"
        >
          <img 
            src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            alt="Floating Product 3" 
            className="w-full h-full object-cover rounded-full"
          />
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, 25, 0], 
            x: [0, -25, 0] 
          }}
          transition={{ 
            duration: 9, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute bottom-20 right-1/3 w-28 h-28 opacity-25"
        >
          <img 
            src="https://images.unsplash.com/photo-1434056886845-dacabffe4584?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            alt="Floating Product 4" 
            className="w-full h-full object-cover rounded-full"
          />
        </motion.div>
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Mouse Follow Effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left Content */}
          {/* --- UPDATE: Used whileInView for scroll animations --- */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 backdrop-blur-sm text-blue-300 text-sm font-medium mb-6"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              New Collection 2024 - Limited Time Offer
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="text-white">Discover</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400">
                {words[currentWordIndex]}
              </span>
              <br />
              <span className="text-white">Shopping</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl text-gray-300 mb-8 max-w-2xl"
            >
              Experience the future of e-commerce with AI-powered recommendations, 
              seamless checkout, and exclusive deals on premium products.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              {/* --- UPDATE: Made "Start Shopping" button functional --- */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/shop')} // Navigate to the shop page
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Start Shopping
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
              
              {/* --- UPDATE: Made "Watch Demo" button functional --- */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => alert('Demo video would play here!')} // Placeholder for demo action
                className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center gap-8"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 border-2 border-white"></div>
                  ))}
                </div>
                <span className="text-gray-300">50,000+ Happy Customers</span>
              </div>
              
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-gray-300 ml-1">4.9/5 Rating</span>
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12"
            >
              {[
                { icon: Shield, label: "Secure Payment", desc: "100% encrypted" },
                { icon: Truck, label: "Free Shipping", desc: "On orders $50+" },
                { icon: Award, label: "Premium Quality", desc: "Guaranteed" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <feature.icon className="h-6 w-6 text-blue-400 mb-2" />
                  <h3 className="text-white font-semibold text-sm">{feature.label}</h3>
                  <p className="text-gray-400 text-xs">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Product Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Main Product Card */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-3xl opacity-30"></div>
              
              {/* Product Card */}
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="aspect-square relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                  <img 
                    src={heroProduct.image}
                    alt="Hero Product" 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Floating Badge */}
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                  >
                    -50% OFF
                  </motion.div>
                </div>
                
                {/* Product Info */}
                <div className="mt-6">
                  <h3 className="text-white text-xl font-bold mb-2">{heroProduct.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-gray-300 text-sm">(2,345 reviews)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-white">${heroProduct.price}</span>
                      <span className="text-gray-400 line-through ml-2">$599</span>
                    </div>
                    {/* --- UPDATE: Connected "Add to Cart" button --- */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleAddToCart}
                      className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full text-white shadow-lg"
                      aria-label="Add product to cart"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Cards with Images */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -top-8 -right-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">In Stock</p>
                  <p className="text-gray-400 text-sm">Ready to ship</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -left-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Fast Delivery</p>
                  <p className="text-gray-400 text-sm">2-3 days</p>
                </div>
              </div>
            </motion.div>

            {/* Additional Floating Products */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute top-1/2 -left-16 w-24 h-24 opacity-60"
            >
              <img 
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Side Product 1" 
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
            </motion.div>

            <motion.div
              animate={{ 
                scale: [1, 1.15, 1],
                rotate: [0, -15, 15, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 3
              }}
              className="absolute bottom-1/3 -right-20 w-20 h-20 opacity-50"
            >
              <img 
                src="https://images.unsplash.com/photo-1572563123513-39be3a1d6a8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Side Product 2" 
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-gray-400"
          >
            <span className="text-sm mb-2">Scroll to explore</span>
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;