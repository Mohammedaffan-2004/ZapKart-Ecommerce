// components/cart/CartDrawer.jsx
import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, X, Trash2, ArrowRight, Plus, Minus } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";

/**
 * Converts a price from USD to INR.
 * @param {number} usd - The price in USD.
 * @returns {number} The price in INR.
 */
const usdToInr = (usd) => {
  // Ensure the input is a valid number
  if (typeof usd !== 'number' || isNaN(usd)) return 0;
  const conversionRate = 83; // Example conversion rate
  return Math.round(usd * conversionRate);
};

/**
 * Calculates the subtotal, tax, and total for the cart.
 * @param {Array} cartItems - The array of items in the cart.
 * @returns {object} An object containing subtotal, tax, and total.
 */
const calculateTotal = (cartItems) => {
  // Ensure cartItems is an array
  if (!Array.isArray(cartItems)) return { subtotal: 0, tax: 0, total: 0 };
  
  const subtotal = cartItems.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : 0;
    const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
    return sum + (price * quantity);
  }, 0);
  
  const taxRate = 0.18; // 18% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  return { subtotal, tax, total };
};

const CartDrawer = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, isCartOpen, setCartOpen } = useCart();
  
  // Memoize the calculated totals to prevent unnecessary recalculations
  const { subtotal, tax, total } = useMemo(() => calculateTotal(cart), [cart]);
  
  // Memoize the total items count
  const totalItems = useMemo(() => 
    cart.reduce((sum, item) => sum + (typeof item.quantity === 'number' ? item.quantity : 0), 0), 
    [cart]
  );

  // Memoize the checkout handler
  const handleCheckout = useCallback(() => {
    setCartOpen(false);
    navigate('/checkout');
  }, [navigate, setCartOpen]);

  // Memoize the clear cart handler with confirmation
  const handleClearCart = useCallback(() => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  }, [clearCart]);

  // Memoize the quantity update handlers
  const handleDecreaseQuantity = useCallback((id, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(id, currentQuantity - 1);
    }
  }, [updateQuantity]);

  const handleIncreaseQuantity = useCallback((id, currentQuantity) => {
    updateQuantity(id, currentQuantity + 1);
  }, [updateQuantity]);

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
            aria-label="Cart overlay"
          />
          <Motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-slate-900/95 backdrop-blur-xl z-50 shadow-2xl border-l border-white/10 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-heading"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 id="cart-heading" className="text-2xl font-bold text-white flex items-center">
                  <ShoppingCart className="h-6 w-6 mr-3 text-blue-400" />
                  Shopping Cart
                </h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  aria-label="Close cart"
                >
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
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
                        <img
                          src={item.image || 'https://picsum.photos/seed/product/200/200.jpg'}
                          alt={item.name || 'Product'}
                          className="w-20 h-20 object-contain rounded-lg bg-gray-800"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-white text-sm mb-1 truncate">{item.name || 'Product'}</h3>
                          <p className="text-xs text-gray-400 mb-2">{item.category || 'Product'}</p>
                          <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                            ₹{usdToInr(item.price).toLocaleString('en-IN')}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                                className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50"
                                disabled={item.quantity <= 1}
                                aria-label={`Decrease quantity of ${item.name}`}
                              >
                                <Minus className="h-3 w-3 text-gray-300" />
                              </button>
                              <span className="w-8 text-center font-medium text-white">{item.quantity}</span>
                              <button
                                onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                                className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                                aria-label={`Increase quantity of ${item.name}`}
                              >
                                <Plus className="h-3 w-3 text-gray-300" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-400 hover:text-red-300 p-1 transition-colors"
                              aria-label={`Remove ${item.name} from cart`}
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
                  onClick={handleClearCart}
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