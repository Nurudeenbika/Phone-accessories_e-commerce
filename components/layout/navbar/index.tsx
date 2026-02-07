"use client";

import { LoggedInUserParams } from "@/lib/jespo/contracts";
import React, { useState } from "react";
import Container from "@/components/layout/base/container";
import UserMenu from "@/components/layout/navbar/usermenu";
import SearchBar from "@/components/layout/common/SearchBar";
import Link from "next/link";
import { MdOutlineFavoriteBorder, MdMenu, MdClose } from "react-icons/md";

export default function Navbar({
  loggedInUser,
}: LoggedInUserParams): React.ReactElement {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const parentClassname = "sticky top-0 w-full bg-white z-30";

  // First row - Logo, Search and User/Cart
  const firstRowClassname = "py-3 lg:py-4 border-b border-gray-100";
  const firstRowContainerClassname =
    "flex items-center justify-between sm:px-2 xl:px-0";

  // Second row - Navigation Links with gray background
  const secondRowClassname = "py-2 bg-gray-50 border-b border-gray-100";
  const secondRowContainerClassname =
    "flex items-center justify-between sm:px-2 xl:px-0";
  const logoClassname =
    "text-xl lg:text-2xl font-bold text-gray-900 hover:text-primary-700 transition-colors";
  const navLinksClassname = "hidden lg:flex items-center gap-1";
  const linkClassname =
    "px-4 py-2 text-gray-700 hover:text-primary-700 hover:bg-white/70 transition-all duration-200 font-medium rounded-lg";
  const dividerClassname = "w-px h-6 bg-gray-300 mx-2";
  const favoritesButtonClassname =
    "flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-700 hover:bg-white/70 transition-all duration-200 font-medium rounded-lg";

  // Mobile menu classes
  const mobileMenuClassname = `fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
    isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
  }`;
  const mobileNavLinkClassname =
    "block px-6 py-4 text-gray-700 hover:text-primary-700 hover:bg-gray-50 transition-all duration-200 font-medium border-b border-gray-100";

  return (
    <div className={parentClassname}>
      {/* First Row - Logo, Search Bar and User/Cart */}
      <div className={firstRowClassname}>
        <Container>
          <div className={firstRowContainerClassname}>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-primary-700 transition-colors"
            >
              <MdMenu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link href="/" className={logoClassname}>
              Jespo Gadgets
            </Link>

            {/* Search Bar - Hidden on mobile, shown on tablet and up */}
            <div className="hidden md:flex flex-1 justify-center max-w-2xl mx-4 lg:mx-8">
              <SearchBar />
            </div>

            {/* User Menu and Cart */}
            <div>
              <UserMenu loggedInUser={loggedInUser} />
            </div>
          </div>
        </Container>
      </div>

      {/* Second Row - Navigation Links */}
      <div className={secondRowClassname}>
        <Container>
          <div className={secondRowContainerClassname}>
            {/* Navigation Links - Desktop */}
            <div className={navLinksClassname}>
              <Link href="/products" className={linkClassname}>
                All Products
              </Link>
              <div className={dividerClassname}></div>
              <Link href="/categories" className={linkClassname}>
                Categories
              </Link>
              <div className={dividerClassname}></div>
              <Link href="/about" className={linkClassname}>
                About
              </Link>
              <div className={dividerClassname}></div>
              <Link href="/faq" className={linkClassname}>
                FAQ
              </Link>
              <div className={dividerClassname}></div>
              <Link href="/contact" className={linkClassname}>
                Contact
              </Link>
            </div>

            {/* Favorites Button */}
            <Link href="/favorites" className={favoritesButtonClassname}>
              <MdOutlineFavoriteBorder className="w-5 h-5" />
              <span className="hidden sm:inline">Favorites</span>
            </Link>
          </div>
        </Container>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={mobileMenuClassname}>
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Jespo Gadgets
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-600 hover:text-primary-700 transition-colors"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <SearchBar />
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex-1 overflow-y-auto">
            <Link
              href="/products"
              className={mobileNavLinkClassname}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              All Products
            </Link>
            <Link
              href="/categories"
              className={mobileNavLinkClassname}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/about"
              className={mobileNavLinkClassname}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/faq"
              className={mobileNavLinkClassname}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className={mobileNavLinkClassname}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/favorites"
              className={mobileNavLinkClassname}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center gap-3">
                <MdOutlineFavoriteBorder className="w-5 h-5" />
                Favorites
              </div>
            </Link>
          </div>

          {/* Mobile User Menu */}
          <div className="p-4 border-t border-gray-200">
            <UserMenu loggedInUser={loggedInUser} />
          </div>
        </div>
      </div>
    </div>
  );
}
