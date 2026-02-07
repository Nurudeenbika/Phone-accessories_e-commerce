import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { insertProduct, getAllProducts } from "@/lib/jespo/queries/product";
import {ProductAttributes} from "@/models/product.model";


export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userRole = (session.user as any)?.role;
    if (userRole?.toLowerCase() !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(
        parseInt(searchParams.get("page") ?? "1", 10),
        1
    );

    const limit = Math.max(
        parseInt(searchParams.get("limit") ?? "10", 10),
        1
    );

    const offset = (page - 1) * limit;
    const includeStats = searchParams.get("stats") === "true";

    const allProducts = await getAllProducts();
    const totalCount = allProducts.length;
    const totalPages = Math.ceil(totalCount / limit);

    const products = allProducts.slice(offset, offset + limit);

    const pagination = {
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      limit: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    }

    return NextResponse.json({
      products: products,
      pagination,
      ...(includeStats && {
        stats: {
          totalProducts: totalCount,
          activeProducts: allProducts.filter(p => p.inStock == true).length,
          outOfStock: allProducts.filter(p => p.inStock == false).length,
          categories: new Set(
              allProducts.map((p: ProductAttributes) => p.category),
          ).size
        }
      })
    });

  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}


export async function POST(request: NextRequest) {
  try {

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    if(userRole?.toLowerCase() !== "admin") {
      return NextResponse.json(
          { error: "Admin access required" },
          { status: 403 }
      )
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      list,
      brand,
      category,
      inStock,
      images,
    } = body;

    if(!name || !description || !price || !brand || !category) {
      return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
      );
    }

    const product = await insertProduct({
      name: name,
      description: description,
      price: price,
      list: list,
      brand: brand,
      category: category,
      inStock: inStock,
      images: images,
    });

    return NextResponse.json(product, { status: 201 });

  } catch (error) {
    console.error("An error occurred while adding products", error);
    return NextResponse.json(
        { error: "Failed to add products" },
        { status: 500 }
    );
  }
}

