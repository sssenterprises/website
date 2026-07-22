import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SSS Enterprises | Trusted Mobile Distribution Partner",
  description:
    "SSS Enterprises is your trusted wholesale mobile distribution partner in Chennai. Genuine products, competitive prices, fast delivery, and reliable service for 250+ dealers.",
  keywords: [
    "SSS Enterprises",
    "wholesale mobile distribution",
    "mobile phones Chennai",
    "Apple distributor",
    "Samsung distributor",
    "bulk mobile orders",
    "mobile dealer",
  ],
  authors: [{ name: "SSS Enterprises" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "SSS Enterprises | Trusted Mobile Distribution Partner",
    description:
      "Your trusted wholesale mobile distribution partner. Genuine Products, Competitive Prices, Fast Delivery.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}