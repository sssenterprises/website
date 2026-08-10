"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Mail, Star } from "lucide-react";
import HeroSection from "@/components/sections/HeroSection";
import BrandsSection from "@/components/sections/BrandsSection";
import StatsSection from "@/components/sections/StatsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import { useNavigation } from "@/lib/store";

interface CloudProduct {
  id: string;
  title: string;
  description: string;
  brand: string;
  slug: string;
  featured: boolean;
  image: string;
  thumbnail: string;
}

function PopularProductsPreview() {
  const { navigate } = useNavigation();
  const [products, setProducts] = useState<CloudProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Replace with your actual WhatsApp number (with country code, no + sign)
  const WHATSAPP_NUMBER = "919876543210"; // Example: 91 for India, then 10-digit number

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products?featured=true");
      const data = await res.json();
      if (data.success && data.products.length > 0) {
        setProducts(data.products.slice(0, 8));
      } else {
        // No featured — show latest 8
        const res2 = await fetch("/api/products");
        const data2 = await res2.json();
        if (data2.success) {
          setProducts(data2.products.slice(0, 8));
        }
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleWhatsAppEnquiry = (productName: string, productBrand: string) => {
    // Create WhatsApp message
    const message = `Hello! I'm interested in the ${productBrand} ${productName}. Can you please share the wholesale price and availability?`;
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  if (products.length === 0 && !loading) return null;

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-xl sm:text-2xl lg:text-3xl font-bold text-[#002b5c]">
          Popular Products
        </h2>
        <p className="text-center text-gray-600 mt-2 mb-6 sm:mb-10">
          Browse our top-selling mobile phones from leading brands
        </p>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse border border-gray-100"
              >
                <div className="aspect-square bg-gray-200" />
                <div className="p-2 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="h-2 sm:h-3 bg-gray-200 rounded w-12 sm:w-16" />
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-8 sm:h-10 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group border border-gray-100 flex flex-col"
              >
                {/* Image - Square aspect ratio like admin panel */}
                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
         
                  
              
                  
                  <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
                    <img
                      src={product.thumbnail || product.image}
                      alt={product.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                
                {/* Info - Like admin panel */}
                <div className="p-2 sm:p-4 flex flex-col flex-1">
                  <p className="text-[14px] sm:text-xs font-medium text-[#002b5c] uppercase tracking-wide truncate">
                    {product.brand}
                  </p>
                  <h3 className="text-[12px] sm:text-sm font-semibold text-[#002b5c] mt-0.5 sm:mt-1 line-clamp-2 min-h-[24px] sm:min-h-[40px]">
                    {product.title}
                  </h3>
                  {product.description && (
                    <p className="text-[8px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1 line-clamp-2 flex-1 hidden sm:block">
                      {product.description}
                    </p>
                  )}
                  
                  {/* WhatsApp Enquiry Button */}
                  <button
                    onClick={() => handleWhatsAppEnquiry(product.title, product.brand)}
                    className="mt-2 sm:mt-4 w-full bg-[#002b5c] hover:bg-[#002b5c] text-white text-[13px] sm:text-sm font-medium py-1.5 sm:py-2.5 px-2 sm:px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2"
                  >
                
                    Enquiry
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8 sm:mt-10">
          <button
            onClick={() => navigate("products")}
            className="inline-flex items-center gap-2 bg-[#002b5c] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-[#002b5c] transition-colors cursor-pointer text-sm sm:text-base"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { navigate } = useNavigation();

  return (
    <section className="bg-gradient-to-br from-[#002b5c] to-[#001a33] py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-white text-2xl lg:text-3xl font-bold">
            Ready to Partner With Us?
          </h2>
          <p className="text-white/70 mt-3 max-w-xl mx-auto">
            Join 250+ dealers who trust SSS Enterprises for genuine mobile phones
            at the best wholesale prices.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("dealers")}
              className="bg-white text-[#002b5c] hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Become a Dealer
            </button>
            <button
              onClick={() => navigate("contact")}
              className="border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <BrandsSection />
      <StatsSection />
      <PopularProductsPreview />
      <ServicesSection />
      <CTASection />
    </main>
  );
}