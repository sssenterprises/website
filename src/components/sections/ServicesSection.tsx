'use client';

import {
  Package,
  ShoppingCart,
  Truck,
  Building2,
  Headphones,
  ShieldCheck,
} from 'lucide-react';
import { SERVICES } from '@/data/site-data';
import type { LucideIcon } from 'lucide-react';

const serviceIconMap: LucideIcon[] = [
  Package,
  ShoppingCart,
  Truck,
  Building2,
  Headphones,
  ShieldCheck,
];

export default function ServicesSection() {
  return (
    <section id="services" className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl lg:text-3xl font-bold text-[#002b5c]">
          Our Services
        </h2>
        <p className="text-center text-gray-600 mt-2 mb-12">
          Comprehensive mobile distribution solutions for your business
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, index) => {
            const Icon = serviceIconMap[index];
            return (
              <div
                key={service.image}
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#e6f0ff] rounded-lg">
                  <Icon className="w-6 h-6 text-[#2563EB]" />
                </div>
                <h3 className="text-lg font-semibold text-[#002b5c] mt-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}