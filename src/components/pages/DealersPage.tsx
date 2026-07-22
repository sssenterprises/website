"use client";

import { useState } from "react";
import {
  TrendingDown,
  BadgeCheck,
  Clock,
  Handshake,
  CheckCircle,
  Smartphone,
  MessageCircle,
} from "lucide-react";
import { DEALER_WHY_US, DEALER_BENEFITS, BRANDS, CONTACT_INFO } from "@/data/site-data";
import PageHeader from "@/components/layout/PageHeader";
import { useNavigation } from "@/lib/store";

const ICON_MAP: Record<string, React.ElementType> = {
  "trending-down": TrendingDown,
  "badge-check": BadgeCheck,
  clock: Clock,
  handshake: Handshake,
};

interface DealerFormData {
  fullName: string;
  businessName: string;
  phone: string;
  email: string;
  gst: string;
  city: string;
  businessType: string;
  message: string;
}

export default function DealersPage() {
  const { navigate } = useNavigation();
  const [formData, setFormData] = useState<DealerFormData>({
    fullName: "",
    businessName: "",
    phone: "",
    email: "",
    gst: "",
    city: "",
    businessType: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/dealer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
      setFormData({
        fullName: "",
        businessName: "",
        phone: "",
        email: "",
        gst: "",
        city: "",
        businessType: "",
        message: "",
      });
    } catch {
      // Silently handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <PageHeader
        title="Become Our Partner"
        subtitle="Join our growing network of authorized dealers and distributors across Tamil Nadu"
        breadcrumbs={[
          { label: "Home", href: "home" },
          { label: "Dealers" },
        ]}
      />

      {/* Why Partner With Us */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl lg:text-3xl font-bold text-[#002b5c]">
            Why Partner With Us?
          </h2>
          <p className="text-center text-gray-600 mt-2 mb-12">
            Discover the advantages of partnering with SSS Enterprises
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEALER_WHY_US.map((item) => {
              const IconComponent = ICON_MAP[item.icon] || BadgeCheck;
              return (
                <div
                  key={item.icon}
                  className="text-center p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-[#e6f0ff] rounded-full mb-4">
                    <IconComponent className="w-7 h-7 text-[#2563EB]" />
                  </div>
                  <h3 className="font-semibold text-[#002b5c] text-base">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dealer Benefits */}
      <section className="bg-[#f8f9fa] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#002b5c]">
                Dealer Benefits
              </h2>
              <p className="text-gray-600 mt-2 mb-8">
                As an authorized dealer, you get access to exclusive benefits
              </p>
              <div className="space-y-4">
                {DEALER_BENEFITS.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 w-5 h-5 mt-0.5 shrink-0" />
                    <span className="text-gray-700 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-[#002b5c] to-[#001a33] rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6">Our Network</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#0088ff]">250+</p>
                  <p className="text-white/70 text-sm mt-1">Active Dealers</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#0088ff]">10+</p>
                  <p className="text-white/70 text-sm mt-1">Brands</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#0088ff]">350+</p>
                  <p className="text-white/70 text-sm mt-1">Mobile Models</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#0088ff]">2+</p>
                  <p className="text-white/70 text-sm mt-1">Years Experience</p>
                </div>
              </div>
              <div className="mt-8">
                <a
                  href={`https://wa.me/91${CONTACT_INFO.whatsapp}?text=${encodeURIComponent("Hi, I'm interested in becoming a dealer. Please share details.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Quick Enquiry on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dealer Registration Form */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl lg:text-3xl font-bold text-[#002b5c]">
            Dealer Registration
          </h2>
          <p className="text-center text-gray-600 mt-2 mb-10">
            Fill the form below and our team will contact you shortly
          </p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <CheckCircle className="text-green-500 w-12 h-12 mx-auto mb-4" />
              <p className="text-green-800 font-semibold text-xl">
                Registration Submitted!
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Thank you for your interest in partnering with SSS Enterprises.
                Our team will contact you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-[#2563EB] hover:text-[#1d4ed8] text-sm font-medium underline cursor-pointer"
              >
                Submit another registration
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                    placeholder="Your business name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="10-digit mobile number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    GST Number
                  </label>
                  <input
                    type="text"
                    name="gst"
                    value={formData.gst}
                    onChange={handleChange}
                    placeholder="e.g. 33AFDPS2813M1ZY"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Your city"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Business Type
                </label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white"
                >
                  <option value="">Select business type</option>
                  <option value="retailer">Retailer</option>
                  <option value="distributor">Distributor</option>
                  <option value="wholesaler">Wholesaler</option>
                  <option value="corporate">Corporate Buyer</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about your business and requirements..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#002b5c] text-white py-3.5 rounded-lg font-semibold hover:bg-[#002b5c] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-base"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      </section>

  
    </main>
  );
}