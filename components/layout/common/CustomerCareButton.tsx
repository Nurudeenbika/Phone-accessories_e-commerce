"use client";

import React, { useState } from "react";
import {
  MdOutlineSupport,
  MdOutlineClose,
  MdOutlinePhone,
  MdOutlineEmail,
  MdOutlineChat,
} from "react-icons/md";

export default function CustomerCareButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handlePhoneCall = () => {
    window.location.href = "tel:+1234567890";
  };

  const handleEmail = () => {
    window.location.href = "mailto:support@jespogadgets.com";
  };

  const handleChat = () => {
    // Add chat functionality here
    alert("Chat feature coming soon!");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
          isOpen
            ? "bg-red-500 hover:bg-red-600 rotate-45"
            : "bg-primary-700 hover:bg-primary-800 hover:scale-110"
        }`}
      >
        {isOpen ? (
          <MdOutlineClose className="w-6 h-6 text-white" />
        ) : (
          <MdOutlineSupport className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Support Options */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3">
          {/* Phone Support */}
          <button
            onClick={handlePhoneCall}
            className="flex items-center gap-3 bg-white rounded-lg shadow-lg p-3 hover:shadow-xl transition-all duration-200 hover:scale-105"
            title="Call Support"
          >
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <MdOutlinePhone className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">Call Us</div>
              <div className="text-xs text-gray-500">+1 (234) 567-890</div>
            </div>
          </button>

          {/* Email Support */}
          <button
            onClick={handleEmail}
            className="flex items-center gap-3 bg-white rounded-lg shadow-lg p-3 hover:shadow-xl transition-all duration-200 hover:scale-105"
            title="Email Support"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <MdOutlineEmail className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">Email Us</div>
              <div className="text-xs text-gray-500">
                support@jespogadgets.com
              </div>
            </div>
          </button>

          {/* Live Chat */}
          <button
            onClick={handleChat}
            className="flex items-center gap-3 bg-white rounded-lg shadow-lg p-3 hover:shadow-xl transition-all duration-200 hover:scale-105"
            title="Live Chat"
          >
            <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center">
              <MdOutlineChat className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">Live Chat</div>
              <div className="text-xs text-gray-500">Chat with support</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
