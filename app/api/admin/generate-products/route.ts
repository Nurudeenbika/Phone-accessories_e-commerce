import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/models/product.model";
import { randomUUID } from "crypto";
import { uploadDefaultProductImage } from "@/lib/cloudinary/uploadLocalImage";

// Rich product descriptions with HTML formatting
const productDescriptions = [
  `<h3>Premium Quality Product</h3>
   <p>Experience the <strong>ultimate in performance</strong> with our latest innovation. This product features:</p>
   <ul>
     <li><strong>Advanced Technology:</strong> Cutting-edge components for superior performance</li>
     <li><strong>Durable Construction:</strong> Built to last with premium materials</li>
     <li><strong>User-Friendly Design:</strong> Intuitive interface for easy operation</li>
     <li><strong>Versatile Functionality:</strong> Perfect for both professional and personal use</li>
   </ul>
   <p><em>Perfect for tech enthusiasts and professionals who demand the best!</em></p>`,

  `<h3>Innovative Design & Functionality</h3>
   <p>Revolutionary features meet <span style="color: #3b82f6;"><strong>stunning design</strong></span> in this exceptional product:</p>
   <blockquote style="border-left: 4px solid #3b82f6; padding-left: 16px; margin: 16px 0;">
     <p>"A game-changer in the industry that sets new standards for excellence."</p>
   </blockquote>
   <p><strong>Key Features:</strong></p>
   <ol>
     <li>High-performance processing capabilities</li>
     <li>Energy-efficient operation</li>
     <li>Compact and portable design</li>
     <li>Compatible with all major platforms</li>
   </ol>
   <p>Transform your workflow with this <strong>must-have</strong> device!</p>`,

  `<h3>Professional Grade Solution</h3>
   <p>Built for <strong>professionals who demand excellence</strong>, this product delivers unmatched quality:</p>
   <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
     <h4 style="margin-top: 0; color: #1f2937;">Technical Specifications</h4>
     <ul>
       <li>Premium build quality</li>
       <li>Advanced connectivity options</li>
       <li>Long-lasting battery life</li>
       <li>Comprehensive warranty coverage</li>
     </ul>
   </div>
   <p><em>Ideal for business users and creative professionals.</em></p>`,

  `<h3>Next-Generation Technology</h3>
   <p>Step into the future with our <span style="background-color: #fef3c7; padding: 2px 6px; border-radius: 4px;"><strong>award-winning</strong></span> product:</p>
   <p><strong>Why Choose This Product?</strong></p>
   <ul>
     <li>✅ Industry-leading performance</li>
     <li>✅ Sleek, modern aesthetics</li>
     <li>✅ Eco-friendly materials</li>
     <li>✅ 24/7 customer support</li>
   </ul>
   <blockquote>
     <p><em>"Exceeds expectations in every way. Highly recommended!"</em> - Customer Review</p>
   </blockquote>
   <p>Don't miss out on this <strong>limited-time offer</strong>!</p>`,

  `<h3>Smart & Efficient Design</h3>
   <p>Intelligent engineering meets <strong>beautiful design</strong> in this remarkable product:</p>
   <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin: 16px 0;">
     <h4 style="margin: 0 0 8px 0;">FEATURED HIGHLIGHT</h4>
     <p style="margin: 0;">Revolutionary technology that adapts to your needs</p>
   </div>
   <p><strong>Perfect For:</strong></p>
   <ul>
     <li>Home and office use</li>
     <li>Educational purposes</li>
     <li>Creative projects</li>
     <li>Professional applications</li>
   </ul>
   <p>Experience the difference quality makes!</p>`,
];

// Product categories with realistic names - only our two categories
const categories = [
  {
    name: "phone",
    brands: [
      "Samsung",
      "Apple",
      "Google",
      "OnePlus",
      "Xiaomi",
      "Huawei",
      "Oppo",
      "Vivo",
      "Realme",
      "Nothing",
    ],
  },
  {
    name: "phone-accessories",
    brands: [
      "Apple",
      "Samsung",
      "Sony",
      "Bose",
      "JBL",
      "Anker",
      "Belkin",
      "Spigen",
      "OtterBox",
      "Case-Mate",
    ],
  },
];

