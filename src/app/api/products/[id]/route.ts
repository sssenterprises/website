import { NextRequest, NextResponse } from "next/server";
import {
  updateProduct,
  deleteProduct,
  replaceProductImage,
  listProducts,
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
    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] — delete product from Cloudinary
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteProduct(id);
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}