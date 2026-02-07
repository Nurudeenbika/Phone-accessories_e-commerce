import React from "react";
import LoginForm from "@/app/login/form/loginform";
import { getLoggedInUser } from "@/lib/jespo/queries/user";
import Link from "next/link";
import Image from "next/image";
import { MdArrowBack } from "react-icons/md";

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export const dynamic = "force-dynamic";

export default async function Login({
  searchParams,
}: LoginPageProps): Promise<React.ReactElement> {
  const loggedInUser = await getLoggedInUser();
  const { next } = await searchParams;
  const nextUrl = next;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Two Section Layout */}
      <div className="flex min-h-screen">
        {/* Left Section - Banner Image (Full Height) */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black z-10"></div>
          <div className="flex items-center justify-center w-full relative z-20">
            <div className="text-center p-12">
              <Image
                src="/banner-image.png"
                alt="Jespo Gadgets"
                width={400}
                height={400}
                className="mx-auto mb-8 rounded-2xl shadow-2xl"
                priority
              />
              <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
                Welcome Back to Jespo Gadgets
              </h2>
              <p className="text-gray-200 text-lg max-w-md mx-auto drop-shadow-md">
                Sign in to access your personalized shopping experience and
                manage your orders
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Back Button */}
            <div className="mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <MdArrowBack className="w-5 h-5" />
                Back to Home
              </Link>
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Sign in to your account to continue shopping
              </p>
            </div>

            {/* Login Form Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Sign In
                </h1>
                <p className="text-gray-600 text-sm">
                  Enter your credentials to access your account
                </p>
              </div>

              <LoginForm loggedInUser={loggedInUser} nextUrl={nextUrl} />

              {/* Additional Links */}
              <div className="text-center mt-6 space-y-3">
                <Link
                  href="/forgot-password"
                  className="text-gray-500 hover:text-gray-700 text-sm transition-colors block"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Benefits Section - Mobile Only */}
            <div className="lg:hidden mt-8">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">📦</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Track Orders
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Monitor your orders in real-time
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">❤️</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Save Favorites
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Create wishlists of your favorite products
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
