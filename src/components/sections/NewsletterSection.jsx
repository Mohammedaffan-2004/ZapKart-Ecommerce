// components/sections/NewsletterSection.jsx
import React, { useState } from "react";
import {motion as Motion } from "framer-motion";
import { Mail, Send, CheckCircle } from "lucide-react";

const NewsletterSection = () => {
  // --- UPDATE: Added state for form functionality ---
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // --- UPDATE: Added a handler for form submission ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Here you would typically send the email to your backend API
    // e.g., fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
    console.log("Subscribing email:", email);
    
    // Show success message
    setIsSubscribed(true);
  };

  return (
    // --- UPDATE: Changed background to be more integrated with the dark theme ---
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-900"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl opacity-10 translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* --- UPDATE: Used whileInView for self-contained scroll animations --- */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mb-6 shadow-lg shadow-blue-500/25">
            <Mail className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Stay in the Loop</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to the ZapKart newsletter for exclusive offers, new product alerts, and a 10% discount on your first order.
          </p>
          
          {/* --- UPDATE: Added conditional rendering for the form and success message --- */}
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-6 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 border border-white/20"
              />
              <Motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center"
              >
                <Send className="h-5 w-5 mr-2" />
                Subscribe
              </Motion.button>
            </form>
          ) : (
            <Motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto p-6 bg-green-500/10 border border-green-500/30 rounded-2xl"
            >
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
              <p className="text-gray-300">Thank you for subscribing. Check your email for your discount code.</p>
            </Motion.div>
          )}
          
          {!isSubscribed && (
            <p className="text-sm text-gray-400 mt-4">
              Join 50,000+ subscribers. No spam, unsubscribe anytime.
            </p>
          )}
        </Motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;