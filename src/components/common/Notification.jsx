import React from "react";
import { useNotification } from "../../context/NotificationContext";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { motion as Motion , AnimatePresence } from "framer-motion";

const Notification = () => {
  const { state, dismissNotification } = useNotification();
  const { type, visible, expanded, timerVisible, message } = state;

  const config = {
    success: {
      icon: CheckCircle2,
      color: "bg-green-500",
      textColor: "text-green-800",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    error: {
      icon: AlertCircle,
      color: "bg-red-500",
      textColor: "text-red-800",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  };

  const { icon: Icon, color, textColor, bgColor, borderColor } = config[type];

  return (
    <AnimatePresence>
      {visible && (
        <Motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-6 right-6 z-[60]"
        >
          <Motion.div
            initial={{ width: 64, height: 64 }}
            animate={expanded ? { width: 320, height: "auto" } : { width: 64, height: 64 }}
            transition={{ duration: 0.3 }}
            className={`${expanded ? bgColor : 'bg-white'} rounded-xl shadow-2xl overflow-hidden border ${expanded ? borderColor : 'border-gray-200'}`}
          >
            {expanded ? (
              <div className="p-4 relative">
                <button
                  onClick={dismissNotification}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-start space-x-3">
                  <div className={`${color} rounded-full p-1.5 flex-shrink-0`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className={`font-medium text-sm ${textColor}`}>
                      {message || (type === "success" ? "Success!" : "Error!")}
                    </p>
                  </div>
                </div>
                {timerVisible && (
                  <Motion.div
                    className={`absolute bottom-0 left-0 h-1 ${color} rounded-b-xl`}
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 4, ease: "linear" }}
                  />
                )}
              </div>
            ) : (
              <div className="w-16 h-16 flex items-center justify-center">
                <Motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className={`${color} rounded-full p-2`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </Motion.div>
              </div>
            )}
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;