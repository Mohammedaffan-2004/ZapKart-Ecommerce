// components/sections/StatsSection.jsx
import React from "react";
import { motion as Motion  } from "framer-motion";
import { Package, Star, TrendingUp, Users } from "lucide-react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const StatsSection = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  const stats = [
    { icon: Package, label: "Products", value: "10,000+" },
    { icon: Users, label: "Customers", value: "50,000+" },
    { icon: Star, label: "Reviews", value: "4.8/5" },
    { icon: TrendingUp, label: "Growth", value: "25%" },
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-blue-600 to-cyan-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.1%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Motion.div
              key={index}
              ref={index === 0 ? ref : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              {/* Optional Icon */}
              <stat.icon className="mx-auto h-6 w-6 text-white mb-2" />

              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <p className="text-white/80">{stat.label}</p>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
