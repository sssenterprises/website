import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudProduct {
  id: string;
  productId: string;
  title: string;
  description: string;
  brand: string;
  slug: string;
  featured: boolean;
  image: string;
  thumbnail: string;
  createdAt: string;
}

const FOLDER = "sss-enterprises/products";
const DATA_FOLDER = "sss-enterprises/data";

// ─── Helpers ──────────────────────────────────────────────────────────

function makeThumbnail(imageUrl: string): string {
  if (!imageUrl) return "";
  return imageUrl
    .replace("/upload/", "/upload/w_400,h_400,c_fill,q_auto,f_webp/");
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// ─── Read/Write individual product data files ───────────────────────

async function writeProductData(product: CloudProduct): Promise<void> {
  const json = JSON.stringify(product);
  const buffer = Buffer.from(json, "utf-8");
  const base64 = `data:application/json;base64,${buffer.toString("base64")}`;

  await new Promise<void>((resolve, reject) => {
    cloudinary.uploader.upload(
      base64,
      {
        public_id: `${DATA_FOLDER}/${product.productId}`,
        resource_type: "raw",
        overwrite: true,
        format: "json",
      },
      (error) => {
        if (error) reject(error);
        else resolve();
      }
    );
  });
}

// ─── Public API ──────────────────────────────────────────────────────────

/**
 * List ALL products by listing raw files in the data folder via Admin API
 */
export async function listProducts(options?: {
  brand?: string;
  search?: string;
  featured?: boolean;
}): Promise<CloudProduct[]> {
  let products: CloudProduct[] = [];
  let cursor: string | undefined;

  do {
    const result: any = await cloudinary.api.resources({
      type: "upload",
      prefix: DATA_FOLDER + "/",
      resource_type: "raw",
      max_results: 100,
      next_cursor: cursor,
    });

    cursor = result.next_cursor;
    const resources: any[] = result.resources || [];

    for (const res of resources) {
      // Fetch individual product JSON
      try {
        const url = res.secure_url;
        const fetchRes = await fetch(url, { cache: "no-store" });
        if (fetchRes.ok) {
          const data = safeJsonParse(await fetchRes.text());
          if (data && data.productId) {
            products.push(data as CloudProduct);
          }
        }
      } catch {
        // Skip files that can't be parsed
      }
    }
  } while (cursor);

  // Filter
  if (options?.brand && options.brand !== "all") {
    products = products.filter((p) => p.slug === options.brand);
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }
  if (options?.featured === true) {
    products = products.filter((p) => p.featured);
  }

  // Sort newest first
  products.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return products;
}

/**
 * Create a product: upload image + save metadata
 */
export async function createProduct(data: {
  title: string;
  description: string;
  brand: string;
  slug: string;
  featured: boolean;
  file: File;
}): Promise<CloudProduct> {
  // 1. Upload image
  const bytes = await data.file.arrayBuffer();
  const base64 = `data:${data.file.type};base64,${Buffer.from(bytes).toString("base64")}`;

  const uploadResult = await new Promise<{
    public_id: string;
    secure_url: string;
  }>((resolve, reject) => {
    cloudinary.uploader.upload(
      base64,
      {
        folder: FOLDER,
        resource_type: "image",
        transformation: [
          { width: 800, height: 800, crop: "limit", quality: "auto" },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else
          resolve({
            public_id: (result as any).public_id,
            secure_url: (result as any).secure_url,
          });
      }
    );
  });

  // 2. Create product record
  const productId = uploadResult.public_id.split("/").pop() || Date.now().toString(36);
  const product: CloudProduct = {
    id: uploadResult.public_id,
    productId,
    title: data.title,
    description: data.description,
    brand: data.brand,
    slug: data.slug,
    featured: data.featured,
    image: uploadResult.secure_url,
    thumbnail: makeThumbnail(uploadResult.secure_url),
    createdAt: new Date().toISOString(),
  };

  // 3. Save metadata file
  await writeProductData(product);

  return product;
}

/**
 * Update product metadata
 */
export async function updateProduct(
  id: string,
  data: {
    title?: string;
    description?: string;
    brand?: string;
    slug?: string;
    featured?: boolean;
  }
): Promise<CloudProduct> {
  const products = await listProducts();
  const product = products.find((p) => p.id === id);
  if (!product) throw new Error("Product not found");

  if (data.title !== undefined) product.title = data.title;
  if (data.description !== undefined) product.description = data.description;
  if (data.brand !== undefined) product.brand = data.brand;
  if (data.slug !== undefined) product.slug = data.slug;
  if (data.featured !== undefined) product.featured = data.featured;

  await writeProductData(product);
  return product;
}

/**
 * Replace product image
 */
export async function replaceProductImage(
  id: string,
  file: File
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const base64 = `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`;

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader.upload(
      base64,
      {
        public_id: id,
        overwrite: true,
        resource_type: "image",
        transformation: [
          { width: 800, height: 800, crop: "limit", quality: "auto" },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({ secure_url: (result as any).secure_url });
      }
    );
  });

  // Update image URL in metadata
  const products = await listProducts();
  const product = products.find((p) => p.id === id);
  if (product) {
    product.image = result.secure_url;
    product.thumbnail = makeThumbnail(result.secure_url);
    await writeProductData(product);
  }

  return result.secure_url;
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<void> {
  const products = await listProducts();
  const product = products.find((p) => p.id === id);

  // Delete metadata file
  if (product) {
    try {
      await cloudinary.api.delete_resources([`${DATA_FOLDER}/${product.productId}`], {
        resource_type: "raw",
      });
    } catch {
      // Ignore
    }
  }

  // Delete image
  await cloudinary.api.delete_resources([id]);
}