// Generate realistic product names
function generateProductName(category: string, brand: string) {
  const categorySpecificNames = {
    phone: [
      "Galaxy",
      "iPhone",
      "Pixel",
      "One",
      "Mi",
      "Pro",
      "Ultra",
      "Max",
      "Plus",
      "Mini",
      "Note",
      "Edge",
      "S",
      "A",
      "X",
    ],
    "phone-accessories": [
      "AirPods",
      "Galaxy Buds",
      "WH-1000XM",
      "PowerCore",
      "Lightning",
      "Wireless",
      "Protection",
      "Clear",
      "Defender",
      "Commuter",
      "Symmetry",
      "Liquid",
      "Air",
      "Pro",
      "Max",
    ],
  };

  const names = categorySpecificNames[
    category as keyof typeof categorySpecificNames
  ] || [
    "Pro",
    "Plus",
    "Max",
    "Ultra",
    "Premium",
    "Elite",
    "Advanced",
    "Smart",
    "Digital",
    "Wireless",
  ];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const modelNumber = Math.floor(Math.random() * 9999) + 1000;

  return `${brand} ${randomName} ${modelNumber}`;
}

// Generate realistic prices
function generatePrices(category: string) {
  const basePrices = {
    phone: [80000, 150000, 300000, 450000, 600000],
    "phone-accessories": [5000, 15000, 35000, 80000, 120000],
  };

  const priceRanges = basePrices[category as keyof typeof basePrices] || [
    10000, 25000, 50000,
  ];
  const basePrice = priceRanges[Math.floor(Math.random() * priceRanges.length)];
  const listPrice = basePrice + Math.floor(Math.random() * basePrice * 0.3); // 30% markup for list price

  return { price: basePrice, list: listPrice };
}

// Generate 2-5 image URLs (same Cloudinary image, different variations)
async function generateImages(cloudinaryImageUrl: string) {
  const imageCount = Math.floor(Math.random() * 4) + 2; // 2-5 images
  const images = [];

  for (let i = 0; i < imageCount; i++) {
    images.push(cloudinaryImageUrl);
  }

  return images;
}

// POST /api/admin/generate-products - Generate many products
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { count = 50 } = body; // Default to 50 products

    console.log(`🔄 Generating ${count} products...`);

    // First, cloud-upload the default image to Cloudinary
    console.log("📤 Uploading default product image to Cloudinary...");
    let cloudinaryImageUrl: string;
    try {
      cloudinaryImageUrl = await uploadDefaultProductImage();
      console.log(
        "✅ Default image uploaded to Cloudinary:",
        cloudinaryImageUrl,
      );
    } catch (error) {
      console.error("❌ Failed to cloud-upload image to Cloudinary:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to cloud-upload image to Cloudinary",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      );
    }

    const generatedProducts = [];
    const errors = [];

    for (let i = 0; i < count; i++) {
      try {
        // Ensure good mix: 60% phones, 40% accessories
        const categoryIndex = i < Math.floor(count * 0.6) ? 0 : 1; // 0 = phone, 1 = phone-accessories
        const category = categories[categoryIndex];
        const brand =
          category.brands[Math.floor(Math.random() * category.brands.length)];
        const productName = generateProductName(category.name, brand);
        const description =
          productDescriptions[
            Math.floor(Math.random() * productDescriptions.length)
          ];
        const { price, list } = generatePrices(category.name);
        const images = await generateImages(cloudinaryImageUrl);
        const inStock = Math.random() > 0.1; // 90% chance of being in stock

        const productData = {
          name: productName,
          description: description,
          price: price,
          list: list,
          brand: brand,
          category: category.name,
          inStock: inStock,
          images: images,
        };

        const productId = await Product.create(productData);

        generatedProducts.push({
          id: productId,
          name: productName,
          category: category.name,
          brand: brand,
        });

        console.log(
          `✅ Created product ${i + 1}/${count}: ${productName} (${category.name})`,
        );
      } catch (error) {
        console.error(`❌ Error creating product ${i + 1}:`, error);
        errors.push({
          productIndex: i + 1,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Get category summary
    const allProducts = await Product.findAll();
    const categorySummary = allProducts.reduce(
      (acc, product) => {
        const category = product.category || "Uncategorized";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return NextResponse.json({
      success: true,
      message: `Successfully generated ${generatedProducts.length} products`,
      generated: generatedProducts.length,
      total: allProducts.length,
      errors: errors.length,
      errorDetails: errors,
      categorySummary: categorySummary,
    });
  } catch (error) {
    console.error("❌ Error generating products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate products",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
