import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/models/product.model";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/admin/products/[id] - Get product by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

// PUT /api/admin/products/[id] - Update product
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, list, brand, category, inStock, images } =
      body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 },
      );
    }

    const updateData = {
      name,
      description,
      price: price ? parseFloat(price) : undefined,
      list: list ? parseFloat(list) : undefined,
      brand,
      category,
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      images: images || undefined,
    };

    const success = await Product.update(id, updateData);

    if (!success) {
      return NextResponse.json(
        { error: "Product not found or update failed" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const success = await Product.delete(id);

    if (!success) {
      return NextResponse.json(
        { error: "Product not found or deletion failed" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
