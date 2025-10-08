// pages/CartPage.jsx
import React from "react";
import {motion as Motion  } from "framer-motion";
import { useNavigate } from "react-router-dom"; // UPDATE: Imported useNavigate
import { ShoppingCart, ArrowLeft, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

// --- UPDATE: Moved helper functions here to make the component self-contained ---
const usdToInr = (usd) => Math.round(usd * 83);
const calculateTotal = (cartItems) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.18; // 18% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  return { subtotal, tax, total };
};

const CartPage = () => {
  const navigate = useNavigate(); // UPDATE: Hook for navigation
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { subtotal, tax, total } = calculateTotal(cart);

  const handleCheckout = () => {
    // In a real app, you would navigate to a checkout page
    navigate('/checkout');
  };

  return (
    // --- UPDATE: Changed background to match the site's dark theme ---
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 py-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- UPDATE: Used whileInView for self-contained scroll animations --- */}
        <Motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center"
        >
          <Link to="/" className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold text-white flex items-center">
            <ShoppingCart className="h-8 w-8 mr-3 text-blue-400" />
            Shopping Cart
          </h1>
        </Motion.div>

        {cart.length === 0 ? (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Your cart is empty</h3>
            <p className="text-gray-400 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Continue Shopping
            </Link>
          </Motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-400 hover:text-red-300 flex items-center transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <Motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      {/* --- UPDATE: Standardized image property --- */}
                      <img
                        src={item.image || item.thumbnail}
                        alt={item.name || item.title}
                        className="w-24 h-24 object-contain rounded-md bg-gray-800"
                      />
                      <div className="flex-1">
                        {/* --- UPDATE: Standardized name property --- */}
                        <h3 className="font-medium text-white mb-1">{item.name || item.title}</h3>
                        <p className="text-sm text-gray-400 mb-2">{item.category || 'Product'}</p>
                        <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                          ₹{usdToInr(item.price).toLocaleString('en-IN')}
                        </p>
                        <div className="flex items-center mt-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Minus className="h-4 w-4 text-gray-300" />
                          </button>
                          <span className="w-10 text-center font-medium text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Plus className="h-4 w-4 text-gray-300" />
                          </button>
                          <div className="ml-auto font-semibold text-white">
                            ₹{usdToInr(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-4 text-red-400 hover:text-red-300 p-1 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </Motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 sticky top-24"
              >
                <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-medium text-white">₹{usdToInr(subtotal).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax (18%)</span>
                    <span className="font-medium text-white">₹{usdToInr(tax).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-white/10">
                    <span className="text-white">Total</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                      ₹{usdToInr(total).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* --- UPDATE: Connected the checkout button to navigation --- */}
                <Motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-5 w-5" />
                </Motion.button>

                <Link
                  to="/"
                  className="block w-full mt-3 text-center text-sm text-blue-400 hover:text-blue-300 py-2 transition-colors"
                >
                  Continue Shopping
                </Link>
              </Motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;