import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { Product } from "@/models/product.model";

export async function DELETE() {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get count of products before deletion
    const allProducts = await Product.findAll();
    const count = allProducts.length;
    console.log(`Found ${count} products to delete`);

    // Delete all products using the model method
    const deletedCount = await Product.deleteAll();
    console.log(`Successfully deleted ${deletedCount} products`);

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deletedCount} products`,
      deletedCount: deletedCount,
    });
  } catch (error) {
    console.error("Error deleting all products:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : "Unknown";

    console.error("Error details:", {
      message: errorMessage,
      stack: errorStack,
      name: errorName,
    });

    return NextResponse.json(
      {
        error: "Failed to delete products",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
