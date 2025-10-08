// components/sections/FeaturesSection.jsx
import React from "react";
import { motion as Motion  } from "framer-motion";
import { Truck, Shield, Headphones, Award, Zap, RefreshCw } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    { icon: Truck, label: "Free Shipping", description: "On all orders over ₹500", color: "from-blue-600 to-cyan-600" },
    { icon: Shield, label: "Secure Payment", description: "100% secure transactions", color: "from-green-500 to-teal-500" },
    { icon: Headphones, label: "24/7 Support", description: "Dedicated support team", color: "from-purple-500 to-pink-500" },
    { icon: Award, label: "Quality Guarantee", description: "Premium quality products", color: "from-yellow-500 to-orange-500" },
    { icon: Zap, label: "Fast Delivery", description: "Express shipping available", color: "from-red-500 to-pink-500" },
    { icon: RefreshCw, label: "Easy Returns", description: "30-day return policy", color: "from-indigo-500 to-purple-500" },
  ];

  return (
    // --- UPDATE: Changed background to match the site's dark theme ---
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- UPDATE: Used whileInView for self-contained scroll animations --- */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {/* --- UPDATE: Made title consistent with brand name and theme --- */}
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Why Choose ZapKart</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We provide the best shopping experience with our premium features and dedicated customer service.
          </p>
        </Motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Motion.div
              key={index}
              // --- UPDATE: Used whileInView for self-contained scroll animations ---
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              // --- UPDATE: Updated styling to match the dark theme ---
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-blue-500/30 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 text-center group"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.label}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;