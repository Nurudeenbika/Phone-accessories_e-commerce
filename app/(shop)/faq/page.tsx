"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/layout/common/Breadcrumb";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { motion } from "framer-motion";

export default function FAQPage(): React.ReactElement {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const toggleExpanded = (index: number) => {
    setExpandedItem((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for all products in original condition. Items must be unused and in their original packaging with all accessories included. Contact our customer service team to initiate a return.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 3-5 business days within Lagos and 5-7 business days to other states. Express shipping is available for 1-2 business days within Lagos. You'll receive a tracking number once your order ships.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Currently, we only ship within Nigeria. We're working on expanding our shipping options to other African countries in the near future. Stay tuned for updates!",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express), bank transfers, and popular mobile payment methods like Paystack, Flutterwave, and direct bank deposits.",
    },
    {
      question: "Are your products authentic?",
      answer:
        "Absolutely! All our products are 100% authentic and sourced directly from authorized distributors and manufacturers. We provide warranty certificates and authenticity guarantees with every purchase.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is shipped, you'll receive an email with a tracking number. You can also track your order by logging into your account and visiting the 'My Orders' section.",
    },
    {
      question: "Do you offer product warranties?",
      answer:
        "Yes! Most products come with manufacturer warranties ranging from 1-2 years. Extended warranty options are available for select items. All warranty information is provided with your purchase.",
    },
    {
      question: "Can I cancel my order?",
      answer:
        "Orders can be cancelled within 2 hours of placement if they haven't been processed yet. For orders already in processing, please contact our customer service team immediately.",
    },
    {
      question: "What if my product arrives damaged?",
      answer:
        "We're sorry to hear that! Please contact us within 48 hours of delivery with photos of the damage. We'll arrange for a replacement or full refund at no cost to you.",
    },
    {
      question: "Do you have a customer support team?",
      answer:
        "Yes! Our customer support team is available 24/7 via live chat, email, and phone. You can reach us at support@jespogadgets.com or call +234-XXX-XXXX-XXX.",
    },
    {
      question: "Can I get a discount on bulk orders?",
      answer:
        "Yes! We offer special pricing for bulk orders and corporate customers. Contact our sales team at sales@jespogadgets.com with your requirements for a custom quote.",
    },
    {
      question: "How do I create an account?",
      answer:
        "Creating an account is easy! Click the 'Register' button in the top navigation, fill in your details, and verify your email address. You'll then have access to order tracking, wishlist, and faster checkout.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumb />

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find answers to common questions about our products, shipping,
          returns, and more.
        </p>
      </div>

      {/* Search Box */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <input
            type="text"
            placeholder="Search FAQs..."
            className="w-full px-6 py-4 border border-gray-200 focus:ring-0 focus:border-primary-700 focus:outline-none"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <span className="text-gray-400">🔍</span>
          </div>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white border border-gray-200 p-4 text-center hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <div className="text-2xl mb-2">📦</div>
            <div className="font-medium text-gray-900">Shipping</div>
          </button>
          <button className="bg-white border border-gray-200 p-4 text-center hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <div className="text-2xl mb-2">💳</div>
            <div className="font-medium text-gray-900">Payment</div>
          </button>
          <button className="bg-white border border-gray-200 p-4 text-center hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <div className="text-2xl mb-2">↩️</div>
            <div className="font-medium text-gray-900">Returns</div>
          </button>
          <button className="bg-white border border-gray-200 p-4 text-center hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <div className="text-2xl mb-2">🛡️</div>
            <div className="font-medium text-gray-900">Warranty</div>
          </button>
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white border border-gray-200">
            <button
              onClick={() => toggleExpanded(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900 pr-4">
                {faq.question}
              </h3>
              <div className="flex-shrink-0">
                {expandedItem === index ? (
                  <MdExpandLess className="w-6 h-6 text-primary-600" />
                ) : (
                  <MdExpandMore className="w-6 h-6 text-gray-600" />
                )}
              </div>
            </button>

            <motion.div
              initial={false}
              animate={{
                height: expandedItem === index ? "auto" : 0,
                opacity: expandedItem === index ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-4">
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="mt-16 bg-primary-50 p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Still Have Questions?
        </h2>
        <p className="text-gray-600 mb-6">
          Can't find the answer you're looking for? Our customer support team is
          here to help!
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/contact"
            className="bg-primary-600 text-white px-6 py-3 font-medium hover:bg-primary-700 transition-colors"
          >
            Contact Support
          </a>
          <a
            href="tel:+234-XXX-XXXX-XXX"
            className="bg-white text-primary-600 px-6 py-3 font-medium hover:bg-gray-50 transition-colors border border-primary-600"
          >
            Call Us Now
          </a>
        </div>
      </div>
    </div>
  );
}
