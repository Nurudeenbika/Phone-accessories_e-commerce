"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdWarning, MdClose } from "react-icons/md";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  isLoading?: boolean;
  children?: React.ReactNode;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  isLoading = false,
  children,
}: ConfirmModalProps): React.ReactElement {
  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          iconColor: "text-red-600",
          iconBg: "bg-red-100",
          buttonBg: "bg-red-600 hover:bg-red-700",
          buttonFocus: "focus:ring-red-500",
        };
      case "warning":
        return {
          iconColor: "text-yellow-600",
          iconBg: "bg-yellow-100",
          buttonBg: "bg-yellow-600 hover:bg-yellow-700",
          buttonFocus: "focus:ring-yellow-500",
        };
      case "info":
        return {
          iconColor: "text-blue-600",
          iconBg: "bg-blue-100",
          buttonBg: "bg-blue-600 hover:bg-blue-700",
          buttonFocus: "focus:ring-blue-500",
        };
      default:
        return {
          iconColor: "text-red-600",
          iconBg: "bg-red-100",
          buttonBg: "bg-red-600 hover:bg-red-700",
          buttonFocus: "focus:ring-red-500",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 ${styles.iconBg} rounded-full flex items-center justify-center`}
                  >
                    <MdWarning className={`w-5 h-5 ${styles.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  <MdClose className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed">{message}</p>
                {children}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 p-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`px-4 py-2 text-sm font-medium text-white ${styles.buttonBg} ${styles.buttonFocus} focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
