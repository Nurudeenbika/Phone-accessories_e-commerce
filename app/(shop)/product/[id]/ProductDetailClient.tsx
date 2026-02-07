"use client";

import React, { useState, useEffect } from "react";
import { ProductAttributes } from "@/models/product.model";
import { useCart } from "@/context/CartContext";
import { CartProductType } from "@/lib/jespo/types";
import {
  MdAdd,
  MdRemove,
  MdShoppingCart,
  MdExpandMore,
  MdExpandLess,
  MdShare,
  MdStar,
  MdStarBorder,
  MdSend,
} from "react-icons/md";
import {
  FaFacebook,
  FaGoogle,
  FaWhatsapp,
  FaTelegram,
  FaLinkedin,
  FaPinterest,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import Breadcrumb from "@/components/layout/common/Breadcrumb";
import ProductCard from "@/components/product/ProductCard";
import Image from "next/image";
import { useSession } from "next-auth/react";
import DOMPurify from "dompurify";

interface ProductDetailClientProps {
  product: ProductAttributes;
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const { handleAddProductToCart } = useCart();
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // Use real product description or fallback to a default message (HTML allowed)
  const longDescription =
    product.description ||
    `<p>Discover the exceptional quality and features of <strong>${product.name}</strong>.
   This premium product from <strong>${product.brand}</strong> delivers outstanding
   performance and reliability.</p>

   <ul>
     <li>High-quality materials and construction</li>
     <li>Advanced technology and innovation</li>
     <li>Excellent value for money</li>
     <li>Reliable performance and durability</li>
     <li>Modern design and functionality</li>
   </ul>

   <p>
     This product represents the perfect balance of quality, style, and functionality.
     Experience the innovation that ${product.brand} is known for.
   </p>`;

  // Plain text version for preview (HTML stripped)
  const plainDescription = longDescription.replace(/<[^>]+>/g, "").trim();

  const handleAddToCart = () => {
    const cartProduct: CartProductType = {
      id: product.id!,
      name: product.name,
      description: product.description || "",
      category: product.category || "",
      brand: product.brand || "",
      selectedImg: {
        color: "default",
        colorCode: "#000000",
        image:
          product.images && product.images.length > 0
            ? product.images[0]
            : "/placeholder-product.jpg",
      },
      quantity,
      price: product.price || 0,
    };

    handleAddProductToCart(cartProduct);
    toast.success("Product added to cart!");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to checkout
    window.location.href = "/checkout";
  };

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 99));
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error("Please sign in to submit a review");
      return;
    }

    if (!reviewForm.comment) {
      toast.error("Please write a review comment");
      return;
    }

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }),
      });

      if (response.ok) {
        toast.success("Review submitted successfully!");
        setReviewForm({ rating: 5, comment: "" });
        setShowReviewForm(false);
        // Refresh reviews
        const reviewsResponse = await fetch(
          `/api/reviews?productId=${product.id}`
        );
        if (reviewsResponse.ok) {
          const data = await reviewsResponse.json();
          setReviews(data.reviews || []);
        }
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  const handleReviewFormChange = (field: string, value: string | number) => {
    setReviewForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this amazing product: ${product.name}`;

    let shareUrl = "";
    switch (platform) {
      case "x":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "pinterest":
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`;
        break;
      case "gmail":
        shareUrl = `mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(text + " " + url)}`;
        break;
    }

    if (platform === "gmail") {
      window.location.href = shareUrl;
    } else {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  // Product images array - use real product images or fallback to emoji
  const productImages =
    product.images && product.images.length > 0
      ? product.images.map((image, index) => ({
          id: index + 1,
          src: image,
          alt: `${product.name} - View ${index + 1}`,
        }))
      : [
          { id: 1, src: "📱", alt: "Product Front View" },
          { id: 2, src: "📱", alt: "Product Back View" },
          { id: 3, src: "📱", alt: "Product Side View" },
          { id: 4, src: "📱", alt: "Product Accessories" },
        ];

  // Related products - fetch from API
  const [relatedProducts, setRelatedProducts] = useState<ProductAttributes[]>(
    []
  );

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch(
          `/api/products?category=${product.category}&limit=4`
        );
        if (response.ok) {
          const data = await response.json();
          // Filter out the current product
          const filtered = data.products.filter(
            (p: ProductAttributes) => p.id !== product.id
          );
          setRelatedProducts(filtered.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    if (product.category) {
      fetchRelatedProducts();
    }
  }, [product.category, product.id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoadingReviews(true);
      try {
        const response = await fetch(`/api/reviews?productId=${product.id}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [product.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumb />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="aspect-square bg-gray-50 relative overflow-hidden">
              {productImages[selectedImageIndex].src.startsWith("http") ? (
                <Image
                  src={productImages[selectedImageIndex].src}
                  alt={productImages[selectedImageIndex].alt}
                  fill
                  className="object-cover transition-all duration-300 ease-in-out"
                  onError={(e) => {
                    // Fallback to emoji if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.parentElement!.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center">
                        <div class="text-gray-400 text-center">
                          <div class="text-8xl mb-4 transition-all duration-300 ease-in-out">📱</div>
                          <p class="text-lg transition-all duration-300 ease-in-out">${productImages[selectedImageIndex].alt}</p>
                        </div>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <div className="text-8xl mb-4 transition-all duration-300 ease-in-out">
                      {productImages[selectedImageIndex].src}
                    </div>
                    <p className="text-lg transition-all duration-300 ease-in-out">
                      {productImages[selectedImageIndex].alt}
                    </p>
                  </div>
                </div>
              )}
              {/* Discount Badge */}
              {product.list && product.list > (product.price || 0) && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-sm font-bold z-10">
                  -
                  {Math.round(
                    ((product.list - (product.price || 0)) / product.list) * 100
                  )}
                  %
                </div>
              )}
            </div>
          </div>

          {/* Image Thumbnails - Horizontal Scroll with Navigation */}
          <div className="relative">
            <div
              className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {productImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 bg-white transition-all duration-300 border-2 overflow-hidden rounded-lg ${
                    selectedImageIndex === index
                      ? "border-primary-600 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {image.src.startsWith("http") ? (
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={64}
                      height={64}
                      className={`object-cover w-full h-full transition-all duration-300 ${
                        selectedImageIndex === index ? "scale-110" : "scale-100"
                      }`}
                      onError={(e) => {
                        // Fallback to emoji if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.parentElement!.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center">
                            <div class="text-lg transition-all duration-300 ${selectedImageIndex === index ? "scale-110" : "scale-100"}">📱</div>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div
                        className={`text-lg transition-all duration-300 ${
                          selectedImageIndex === index
                            ? "scale-110"
                            : "scale-100"
                        }`}
                      >
                        {image.src}
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            {productImages.length > 4 && (
              <>
                <button
                  onClick={() => {
                    const container =
                      document.querySelector(".overflow-x-auto");
                    if (container) {
                      container.scrollLeft -= 80;
                    }
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white border border-gray-300 rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors"
                >
                  <MdExpandLess className="w-4 h-4 text-gray-600 rotate-90" />
                </button>
                <button
                  onClick={() => {
                    const container =
                      document.querySelector(".overflow-x-auto");
                    if (container) {
                      container.scrollLeft += 80;
                    }
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white border border-gray-300 rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors"
                >
                  <MdExpandMore className="w-4 h-4 text-gray-600 rotate-90" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-base text-gray-600 mb-4">{product.brand}</p>

            {/* Description with Enhanced Accordion */}
            <div className="bg-gray-50 p-4 border border-gray-200">
              <div
                className="flex items-center justify-between cursor-pointer transition-all duration-200 hover:bg-gray-100 p-2 -m-2"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              >
                <h3 className="text-base font-semibold text-gray-900">
                  Product Description
                </h3>
                <div className="transition-transform duration-300 ease-in-out">
                  {isDescriptionExpanded ? (
                    <MdExpandLess className="w-6 h-6 text-primary-600" />
                  ) : (
                    <MdExpandMore className="w-6 h-6 text-gray-600" />
                  )}
                </div>
              </div>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isDescriptionExpanded
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div
                  className="text-gray-700 leading-relaxed text-sm prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(longDescription),
                  }}
                />
              </div>
              {!isDescriptionExpanded && (
                <div className="mt-3">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {plainDescription.substring(0, 200)}...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="border-t border-b border-gray-100 py-6">
            <div className="flex items-center gap-6 mb-4">
              <span className="text-2xl font-bold text-gray-900">
                ₦{product.price?.toLocaleString() || "0"}
              </span>
              {product.list && product.list > (product.price || 0) && (
                <span className="text-lg text-gray-500 line-through">
                  ₦{product.list.toLocaleString()}
                </span>
              )}
            </div>

            {product.inStock ? (
              <span className="inline-flex items-center px-4 py-2 text-sm font-medium bg-green-100 text-green-800">
                ✓ In Stock
              </span>
            ) : (
              <span className="inline-flex items-center px-4 py-2 text-sm font-medium bg-red-100 text-red-800">
                ✗ Out of Stock
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-base font-medium text-gray-700">
                Quantity:
              </span>
              <div className="flex items-center border border-gray-200">
                <button
                  onClick={decreaseQuantity}
                  className="p-2 hover:bg-gray-50 transition-colors border-r border-gray-200"
                  disabled={quantity <= 1}
                >
                  <MdRemove className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 min-w-[50px] text-center font-medium text-base">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="p-2 hover:bg-gray-50 transition-colors border-l border-gray-200"
                  disabled={quantity >= 99}
                >
                  <MdAdd className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-primary-600 text-white py-3 px-6 font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <MdShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1 bg-gray-900 text-white py-3 px-6 font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Share this product
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              <button
                onClick={() => handleShare("x")}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-black text-white hover:bg-gray-800 transition-colors text-sm"
                title="Share on X"
              >
                <FaXTwitter className="w-4 h-4" />
                <span className="hidden sm:inline">X</span>
              </button>
              <button
                onClick={() => handleShare("facebook")}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm"
                title="Share on Facebook"
              >
                <FaFacebook className="w-4 h-4" />
                <span className="hidden sm:inline">Facebook</span>
              </button>
              <button
                onClick={() => handleShare("whatsapp")}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white hover:bg-green-600 transition-colors text-sm"
                title="Share on WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
              <button
                onClick={() => handleShare("telegram")}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm"
                title="Share on Telegram"
              >
                <FaTelegram className="w-4 h-4" />
                <span className="hidden sm:inline">Telegram</span>
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-700 text-white hover:bg-blue-800 transition-colors text-sm"
                title="Share on LinkedIn"
              >
                <FaLinkedin className="w-4 h-4" />
                <span className="hidden sm:inline">LinkedIn</span>
              </button>
              <button
                onClick={() => handleShare("pinterest")}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors text-sm"
                title="Share on Pinterest"
              >
                <FaPinterest className="w-4 h-4" />
                <span className="hidden sm:inline">Pinterest</span>
              </button>
              <button
                onClick={() => handleShare("gmail")}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors text-sm"
                title="Share via Email"
              >
                <FaGoogle className="w-4 h-4" />
                <span className="hidden sm:inline">Email</span>
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Product Information
            </h3>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Category:</span>
                <span className="text-gray-600 capitalize">
                  {product.category || "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Brand:</span>
                <span className="text-gray-600">{product.brand || "N/A"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">SKU:</span>
                <span className="text-gray-600">{product.id || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Customer Reviews</h2>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-primary-600 text-white px-6 py-3 hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <MdSend className="w-5 h-5" />
            Write a Review
          </button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="bg-white border border-gray-200 p-6 mb-8 transition-all duration-300">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Write Your Review
            </h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleReviewFormChange("rating", star)}
                      className="transition-colors duration-200"
                    >
                      {star <= reviewForm.rating ? (
                        <MdStar className="w-8 h-8 text-yellow-400 hover:text-yellow-500" />
                      ) : (
                        <MdStarBorder className="w-8 h-8 text-gray-300 hover:text-yellow-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    handleReviewFormChange("comment", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 focus:ring-0 focus:border-primary-700 focus:outline-none h-24 resize-none"
                  placeholder="Share your experience with this product..."
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-6 py-2 hover:bg-primary-700 transition-colors"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Reviews */}
        <div className="bg-white border border-gray-200 p-6">
          {isLoadingReviews ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-100 pb-6 last:border-b-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        User {review.userId}
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) =>
                          i < review.rating ? (
                            <MdStar
                              key={i}
                              className="w-4 h-4 text-yellow-400"
                            />
                          ) : (
                            <MdStarBorder
                              key={i}
                              className="w-4 h-4 text-gray-300"
                            />
                          )
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                No reviews yet. Be the first to review this product!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct, index) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                index={index}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
