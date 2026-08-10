"use client";

import { CheckCircle, Package, Truck } from "lucide-react";
import { useNavigation } from "@/lib/store";

export default function HeroSection() {
  const { navigate } = useNavigation();

  return (
    <section
      id="home"
      className="bg-[#002b5c] relative min-h-[90vh] flex items-center overflow-hidden"
      style={{
        backgroundImage: `url('/images/herosss2.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-[#002b5c] md:bg-[#002b5c]/70 lg:bg-[#002b5c]/10" />
      
  
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex justify-center lg:justify-start">
          {/* Left content */}
          <div className="w-full max-w-2xl text-center lg:text-left">
            <span className="inline-block text-white/80 border border-white/20 rounded-full px-4 py-1.5 text-base mb-6">
              Wholesale Mobile Distributor  
            </span>

            <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Chennai's Trusted{" "}
              <span className="text-[#0088ff]">Wholesale Mobile</span>{" "}
              Distributor
            </h1>

            <p className="text-white/80 text-lg mt-4 max-w-lg mx-auto lg:mx-0">
              Supplying Genuine Mobile Phones to individuals, Dealers, Retailers & Bulk Buyers Across India
            </p>

            {/* Key selling points */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-white/90">
                <CheckCircle className="w-5 h-5 text-[#0088ff]" />
                <span className="text-sm font-medium">Latest Models Available</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Package className="w-5 h-5 text-[#0088ff]" />
                <span className="text-sm font-medium">Bulk Orders Accepted</span>
              </div>
            </div>

            <div className="mt-8 flex flex-row items-center justify-center lg:justify-start gap-3 lg:gap-5">
              <button
                onClick={() => navigate("products")}
                className="flex-1 lg:flex-none bg-white text-[#002b5c] hover:bg-[#002b5c] hover:text-white
                px-4 py-3 text-sm
                lg:px-8 lg:py-4 lg:text-base
                rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View Product 
              </button>

              <button
                onClick={() => navigate("contact")}
                className="flex-1 lg:flex-none border-2 border-white text-white hover:bg-white/10
                px-4 py-3 text-sm
                lg:px-8 lg:py-4 lg:text-base
                rounded-lg font-semibold transition-all duration-300"
              >
                Get Wholesale Price
              </button>
            </div>

            {/* Trust indicator */}
            <div className="mt-6 flex items-center gap-6 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Truck className="w-4 h-4" />
                <span>B2B Supply</span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <span className="font-bold text-[#0088ff]">500+</span>
                <span>Dealers Served</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}