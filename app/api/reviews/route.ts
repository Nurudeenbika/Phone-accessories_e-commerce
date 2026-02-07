import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { Review } from "@/models/review.model";

// GET /api/reviews - Get reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const userId = searchParams.get("userId");

    if (!productId && !userId) {
      return NextResponse.json(
        { error: "Product ID or User ID is required" },
        { status: 400 },
      );
    }

    let reviews;
    if (productId) {
      reviews = await Review.findByProductId(productId);
    } else if (userId) {
      reviews = await Review.findByUserId(userId);
    }

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { productId, rating, comment } = body;

    // Validate required fields
    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: "Product ID, rating, and comment are required" },
        { status: 400 },
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    const reviewData = {
      userId: (session.user as any).id,
      productId,
      rating: parseInt(rating),
      comment: comment.trim(),
    };

    const reviewId = await Review.create(reviewData);

    return NextResponse.json({
      success: true,
      reviewId,
      message: "Review created successfully",
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 },
    );
  }
}

