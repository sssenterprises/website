import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, businessName, phone, email, gst, city, businessType, message } = body;

    if (!fullName || !businessName || !phone || !email || !city) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save to database
    await db.dealerSubmission.create({
      data: { fullName, businessName, phone, email, gst, city, businessType, message },
    });

    console.log("[Dealer Registration]", {
      fullName,
      businessName,
      phone,
      email,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Your dealer application has been submitted. Our team will contact you within 24 hours.",
    });
  } catch (error) {
    console.error("Dealer form error:", error);
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}