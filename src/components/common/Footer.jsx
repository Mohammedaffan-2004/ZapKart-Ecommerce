// components/common/Footer.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowUp, Sparkles, Send, ChevronRight,Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "../../context/NotificationContext";

// Extracted reusable components
const Logo = () => (
  <div className="flex items-center space-x-3">
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur-lg opacity-70"></div>
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-xl">
        <Zap className="h-7 w-7 text-white" />
      </div>
    </div>
    <div>
      <span className="text-2xl font-bold text-white">ZapKart</span>
      <p className="text-xs text-gray-400">Premium Shopping Experience</p>
    </div>
  </div>
);

const SocialLinks = () => {
  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
    { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
    { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
    { icon: Youtube, label: "Youtube", href: "https://youtube.com" },
  ];

  return (
    <div className="flex space-x-4">
      {socialLinks.map((social) => (
        <motion.a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 border border-white/10"
          aria-label={`Visit our ${social.label} page`}
        >
          <social.icon className="h-5 w-5" />
        </motion.a>
      ))}
    </div>
  );
};

const FooterLinks = ({ title, links }) => (
  <div>
    <motion.h3 
      className="text-xl font-bold text-white mb-6 flex items-center"
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 mr-3"></div>
      {title}
    </motion.h3>
    <motion.ul 
      className="space-y-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {links.map((item) => (
        <li key={item.label}>
          <Link 
            to={item.path} 
            className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group"
          >
            <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">{item.label}</span>
          </Link>
        </li>
      ))}
    </motion.ul>
  </div>
);

const ContactInfo = ({ icon, title, detail }) => (
  <div className="flex items-center space-x-4">
    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h4 className="font-semibold text-white mb-1">{title}</h4>
      <p className="text-gray-300 text-sm">{detail}</p>
    </div>
  </div>
);

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { triggerNotification } = useNotification();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    triggerNotification("success", `Thank you for subscribing with ${email}!`);
    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <motion.form 
      onSubmit={handleSubscribe}
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center mb-4">
        <Sparkles className="h-5 w-5 text-blue-400 mr-2" />
        <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center disabled:opacity-70"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Subscribe
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
};

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const FloatingElements = () => (
  <>
    <motion.div
      animate={{ y: [0, -20, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-20 left-10 w-32 h-32 opacity-10"
    >
      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-2xl"></div>
    </motion.div>

    <motion.div
      animate={{ y: [0, 20, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="absolute bottom-20 right-10 w-40 h-40 opacity-10"
    >
      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl"></div>
    </motion.div>
  </>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { label: "About Us", path: "/about" },
    { label: "Shop", path: "/shop" },
    { label: "Categories", path: "/categories" },
    { label: "Deals", path: "/deals" },
    { label: "Blog", path: "/blog" },
  ];
  
  const customerServiceLinks = [
    { label: "Help Center", path: "/help" },
    { label: "Track Order", path: "/track-order" },
    { label: "Returns", path: "/returns" },
    { label: "Shipping Info", path: "/shipping" },
    { label: "Contact Us", path: "/contact" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white pt-20 pb-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')] bg-cover bg-center opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
      </div>
      
      {/* Floating Elements */}
      <FloatingElements />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Logo />
            </motion.div>
            
            <motion.p 
              className="text-gray-300 mb-8 max-w-md leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Discover a world of premium products with exclusive deals, 
              secure shopping, and exceptional customer service. 
              Your journey to quality starts here.
            </motion.p>
            
            {/* Newsletter */}
            <NewsletterForm />
            
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <SocialLinks />
            </motion.div>
          </div>
          
          {/* Quick Links */}
          <FooterLinks title="Quick Links" links={quickLinks} />
          
          {/* Customer Service */}
          <FooterLinks title="Customer Service" links={customerServiceLinks} />
        </div>
        
        {/* Contact Info */}
        <motion.div 
          className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-3xl p-8 mb-16 border border-white/10 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ContactInfo 
              icon={<MapPin className="h-6 w-6 text-white" />}
              title="Visit Us"
              detail="123 Premium Street, NY 10001"
            />
            <ContactInfo 
              icon={<Mail className="h-6 w-6 text-white" />}
              title="Email Us"
              detail="support@zapkart.com"
            />
            <ContactInfo 
              icon={<Phone className="h-6 w-6 text-white" />}
              title="Call Us"
              detail="+1 (555) 123-4567"
            />
          </div>
        </motion.div>
        
        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-gray-400 mb-4 md:mb-0">
            &copy; {currentYear} ZapKart. All rights reserved. Made with ❤️ for premium shopping
          </p>
          
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
            <ScrollToTop />
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;