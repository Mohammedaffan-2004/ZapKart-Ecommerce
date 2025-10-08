// components/cart/CartDrawer.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // UPDATE: Imported useNavigate
import { ShoppingCart, X, Trash2, ArrowRight, Plus, Minus } from "lucide-react";
import { motion as Motion , AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";

// --- UPDATE: Moved helper functions into the component to remove external dependency ---
// This makes the component self-contained and prevents errors from missing files.

/**
 * Converts a price from USD to INR.
 * @param {number} usd - The price in USD.
 * @returns {number} The price in INR.
 */
const usdToInr = (usd) => {
  const conversionRate = 83; // Example conversion rate
  return usd * conversionRate;
};

/**
 * Calculates the subtotal, tax, and total for the cart.
 * @param {Array} cartItems - The array of items in the cart.
 * @returns {object} An object containing subtotal, tax, and total.
 */
const calculateTotal = (cartItems) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.18; // 18% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  return { subtotal, tax, total };
};


const CartDrawer = () => {
  const navigate = useNavigate(); // UPDATE: Hook for navigation
  const { cart, removeFromCart, updateQuantity, clearCart, isCartOpen, setCartOpen } = useCart();
  
  // --- UPDATE: Using the helper functions defined above ---
  const { subtotal, tax, total } = calculateTotal(cart);

  const handleCheckout = () => {
    // In a real app, you might navigate to a checkout page
    // For now, we'll just close the cart and show an alert.
    setCartOpen(false);
    navigate('/checkout'); // UPDATE: Navigate to the checkout page
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          <Motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-slate-900/95 backdrop-blur-xl z-50 shadow-2xl border-l border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <ShoppingCart className="h-6 w-6 mr-3 text-blue-400" />
                  Shopping Cart
                </h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items
              </p>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ShoppingCart className="h-16 w-16 mb-4 text-gray-500" />
                  <p className="text-lg font-medium">Your cart is empty</p>
                  <p className="text-sm mt-2">Add some products to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <Motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                    >
                      <div className="flex gap-4">
                        {/* --- UPDATE: Changed `thumbnail` to `image` for consistency --- */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-contain rounded-lg bg-gray-800"
                        />
                        <div className="flex-1">
                          {/* --- UPDATE: Changed `title` to `name` for consistency --- */}
                          <h3 className="font-medium text-white text-sm line-clamp-2 mb-1">{item.name}</h3>
                          <p className="text-xs text-gray-400 mb-2">{item.category || 'Product'}</p>
                          <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                            ₹{usdToInr(item.price).toLocaleString('en-IN')}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3 text-gray-300" />
                              </button>
                              <span className="w-8 text-center font-medium text-white">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                              >
                                <Plus className="h-3 w-3 text-gray-300" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-400 hover:text-red-300 p-1 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-white/10 p-6 bg-slate-800/50">
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
                <button
                  onClick={clearCart}
                  className="w-full mt-2 text-sm text-gray-400 hover:text-red-400 py-2 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;