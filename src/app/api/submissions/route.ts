import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const contacts = await db.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    const dealers = await db.dealerSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ success: true, contacts, dealers });
  } catch (error) {
    console.error("GET /api/submissions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}