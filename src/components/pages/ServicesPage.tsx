"use client";

import {
  Package,
  ShoppingCart,
  Truck,
  Building2,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import { SERVICES, SERVICE_FEATURES, BRANDS } from "@/data/site-data";
import PageHeader from "@/components/layout/PageHeader";
import { useNavigation } from "@/lib/store";
import { MessageCircle } from "lucide-react";
import { CONTACT_INFO } from "@/data/site-data";

const serviceIconMap = [
  Package,
  ShoppingCart,
  Truck,
  Building2,
  Headphones,
  ShieldCheck,
];

const featureIconMap: Record<string, React.ElementType> = {
  "shield-check": ShieldCheck,
  truck: Truck,
  package: Package,
  headphones: Headphones,
  "map-pin": () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
  ),
};

export default function ServicesPage() {
  const { navigate } = useNavigation();

  return (
    <main>
      <PageHeader
        title="Our Services"
        subtitle="Comprehensive mobile distribution solutions tailored for your business needs"
        breadcrumbs={[
          { label: "Home", href: "home" },
          { label: "Services" },
        ]}
      />

      {/* Service Cards */}
      <section className="bg-[#f8f9fa] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, index) => {
              const Icon = serviceIconMap[index];
              return (
                <div
                  key={service.image}
                  className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="h-48 bg-gradient-to-br from-[#e6f0ff] to-[#d0e4ff] flex items-center justify-center">
                    <Icon className="w-16 h-16 text-[#2563EB]" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-[#002b5c]">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Features */}
      <section className="bg-gradient-to-br from-[#002b5c] to-[#001a33] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-white text-center text-2xl lg:text-3xl font-bold">
            Why Choose Our Services?
          </h2>
          <p className="text-white/70 text-center mt-2 mb-12 max-w-2xl mx-auto">
            We go above and beyond to ensure your business gets the best service and support
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_FEATURES.map((feature) => {
              const IconComponent = featureIconMap[feature.icon] || ShieldCheck;
              return (
                <div
                  key={feature.title}
                  className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/15 transition-all"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-[#0088ff]/20 rounded-full mb-4">
                    <IconComponent className="w-6 h-6 text-[#0088ff]" />
                  </div>
                  <h3 className="text-white font-semibold text-base">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 text-sm mt-2">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-[#002b5c] text-2xl lg:text-3xl font-bold">
            Need Our Services?
          </h2>
          <p className="text-gray-600 mt-3 max-w-xl mx-auto">
            Get in touch with us to discuss your requirements and get a custom quote for your business.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/91${CONTACT_INFO.whatsapp}?text=${encodeURIComponent("Hi, I'm interested in your services. Please share more details.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
            <button
              onClick={() => navigate("contact")}
              className="inline-flex items-center gap-2 bg-[#002b5c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1d4ed8] transition-colors cursor-pointer"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

  
    </main>
  );
}