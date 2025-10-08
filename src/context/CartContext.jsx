// context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react"; // UPDATE: Added useEffect
import { useNotification } from "./NotificationContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const { triggerNotification } = useNotification();

  // --- UPDATE: Made product name handling more robust ---
  const getProductName = (product) => product.name || product.title || "Product";

  const addToCart = (product) => {
    const exists = cart.find(item => item.id === product.id);
    if (exists) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
      triggerNotification("success", `Quantity updated for "${getProductName(product)}"`);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      triggerNotification("success", `"${getProductName(product)}" added to cart`);
    }
  };

  const removeFromCart = (id) => {
    const product = cart.find(item => item.id === id);
    setCart(cart.filter(item => item.id !== id));
    triggerNotification("success", `"${getProductName(product)}" removed from cart`);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item => item.id === id ? { ...item, quantity } : item));
  };

  // --- UPDATE: Renamed to be consistent with other components ---
  const addToFavorites = (product) => {
    const exists = favorites.find(item => item.id === product.id);
    if (exists) {
      setFavorites(favorites.filter(item => item.id !== product.id));
      triggerNotification("error", `"${getProductName(product)}" removed from favorites`);
    } else {
      setFavorites([...favorites, product]);
      triggerNotification("success", `"${getProductName(product)}" added to favorites`);
    }
  };

  const isFavorite = (id) => favorites.some(item => item.id === id);

  const clearCart = () => {
    setCart([]);
    triggerNotification("success", "Cart cleared successfully");
  };

  // --- UPDATE: Added a debug log to see the cart state in real-time ---
  // You can remove this in production
  useEffect(() => {
    console.log("Cart Updated:", cart);
  }, [cart]);

  return (
    <CartContext.Provider value={{ 
      cart, 
      favorites, 
      cartOpen,
      setCartOpen,
      addToCart, 
      removeFromCart, 
      updateQuantity,
      addToFavorites, // UPDATE: Consistent naming
      isFavorite,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};