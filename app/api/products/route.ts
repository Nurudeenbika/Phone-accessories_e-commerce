import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/models/product.model";
import { CategoryMap } from "@/lib/utils/mappers/category.map";

// GET /api/products - Get products for public use
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    //const category = searchParams.get("category");
    const inStock = searchParams.get("inStock");
    const priceRange = searchParams.get("priceRange");
    const categorySlug = searchParams.get("category");
    const search = searchParams.get("search");
    const query: any = {};
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const orderBy = searchParams.get("orderBy") as
      | "name"
      | "price"
      | "category"
      | "brand"
      | undefined;
    const orderDir = searchParams.get("orderDir") as "ASC" | "DESC" | undefined;

    let minPrice: number | undefined;
    let maxPrice: number | undefined;

    if (priceRange) {
      if (priceRange.includes("-")) {
        const [min, max] = priceRange.split("-").map(Number);
        minPrice = min;
        maxPrice = max;
      } else if (priceRange.endsWith("+")) {
        minPrice = Number(priceRange.replace("+", ""));
      }
    }

    const category =
      categorySlug && CategoryMap[categorySlug]
        ? CategoryMap[categorySlug]
        : categorySlug;

    // Calculate offset from page
    const offset = (page - 1) * limit;

    const filters = {
      ...(category && category !== "all" && { category }),
      ...(search && { name: search }),
      ...(minPrice !== undefined && { minPrice }),
      ...(maxPrice !== undefined && { maxPrice }),
      limit,
      offset,
      ...(orderBy && { orderBy }),
      ...(orderDir && { orderDir }),
      ...(inStock === "true" && { inStock: true }),
    };

    if (category) {
      query.category = category;
    }
    // Get products and total count
    const [products, totalCount] = await Promise.all([
      Product.search(filters),
      Product.count(filters), // We need to add this method to the Product model
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    const response = NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });

    // Add caching headers
    response.headers.set("Cache-Control", "public, max-age=300, s-maxage=300"); // 5 minutes cache

    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
