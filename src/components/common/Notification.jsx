// components/common/Notification.jsx - REDESIGNED VERSION
import React from "react";
import { useNotification } from "../../context/NotificationContext";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Notification = () => {
  const { state, dismissNotification } = useNotification();
  const { type, visible, expanded, timerVisible, message } = state;

  const config = {
    success: {
      icon: CheckCircle2,
      color: "from-green-500 to-emerald-600",
      glowColor: "shadow-green-500/25",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
    error: {
      icon: AlertCircle,
      color: "from-red-500 to-pink-600",
      glowColor: "shadow-red-500/25",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
    },
    info: {
      icon: Info,
      color: "from-blue-500 to-cyan-600",
      glowColor: "shadow-blue-500/25",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
  };

  const { icon: Icon, color, glowColor, bgColor, borderColor } = config[type] || config.info;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: 400, opacity: 0, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 400, opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", damping: 25, stiffness: 400 }}
          className="fixed top-18 right-6 z-[60]"
        >
          <motion.div
            initial={{ width: 64, height: 64 }}
            animate={expanded ? { width: 320, height: "auto" } : { width: 64, height: 64 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
            style={{ boxShadow: `0 10px 40px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)` }}
          >
            {expanded ? (
              <div className="p-4 relative">
                <button
                  onClick={dismissNotification}
                  className="absolute top-3 right-3 p-1 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-start space-x-3">
                  <div className={`bg-gradient-to-r ${color} rounded-xl p-2 flex-shrink-0`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="font-medium text-white text-sm">
                      {message || (type === "success" ? "Success!" : type === "error" ? "Error!" : "Information")}
                    </p>
                  </div>
                </div>
                {timerVisible && (
                  <motion.div
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${color} rounded-b-xl`}
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 4, ease: "linear" }}
                  />
                )}
              </div>
            ) : (
              <div className="w-16 h-16 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
                  className={`bg-gradient-to-r ${color} rounded-xl p-3 shadow-lg ${glowColor}`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </motion.div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;