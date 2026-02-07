import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/models/product.model";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/products/[id] - Get product by ID for public use
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const response = NextResponse.json({ product });

    // Add caching headers for individual products
    response.headers.set("Cache-Control", "public, max-age=600, s-maxage=600"); // 10 minutes cache

    return response;
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}
