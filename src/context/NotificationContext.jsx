// context/NotificationContext.jsx - REFINED VERSION
import React, { createContext, useContext, useReducer, useRef, useEffect } from "react";

const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

// --- Defined animation timings for easy configuration ---
const ANIMATION_TIMINGS = {
  INITIAL_DELAY: 100,
  EXPAND_DELAY: 300,
  TIMER_START_DELAY: 1000,
  VISIBLE_DURATION: 4000,
  COLLAPSE_DELAY: 300,
};

const initialNotificationState = {
  visible: false,
  expanded: false,
  timerVisible: false,
  type: "success",
  message: null,
};

function notificationReducer(state, action) {
  switch (action.type) {
    case "RESET": return { ...initialNotificationState };
    case "SET": return { 
        ...state, 
        type: action.payload.type, 
        message: action.payload.message || getDefaultMessage(action.payload.type) 
    };
    case "SHOW": return { ...state, visible: true };
    case "EXPAND": return { ...state, expanded: true };
    case "SHOW_TIMER": return { ...state, timerVisible: true };
    case "HIDE_TIMER": return { ...state, timerVisible: false };
    case "COLLAPSE": return { ...state, expanded: false };
    case "HIDE": return { ...state, visible: false };
    default: return state;
  }
}

// Helper function to provide a default message based on type
const getDefaultMessage = (type) => {
  switch (type) {
    case "success": return "Success!";
    case "error": return "An error occurred.";
    case "info": return "Information";
    default: return "Notification";
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialNotificationState);
  const timeouts = useRef([]);

  // Function to clear all stored timeouts to prevent memory leaks
  const clearTimeouts = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };

  // This effect runs once on mount to clean up any timeouts on unmount
  useEffect(() => {
    return () => clearTimeouts();
  }, []);

  const triggerNotification = async (type = "success", message = null) => {
    // Clear any existing notification sequence
    clearTimeouts();
    
    // Reset state and set new notification details
    dispatch({ type: "RESET" });
    dispatch({ type: "SET", payload: { type, message } });

    // --- ANIMATION SEQUENCE ---
    // 1. Show the initial icon
    await new Promise(r => timeouts.current.push(setTimeout(r, ANIMATION_TIMINGS.INITIAL_DELAY)));
    dispatch({ type: "SHOW" });
    
    // 2. Expand to show the full message
    await new Promise(r => timeouts.current.push(setTimeout(r, ANIMATION_TIMINGS.EXPAND_DELAY)));
    dispatch({ type: "EXPAND" });
    
    // 3. Start the progress timer
    await new Promise(r => timeouts.current.push(setTimeout(r, ANIMATION_TIMINGS.TIMER_START_DELAY)));
    dispatch({ type: "SHOW_TIMER" });
    
    // 4. After the visible duration, collapse and hide
    await new Promise(r => timeouts.current.push(setTimeout(r, ANIMATION_TIMINGS.VISIBLE_DURATION)));
    dispatch({ type: "HIDE_TIMER" });
    dispatch({ type: "COLLAPSE" });
    
    // 5. Finally, hide the notification completely
    await new Promise(r => timeouts.current.push(setTimeout(r, ANIMATION_TIMINGS.COLLAPSE_DELAY)));
    dispatch({ type: "HIDE" });
  };

  const dismissNotification = () => {
    // Clear any pending animations
    clearTimeouts();
    
    // Immediately collapse and hide the notification
    dispatch({ type: "HIDE_TIMER" });
    dispatch({ type: "COLLAPSE" });
    
    // Use a minimal timeout to allow the collapse animation to play
    setTimeout(() => dispatch({ type: "HIDE" }), ANIMATION_TIMINGS.COLLAPSE_DELAY);
  };

  return (
    <NotificationContext.Provider value={{ state, triggerNotification, dismissNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};