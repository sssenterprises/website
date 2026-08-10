import { NextRequest, NextResponse } from "next/server";
import {
  updateProduct,
  deleteProduct,
  replaceProductImage,
  listProducts,
  debugListFolderContents,
} from "@/lib/cloudinary-products";

export const dynamic = "force-dynamic";

// PUT /api/products/[id] — update product metadata or replace image
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contentType = req.headers.get("content-type") || "";

    // If multipart/form-data → replacing the image
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const title = (formData.get("title") as string)?.trim();
      const description = (formData.get("description") as string)?.trim();
      const brand = (formData.get("brand") as string)?.trim();
      const slug = (formData.get("slug") as string)?.trim();
      const featured = formData.get("featured") === "true";

      if (file) {
        // Replace image, then update metadata
        await replaceProductImage(id, file);
      }

      const product = await updateProduct(id, {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(brand !== undefined && { brand }),
        ...(slug !== undefined && { slug }),
        ...(featured !== undefined && { featured }),
      });

      return NextResponse.json({ success: true, product });
    }

    // If JSON → just update metadata
    const body = await req.json();
    const product = await updateProduct(id, body);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Error updating product:", error);
    const message = error instanceof Error ? error.message : "Failed to update product";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log(`🗑️ DELETE request received for product ID: ${id}`);
    
    await deleteProduct(id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete product",
      },
      { status: 500 }
    );
  }
}

// GET /api/products/[id] — get a single product
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const products = await listProducts();
    const product = products.find((p) => p.id === id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// Debug endpoint to list folder contents
export async function HEAD(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await debugListFolderContents();
    return NextResponse.json({ success: true, message: "Debug info logged" });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { success: false, message: "Debug failed" },
      { status: 500 }
    );
  }
}