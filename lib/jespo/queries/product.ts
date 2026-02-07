import { GetProductListParams } from "@/lib/jespo/contracts";
import { Product, ProductAttributes } from "@/models/product.model";
import { ItemParams } from "@/lib/jespo/contracts";

export async function getAllProducts(): Promise<ProductAttributes[]> {
    try {
        return await Product.findAll();
    } catch (error) {
        console.error(`Error while fetching products: ${error}`);
        return [];
    }
}

export async function getProducts(
  params: GetProductListParams,
): Promise<ProductAttributes[]> {
  const { category, searchQuery } = params;

  try {
    const filters = {
      ...(category && category !== "All" && { category }),
      ...(searchQuery && { name: searchQuery }),
    };

    const products = await Product.search(filters);
    return products;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return [];
  }
}


export async function getProductById(
  params: ItemParams,
): Promise<ProductAttributes | null> {
  const { productId } = params;

  try {
    if (!productId) return null;
    const product = await Product.findById(productId);
    return product;
  } catch (error) {
    console.error("Error fetching product by id:", error);
    return null;
  }
}


// New function for admin product management
export async function getProductByIdAdmin(
  productId: string,
): Promise<ProductAttributes | null> {
  try {
    const product = await Product.findById(productId);
    return product;
  } catch (error) {
    console.error("Error fetching product by id:", error);
    return null;
  }
}


export async function upsertProduct(
    data: {
      id?: string;
      name: string;
      description?: string;
      price: number;
      list?: number | null;
      brand: string;
      category: string;
      inStock?: boolean;
      images?: string,
    }
): Promise<ProductAttributes> {

  try {
    if(data.id) {
      return await Product.update(data.id, {
        name: data.name,
        description: data.description,
        price: data.price,
        list: data.list ?? null,
        brand: data.brand,
        category: data.category,
        inStock: data.inStock ?? true,
      });
    }

    return await Product.create({
      name: data.name,
      description: data.description,
      price: data.price,
      list: data.list ?? null,
      brand: data.brand,
      category: data.category,
      inStock: data.inStock ?? true
    });

  } catch (error: any) {
    console.error("Error upserting product:", error);
    throw error;
  }

}


export async function insertProduct(
    data: {
      name: string;
      description?: string;
      price: number;
      list?: number | null;
      brand: string;
      category: string;
      inStock?: boolean;
      images?: string[],
    }
): Promise<ProductAttributes> {

  try {

    return await Product.create({
      name: data.name,
      description: data.description,
      price: data.price,
      list: data.list ?? null,
      brand: data.brand,
      category: data.category,
      inStock: data.inStock ?? true,
      images: data.images ?? [],
    });

  } catch (error: any) {
    console.error("Error upserting product:", error);
    throw error;
  }

}

