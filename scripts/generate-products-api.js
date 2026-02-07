// Script to generate products via API calls
import fetch from "node-fetch";

const API_BASE_URL = "http://localhost:3000";

async function generateProducts(count = 50) {
  try {
    console.log(`🔄 Generating ${count} products via API...`);

    const response = await fetch(
      `${API_BASE_URL}/api/admin/generate-products`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ count }),
      },
    );

    const result = await response.json();

    if (result.success) {
      console.log(`🎉 Successfully generated ${result.generated} products!`);
      console.log(`📊 Total products in database: ${result.total}`);

      if (result.errors > 0) {
        console.log(`⚠️  ${result.errors} products failed to generate`);
        result.errorDetails.forEach((error) => {
          console.log(`  Product ${error.productIndex}: ${error.error}`);
        });
      }

      console.log("\n📊 Products by Category:");
      Object.entries(result.categorySummary).forEach(([category, count]) => {
        console.log(`  ${category}: ${count} products`);
      });
    } else {
      console.error("❌ Failed to generate products:", result.error);
      if (result.details) {
        console.error("Details:", result.details);
      }
    }
  } catch (error) {
    console.error("❌ Error calling API:", error.message);
    console.log("\n💡 Make sure your development server is running (pnpm dev)");
  }
}

// Get count from command line argument or use default
const count = process.argv[2] ? parseInt(process.argv[2]) : 50;

console.log(`🚀 Starting product generation...`);
console.log(`📝 Will generate ${count} products with rich descriptions`);
console.log(
  `🖼️  Using image: C:\\Users\\Owner\\Desktop\\MyProjects\\Client\\jespogadgets\\public\\prods.jpg`,
);
console.log("");

