"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdClose,
  MdCheckCircle,
  MdCreditCard,
  MdSecurity,
} from "react-icons/md";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  paymentMethod: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  paymentMethod,
}: PaymentModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg p-6 w-full max-w-md"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Payment Processing
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>

          {/* Payment Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MdCreditCard className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-medium text-gray-900 capitalize">
                  {paymentMethod}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MdSecurity className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-bold text-lg text-gray-900">
                  ₦{amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Processing Animation */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"
              />
            </div>
            <p className="text-gray-600">Processing your payment...</p>
            <p className="text-sm text-gray-500 mt-1">
              Please do not close this window
            </p>
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <MdCheckCircle className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-800">
                Your payment is secured with 256-bit SSL encryption
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
