import { NextRequest, NextResponse } from "next/server";
import {
  listProducts,
  createProduct,
} from "@/lib/cloudinary-products";

export const dynamic = "force-dynamic";

// GET /api/products — list products (public, caption-only = real products)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brand = searchParams.get("brand") || undefined;
    const search = searchParams.get("search") || undefined;
    const featured = searchParams.get("featured");

    const products = await listProducts({
      brand,
      search,
      featured: featured === "true" ? true : undefined,
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products — create product (admin: upload image + store metadata)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || "";
    const brand = (formData.get("brand") as string)?.trim();
    const slug = (formData.get("slug") as string)?.trim();
    const featured = formData.get("featured") === "true";
    const file = formData.get("file") as File | null;

    if (!title) {
      return NextResponse.json(
        { success: false, message: "Product title is required" },
        { status: 400 }
      );
    }

    if (!brand || !slug) {
      return NextResponse.json(
        { success: false, message: "Brand is required" },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Product image is required" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Only JPEG, PNG, WebP, and GIF images are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Image must be less than 10MB" },
        { status: 400 }
      );
    }

    const product = await createProduct({
      title,
      description,
      brand,
      slug,
      featured,
      file,
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 }
    );
  }
}