'use client';

import Image from "next/image";
import { BRANDS } from "@/data/site-data";

export default function BrandsSection() {
  const brands = [...BRANDS, ...BRANDS];

  

  return (
    <section className="bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-center text-3xl font-bold text-[#002b5c]">
          Our Trusted Brands
        </h2>

        <p className="text-center text-gray-500 mt-2">
          Authorized Distributor of Leading Smartphone Brands
        </p>

        <div className="relative mt-12 overflow-hidden">

          {/* Left Fade */}
          <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10" />

          {/* Right Fade */}
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="flex animate-brand-scroll w-max">

            {brands.map((brand, index) => (
              <div
                key={`${brand.slug}-${index}`}
                className="mx-4 flex h-20  md:56 w-26 items-center justify-center gap-4  bg-white shadow-sm transition"
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            ))}

          </div>

        </div>
      </div>
    </section>
  );
}