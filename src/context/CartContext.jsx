// context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNotification } from "./NotificationContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// Helper function to safely get data from localStorage
const getStorageItem = (key, defaultValue) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

// Helper function to safely set data in localStorage
const setStorageItem = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

export const CartProvider = ({ children }) => {
  // --- NEW: Initialize state from localStorage on first render ---
  const [cart, setCart] = useState(() => getStorageItem('zapkart-cart', []));
  const [favorites, setFavorites] = useState(() => getStorageItem('zapkart-favorites', []));
  const [cartOpen, setCartOpen] = useState(false);
  const { triggerNotification } = useNotification();

  // --- UPDATE: Made product name handling more robust ---
  const getProductName = (product) => product.name || product.title || "Product";

  // --- NEW: Sync cart state to localStorage whenever it changes ---
  useEffect(() => {
    setStorageItem('zapkart-cart', cart);
  }, [cart]);

  // --- NEW: Sync favorites state to localStorage whenever it changes ---
  useEffect(() => {
    setStorageItem('zapkart-favorites', favorites);
  }, [favorites]);

  const addToCart = (product) => {
    setCart(currentCart => {
      const exists = currentCart.find(item => item.id === product.id);
      if (exists) {
        const updatedCart = currentCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        triggerNotification("success", `Quantity updated for "${getProductName(product)}"`);
        return updatedCart;
      } else {
        triggerNotification("success", `"${getProductName(product)}" added to cart`);
        return [...currentCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart(currentCart => {
      const product = currentCart.find(item => item.id === id);
      const updatedCart = currentCart.filter(item => item.id !== id);
      triggerNotification("success", `"${getProductName(product)}" removed from cart`);
      return updatedCart;
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(currentCart => 
      currentCart.map(item => item.id === id ? { ...item, quantity } : item)
    );
  };

  const addToFavorites = (product) => {
    setFavorites(currentFavorites => {
      const exists = currentFavorites.find(item => item.id === product.id);
      if (exists) {
        triggerNotification("error", `"${getProductName(product)}" removed from favorites`);
        return currentFavorites.filter(item => item.id !== product.id);
      } else {
        triggerNotification("success", `"${getProductName(product)}" added to favorites`);
        return [...currentFavorites, product];
      }
    });
  };

  const isFavorite = (id) => favorites.some(item => item.id === id);

  const clearCart = () => {
    setCart([]);
    triggerNotification("success", "Cart cleared successfully");
  };

  // --- UPDATE: Removed debug log and replaced with a development-only check ---
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Cart Updated:", cart);
    }
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
      addToFavorites,
      isFavorite,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};