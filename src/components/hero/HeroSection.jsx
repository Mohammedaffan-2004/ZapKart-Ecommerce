// components/hero/HeroSection.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play, Star, Shield, Truck, Sparkles, ChevronDown, Zap, Award, CheckCircle, ShoppingCart, X } from "lucide-react";
import { useCart } from "../../context/CartContext";

// Custom throttle function
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

// Video Modal Component
const VideoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-4xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
          <div className="aspect-video">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with actual demo video
              title="ZapKart Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
            aria-label="Close video"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Product Card Component
const ProductCard = ({ product, onAddToCart }) => {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-3xl opacity-30"></div>
      
      {/* Product Card */}
      <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
        <div className="aspect-square relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
          <img 
            src={product.image}
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          
          {/* Floating Badge */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
          >
            -{product.discount}% OFF
          </motion.div>
        </div>
        
        {/* Product Info */}
        <div className="mt-6">
          <h3 className="text-white text-xl font-bold mb-2">{product.name}</h3>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-gray-300 text-sm">({product.reviews} reviews)</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-3xl font-bold text-white">${product.price}</span>
              <span className="text-gray-400 line-through ml-2">${product.originalPrice}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onAddToCart(product)}
              className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full text-white shadow-lg"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="h-5 w-5 cursor-pointer" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, label, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ scale: 1.05 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
    >
      <Icon className="h-6 w-6 text-blue-400 mb-2" />
      <h3 className="text-white font-semibold text-sm">{label}</h3>
      <p className="text-gray-400 text-xs">{description}</p>
    </motion.div>
  );
};

// Floating Info Card Component
const FloatingCard = ({ icon: Icon, title, subtitle, delay, position }) => {
  const positionClasses = {
    'top-right': 'absolute -top-8 -right-8',
    'bottom-left': 'absolute -bottom-8 -left-8'
  };

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay }}
      className={`${positionClasses[position]} bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl`}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
          <Icon className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <p className="text-white font-semibold">{title}</p>
          <p className="text-gray-400 text-sm">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
};

const HeroSection = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isMouseEffectEnabled, setIsMouseEffectEnabled] = useState(true);
  const heroRef = useRef(null);

  const words = ["Innovation", "Quality", "Style", "Comfort", "Excellence"];
  
  // Sample product for the hero card - in a real app, this would come from an API
  const heroProduct = {
    id: 'hero-headphones-1',
    name: 'Premium Wireless Headphones',
    price: 299,
    originalPrice: 599,
    discount: 50,
    reviews: 2345,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  };

  // Throttled mouse move handler
  const handleMouseMove = useCallback(throttle((e) => {
    if (isMouseEffectEnabled && heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      setMousePosition({ 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      });
    }
  }, 50), [isMouseEffectEnabled]);

  useEffect(() => {
    // Word rotation interval
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    
    // Add mouse move listener
    window.addEventListener('mousemove', handleMouseMove);
    
    // Disable mouse effect on touch devices
    const checkTouchDevice = () => {
      setIsMouseEffectEnabled(!('ontouchstart' in window || navigator.maxTouchPoints > 0));
    };
    
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkTouchDevice);
    };
  }, [handleMouseMove]);

  const handleAddToCart = (product) => {
    addToCart(product);
    // Optional: You could add a toast notification here
    console.log(`${product.name} added to cart!`);
  };

  const handleWatchDemo = () => {
    setIsVideoModalOpen(true);
  };

  const handleStartShopping = () => {
    // Navigate to products page instead of shop
    navigate('/products');
  };

  return (
    <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20 lg:py-28">
      {/* Background */}
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
      </div>

      {/* Mouse Follow Effect - Only on non-touch devices */}
      {isMouseEffectEnabled && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
          }}
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
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
              New Collection 2025 - Limited Time Offer
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
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
              className="text-lg text-gray-300 mb-8 max-w-2xl"
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
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartShopping}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 overflow-hidden"
                aria-label="Start shopping now"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Start Shopping
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWatchDemo}
                className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                aria-label="Watch demo video"
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
              <FeatureCard 
                icon={Shield} 
                label="Secure Payment" 
                desc="100% encrypted" 
                delay={0.6} 
              />
              <FeatureCard 
                icon={Truck} 
                label="Free Shipping" 
                desc="On orders $50+" 
                delay={0.7} 
              />
              <FeatureCard 
                icon={Award} 
                label="Premium Quality" 
                desc="Guaranteed" 
                delay={0.8} 
              />
            </div>
          </motion.div>

          {/* Right Content - Product Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <ProductCard product={heroProduct} onAddToCart={handleAddToCart} />
            
            {/* Floating Cards */}
            <FloatingCard 
              icon={CheckCircle} 
              title="In Stock" 
              subtitle="Ready to ship" 
              delay={0.5} 
              position="top-right" 
            />
            
            {/* <FloatingCard 
              icon={Zap} 
              title="Fast Delivery" 
              subtitle="2-3 days" 
              delay={1} 
              position="bottom-left" 
            /> */}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex justify-center mt-16"
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
      
      {/* Video Modal */}
      <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />
    </section>
  );
};

export default HeroSection;