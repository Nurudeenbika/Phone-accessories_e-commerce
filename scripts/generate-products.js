// Script to generate many products with rich descriptions
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

// Database configuration - try different common configurations
const dbConfigs = [
  { host: "localhost", user: "root", password: "", database: "jespogadgets" },
  {
    host: "localhost",
    user: "root",
    password: "root",
    database: "jespogadgets",
  },
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "jespogadgets",
  },
  {
    host: "localhost",
    user: "root",
    password: "123456",
    database: "jespogadgets",
  },
];

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

// Product categories with realistic names
const categories = [
  {
    name: "Smartphones",
    brands: ["Samsung", "iPhone", "Google", "OnePlus", "Xiaomi"],
  },
  { name: "Laptops", brands: ["Dell", "HP", "Lenovo", "MacBook", "ASUS"] },
  {
    name: "Tablets",
    brands: ["iPad", "Samsung", "Microsoft", "Amazon", "Huawei"],
  },
  {
    name: "Headphones",
    brands: ["Sony", "Bose", "Sennheiser", "Audio-Technica", "JBL"],
  },
  {
    name: "Smart Watches",
    brands: ["Apple Watch", "Samsung", "Garmin", "Fitbit", "Amazfit"],
  },
  {
    name: "Gaming",
    brands: ["NVIDIA", "AMD", "Razer", "Logitech", "SteelSeries"],
  },
  {
    name: "Cameras",
    brands: ["Canon", "Nikon", "Sony", "Fujifilm", "Panasonic"],
  },
  {
    name: "Accessories",
    brands: ["Anker", "Belkin", "Spigen", "OtterBox", "Case-Mate"],
  },
];

// Generate realistic product names
function generateProductName(category, brand) {
  const categorySpecificNames = {
    Smartphones: [
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
    ],
    Laptops: [
      "Inspiron",
      "Pavilion",
      "ThinkPad",
      "MacBook",
      "ZenBook",
      "VivoBook",
      "Chromebook",
      "Gaming",
      "Pro",
      "Air",
    ],
    Tablets: [
      "iPad",
      "Galaxy Tab",
      "Surface",
      "Fire",
      "MatePad",
      "MediaPad",
      "Yoga",
      "Flex",
      "Pro",
      "Air",
    ],
    Headphones: [
      "WH-1000XM",
      "QuietComfort",
      "HD",
      "Momentum",
      "ATH-M",
      "Free",
      "Buds",
      "AirPods",
      "Studio",
      "Pro",
    ],
    "Smart Watches": [
      "Apple Watch",
      "Galaxy Watch",
      "Forerunner",
      "Versa",
      "GTS",
      "Band",
      "Active",
      "Sport",
      "Classic",
      "SE",
    ],
    Gaming: [
      "GeForce",
      "Radeon",
      "DeathAdder",
      "G Pro",
      "Apex",
      "Arctis",
      "BlackWidow",
      "Naga",
      "Kraken",
      "Huntsman",
    ],
    Cameras: [
      "EOS",
      "D",
      "Alpha",
      "X-T",
      "Lumix",
      "PowerShot",
      "Coolpix",
      "Cyber-shot",
      "OM-D",
      "Z",
    ],
    Accessories: [
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
    ],
  };

  const names = categorySpecificNames[category] || [
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
function generatePrices() {
  const basePrices = {
    Smartphones: [80000, 150000, 300000],
    Laptops: [120000, 250000, 500000],
    Tablets: [40000, 80000, 150000],
    Headphones: [15000, 35000, 80000],
    "Smart Watches": [30000, 60000, 120000],
    Gaming: [20000, 50000, 150000],
    Cameras: [50000, 120000, 300000],
    Accessories: [5000, 15000, 35000],
  };

  const priceRanges = basePrices[category] || [10000, 25000, 50000];
  const basePrice = priceRanges[Math.floor(Math.random() * priceRanges.length)];
  const listPrice = basePrice + Math.floor(Math.random() * basePrice * 0.3); // 30% markup for list price

  return { price: basePrice, list: listPrice };
}

// Upload image to Cloudinary (simplified - you'll need to implement actual cloud-upload)
async function uploadImageToCloudinary() {
  // For now, we'll use the same image URL multiple times
  // In a real implementation, you'd cloud-upload the image file to Cloudinary
  const imageUrl =
    "https://res.cloudinary.com/drfksqwt5/image/upload/v1757782012/products/temp/asm8by35fludwmjrgicd.png";
  return imageUrl;
}

async function generateProducts() {
  let connection;
  let dbConfig;

  try {
    console.log("🔄 Connecting to database...");

    // Try different database configurations
    for (const config of dbConfigs) {
      try {
        console.log(
          `Trying connection with user: ${config.user}, password: ${config.password || "empty"}`,
        );
        connection = await mysql.createConnection(config);
        dbConfig = config;
        console.log("✅ Connected to database successfully!");
        break;
      } catch (error) {
        console.log(`❌ Failed with config: ${error.message}`);
        continue;
      }
    }

    if (!connection) {
      throw new Error("Could not connect to database with any configuration");
    }

    const totalProducts = 100; // Generate 100 products
    console.log(`🔄 Generating ${totalProducts} products...`);

    for (let i = 0; i < totalProducts; i++) {
      const category =
        categories[Math.floor(Math.random() * categories.length)];
      const brand =
        category.brands[Math.floor(Math.random() * category.brands.length)];
      const productName = generateProductName(category.name, brand);
      const description =
        productDescriptions[
          Math.floor(Math.random() * productDescriptions.length)
        ];
      const { price, list } = generatePrices();

      // Generate 2-5 images (same image, different URLs)
      const imageCount = Math.floor(Math.random() * 4) + 2; // 2-5 images
      const images = [];
      for (let j = 0; j < imageCount; j++) {
        const imageUrl = await uploadImageToCloudinary();
        images.push(imageUrl);
      }

      const productId = randomUUID();
      const inStock = Math.random() > 0.1; // 90% chance of being in stock

      const product = {
        id: productId,
        name: productName,
        description: description,
        price: price,
        list: list,
        brand: brand,
        category: category.name,
        inStock: inStock,
        images: JSON.stringify(images),
      };

      await connection.execute(
        `
        INSERT INTO products (id, name, description, price, list, brand, category, inStock, images)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          product.id,
          product.name,
          product.description,
          product.price,
          product.list,
          product.brand,
          product.category,
          product.inStock,
          product.images,
        ],
      );

      console.log(
        `✅ Created product ${i + 1}/${totalProducts}: ${productName}`,
      );
    }

    console.log(`🎉 Successfully generated ${totalProducts} products!`);

    // Show summary
    const [categoriesSummary] = await connection.execute(`
      SELECT category, COUNT(*) as count 
      FROM products 
      GROUP BY category 
      ORDER BY count DESC
    `);

    console.log("\n📊 Products by Category:");
    categoriesSummary.forEach((row) => {
      console.log(`  ${row.category}: ${row.count} products`);
    });
  } catch (error) {
    console.error("❌ Error generating products:", error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
generateProducts();
