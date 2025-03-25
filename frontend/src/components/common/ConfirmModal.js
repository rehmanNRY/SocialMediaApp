// components/common/ConfirmModal.js
"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiAlertTriangle, FiInfo, FiAlertCircle } from "react-icons/fi";
import ModalPortal from "./ModalPortal";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger", // danger, warning, info
}) => {
  if (!isOpen) return null;

  const getIconAndColors = () => {
    switch (type) {
      case "danger":
        return {
          icon: <FiAlertCircle className="w-5 h-5" />,
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          button: "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500",
          accent: "border-red-100"
        };
      case "warning":
        return {
          icon: <FiAlertTriangle className="w-5 h-5" />,
          iconBg: "bg-amber-100",
          iconColor: "text-amber-600",
          button: "bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500",
          accent: "border-amber-100"
        };
      default:
        return {
          icon: <FiInfo className="w-5 h-5" />,
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500",
          accent: "border-blue-100"
        };
    }
  };

  const { icon, iconBg, iconColor, button, accent } = getIconAndColors();

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 h-screen z-50">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className={`flex justify-between items-center p-6 pb-4 ${accent} border-b`}>
              <div className="flex items-center gap-3">
                <div className={`${iconBg} ${iconColor} p-2 rounded-lg`}>
                  {icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
              >
                <FiX className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Body */}
            <div className="p-6 pt-4">
              <p className="text-gray-600 text-[15px] leading-relaxed">
                {message}
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 pt-4 border-t border-gray-100">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 transition-all"
              >
                {cancelText}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onConfirm}
                className={`px-4 py-2.5 text-sm font-medium text-white ${button} rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all`}
              >
                {confirmText}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </ModalPortal>
  );
};

export default ConfirmModal;