import { v2 as cloudinary } from "cloudinary";

function ensureCloudinaryConfigured() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return { cloudName, apiKey, apiSecret };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }

  return "Unknown error";
}

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
  return imageUrl.replace("/upload/", "/upload/w_400,h_400,c_fill,q_auto,f_webp/");
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
  ensureCloudinaryConfigured();

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
  ensureCloudinaryConfigured();

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
  ensureCloudinaryConfigured();

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
      },
      (error, result) => {
        if (error) reject(error);
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
  ensureCloudinaryConfigured();

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
 * Delete a product - COMPLETE FIXED VERSION
 * Deletes from both Assets and Folders
 */
export async function deleteProduct(id: string): Promise<void> {
  ensureCloudinaryConfigured();

  const products = await listProducts();
  const product = products.find((p) => p.id === id);

  if (!product) {
    throw new Error(`Product not found: ${id}`);
  }

  console.log(`🗑️ Deleting product: ${product.productId}`);
  console.log(`📁 Full public_id: ${product.id}`);

  // 1. Delete metadata JSON file from data folder
  const metadataResult = await cloudinary.api.delete_resources(
    [`${DATA_FOLDER}/${product.productId}`],
    {
      resource_type: "raw",
      type: "upload",
    }
  );
  console.log("📄 Metadata delete result:", metadataResult);

  // 2. Delete the image using the FULL public_id (including folder path)
  const fullPublicId = product.id; // "sss-enterprises/products/x6ujchak6nwfbzvkvuo3"
  
  console.log(`🖼️ Attempting to delete image with FULL public_id: ${fullPublicId}`);
  
  // METHOD 1: Delete using api.delete_resources (most reliable)
  const imageResult = await cloudinary.api.delete_resources(
    [fullPublicId],
    {
      resource_type: "image",
      type: "upload",
      invalidate: true, // Force CDN cache invalidation
    }
  );

  console.log("🗑️ Image delete result (Method 1):", imageResult);

  // Check if deletion was successful
  const deletionStatus = imageResult.deleted?.[fullPublicId];
  
  if (deletionStatus === "deleted") {
    console.log(`✅ Image deleted successfully from Cloudinary (Assets & Folders)`);
  } else if (deletionStatus === "not_found") {
    console.log(`⚠️ Image not found at ${fullPublicId}, trying alternative methods...`);
    
    // METHOD 2: Try with just the filename
    const filename = fullPublicId.split("/").pop();
    if (filename) {
      console.log(`🔄 Trying with just filename: ${filename}`);
      
      try {
        const altResult = await cloudinary.uploader.destroy(filename, {
          resource_type: "image",
          invalidate: true,
        });
        console.log("🗑️ Alternative deletion result (Method 2):", altResult);
        
        if (altResult.result === "ok") {
          console.log(`✅ Image deleted successfully using filename`);
        }
      } catch (error) {
        console.log("Method 2 failed:", error);
      }
    }
    
    // METHOD 3: Try with the full path using uploader.destroy
    console.log(`🔄 Trying with full path: ${fullPublicId}`);
    try {
      const fullPathResult = await cloudinary.uploader.destroy(fullPublicId, {
        resource_type: "image",
        invalidate: true,
      });
      console.log("🗑️ Full path deletion result (Method 3):", fullPathResult);
      
      if (fullPathResult.result === "ok") {
        console.log(`✅ Image deleted successfully using full path`);
      }
    } catch (error) {
      console.log("Method 3 failed:", error);
    }

    // METHOD 4: Try to find and delete by URL
    console.log(`🔄 Trying to extract public_id from URL: ${product.image}`);
    try {
      // Extract public_id from URL
      const url = new URL(product.image);
      const pathParts = url.pathname.split('/');
      // Find the 'upload' part and get everything after the version
      const uploadIndex = pathParts.indexOf('upload');
      if (uploadIndex !== -1 && uploadIndex + 2 < pathParts.length) {
        // Skip 'upload' and version number
        const publicIdFromUrl = pathParts.slice(uploadIndex + 2).join('/');
        const publicIdWithoutExtension = publicIdFromUrl.replace(/\.[^/.]+$/, '');
        console.log(`📝 Extracted public_id from URL: ${publicIdWithoutExtension}`);
        
        const urlResult = await cloudinary.uploader.destroy(publicIdWithoutExtension, {
          resource_type: "image",
          invalidate: true,
        });
        console.log("🗑️ URL-based deletion result (Method 4):", urlResult);
        
        if (urlResult.result === "ok") {
          console.log(`✅ Image deleted successfully using URL extraction`);
        }
      }
    } catch (error) {
      console.log("Method 4 failed:", error);
    }
  } else {
    console.warn(`⚠️ Unexpected deletion status: ${deletionStatus}`);
  }

  // 3. Verify the image is actually deleted
  console.log("🔍 Verifying deletion...");
  try {
    const verifyResult = await cloudinary.api.resource(fullPublicId, {
      resource_type: "image",
    });
    console.log("❌ Image still exists:", verifyResult);
  } catch (error: any) {
    if (error.error?.message?.includes("Not Found") || error.http_code === 404) {
      console.log("✅ Image successfully deleted (verification passed)");
    } else {
      console.log("⚠️ Verification error:", error);
    }
  }

  console.log(`✅ Product ${product.productId} deleted successfully from both Assets and Folders`);
}

/**
 * Debug function to list all products in the folder
 */
export async function debugListFolderContents(): Promise<void> {
  console.log("🔍 Listing contents of folder:", FOLDER);
  
  const result = await cloudinary.api.resources({
    type: "upload",
    prefix: FOLDER + "/",
    resource_type: "image",
    max_results: 100,
  });
  
  console.log(`📁 Found ${result.resources.length} images in folder`);
  result.resources.forEach((resource: any) => {
    console.log(`  - ${resource.public_id} (${resource.format})`);
  });
  
  // Also list data files
  const dataResult = await cloudinary.api.resources({
    type: "upload",
    prefix: DATA_FOLDER + "/",
    resource_type: "raw",
    max_results: 100,
  });
  
  console.log(`📄 Found ${dataResult.resources.length} data files in folder`);
  dataResult.resources.forEach((resource: any) => {
    console.log(`  - ${resource.public_id}`);
  });
}