import React, { createContext, useContext, useReducer, useRef, useEffect } from "react";

const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

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
    case "SET": return { ...state, type: action.payload.type, message: action.payload.message };
    case "SHOW": return { ...state, visible: true };
    case "EXPAND": return { ...state, expanded: true };
    case "SHOW_TIMER": return { ...state, timerVisible: true };
    case "HIDE_TIMER": return { ...state, timerVisible: false };
    case "COLLAPSE": return { ...state, expanded: false };
    case "HIDE": return { ...state, visible: false };
    default: return state;
  }
}

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialNotificationState);
  const timeouts = useRef([]);

  const clearTimeouts = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };

  useEffect(() => clearTimeouts, []);

  const triggerNotification = async (type = "success", message = null) => {
    clearTimeouts();
    dispatch({ type: "RESET" });
    dispatch({ type: "SET", payload: { type, message } });

    await new Promise(r => timeouts.current.push(setTimeout(r, 100)));
    dispatch({ type: "SHOW" });
    
    await new Promise(r => timeouts.current.push(setTimeout(r, 300)));
    dispatch({ type: "EXPAND" });
    
    await new Promise(r => timeouts.current.push(setTimeout(r, 1000)));
    dispatch({ type: "SHOW_TIMER" });
    
    await new Promise(r => timeouts.current.push(setTimeout(r, 4000)));
    dispatch({ type: "HIDE_TIMER" });
    dispatch({ type: "COLLAPSE" });
    
    await new Promise(r => timeouts.current.push(setTimeout(r, 300)));
    dispatch({ type: "HIDE" });
  };

  const dismissNotification = () => {
    clearTimeouts();
    dispatch({ type: "HIDE_TIMER" });
    dispatch({ type: "COLLAPSE" });
    setTimeout(() => dispatch({ type: "HIDE" }), 300);
  };

  return (
    <NotificationContext.Provider value={{ state, triggerNotification, dismissNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};