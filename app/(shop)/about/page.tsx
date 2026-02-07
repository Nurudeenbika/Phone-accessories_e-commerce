import React from "react";
import { getLoggedInUser } from "@/lib/jespo/queries/user";
import Breadcrumb from "@/components/layout/common/Breadcrumb";

export default async function AboutPage(): Promise<React.ReactElement> {
  const loggedInUser = await getLoggedInUser();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumb />

      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          About Jespo Gadgets
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Your trusted partner for premium electronic gadgets and accessories.
          We bring you the latest technology with unbeatable quality and
          service.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="bg-white border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            To make cutting-edge technology accessible to everyone by providing
            high-quality electronic gadgets at competitive prices, backed by
            exceptional customer service and support.
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Quality First</h3>
              <p className="text-gray-600 text-sm">
                Every product meets our strict quality standards
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            To become the leading destination for electronic gadgets in Nigeria,
            known for innovation, reliability, and customer satisfaction.
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Innovation</h3>
              <p className="text-gray-600 text-sm">
                Bringing you the latest in technology
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💎</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Quality
            </h3>
            <p className="text-gray-600 text-sm">
              Premium products that exceed expectations
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Speed</h3>
            <p className="text-gray-600 text-sm">
              Fast delivery and quick customer support
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤝</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Trust</h3>
            <p className="text-gray-600 text-sm">
              Reliable service you can count on
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Precision
            </h3>
            <p className="text-gray-600 text-sm">
              Attention to detail in everything we do
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 p-6 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">👨‍💼</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              John Smith
            </h3>
            <p className="text-primary-600 font-medium mb-2">CEO & Founder</p>
            <p className="text-gray-600 text-sm">
              Passionate about technology and customer satisfaction with over 10
              years in the industry.
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-6 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">👩‍💻</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Sarah Johnson
            </h3>
            <p className="text-primary-600 font-medium mb-2">CTO</p>
            <p className="text-gray-600 text-sm">
              Expert in emerging technologies and ensuring our platform delivers
              the best experience.
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-6 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">👨‍🔧</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Mike Davis
            </h3>
            <p className="text-primary-600 font-medium mb-2">
              Head of Operations
            </p>
            <p className="text-gray-600 text-sm">
              Ensures smooth operations and timely delivery of all your orders.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border border-gray-200 p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Our Impact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">50K+</div>
            <div className="text-gray-600">Products Sold</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">5+</div>
            <div className="text-gray-600">Years Experience</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
            <div className="text-gray-600">Customer Support</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-primary-50 p-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Experience Quality?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers who trust Jespo Gadgets for
          their electronic needs.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/products"
            className="bg-primary-600 text-white px-8 py-3 font-medium hover:bg-primary-700 transition-colors"
          >
            Shop Now
          </a>
          <a
            href="/contact"
            className="bg-white text-primary-600 px-8 py-3 font-medium hover:bg-gray-50 transition-colors border border-primary-600"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
