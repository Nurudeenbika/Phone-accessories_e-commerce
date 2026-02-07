import { NextResponse } from "next/server";
import { productCategories } from "@/lib/utils/data/productcategories";

export async function GET() {
  return NextResponse.json({
    categories: productCategories,
    count: productCategories.length,
  });
}
