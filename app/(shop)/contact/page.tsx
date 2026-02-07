"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/layout/common/Breadcrumb";
import { MdLocationOn, MdPhone, MdEmail, MdAccessTime } from "react-icons/md";
import { toast } from "react-hot-toast";

export default function ContactPage(): React.ReactElement {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumb />

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Get in touch with us. We're here to help and answer any questions you
          might have.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-8">
              We'd love to hear from you. Send us a message and we'll respond as
              soon as possible.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MdLocationOn className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Our Office
                  </h3>
                  <p className="text-gray-600">
                    123 Victoria Island
                    <br />
                    Lagos, Nigeria 101241
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MdPhone className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Phone
                  </h3>
                  <p className="text-gray-600">
                    <a
                      href="tel:+234-XXX-XXXX-XXX"
                      className="hover:text-primary-600 transition-colors"
                    >
                      +234-XXX-XXXX-XXX
                    </a>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Mon-Fri 9AM-6PM</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MdEmail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Email
                  </h3>
                  <p className="text-gray-600">
                    <a
                      href="mailto:support@jespogadgets.com"
                      className="hover:text-primary-600 transition-colors"
                    >
                      support@jespogadgets.com
                    </a>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MdAccessTime className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Business Hours
                  </h3>
                  <div className="text-gray-600 space-y-1">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Follow Us
            </h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <span className="text-sm font-bold">f</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <span className="text-sm font-bold">X</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <span className="text-sm font-bold">in</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <span className="text-sm font-bold">📱</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Send us a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-0 focus:border-primary-700 focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-0 focus:border-primary-700 focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 focus:ring-0 focus:border-primary-700 focus:outline-none"
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="order">Order Issue</option>
                <option value="return">Return/Exchange</option>
                <option value="business">Business Inquiry</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 focus:ring-0 focus:border-primary-700 focus:outline-none resize-none"
                placeholder="Tell us how we can help you..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-4 px-6 font-medium hover:bg-primary-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Find Us
        </h2>
        <div className="w-full h-96 border border-gray-200 overflow-hidden">
          <iframe
            title="123 Victoria Island, Lagos, Nigeria"
            src="https://www.google.com/maps?q=123%20Victoria%20Island%2C%20Lagos%2C%20Nigeria&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        {/* Get Directions */}
        <div className="mt-4 text-center">
          <a
            href="https://www.google.com/maps/search/?api=1&query=123+Victoria+Island+Lagos+Nigeria"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary-600 font-medium hover:underline"
          >
            Get Directions →
          </a>
        </div>
      </div>

      {/* FAQ Link */}
      <div className="mt-16 bg-primary-50 p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Help</h2>
        <p className="text-gray-600 mb-6">
          Looking for quick answers? Check out our FAQ section for common
          questions and solutions.
        </p>
        <a
          href="/faq"
          className="bg-primary-600 text-white px-8 py-3 font-medium hover:bg-primary-700 transition-colors"
        >
          Visit FAQ
        </a>
      </div>
    </div>
  );
}
