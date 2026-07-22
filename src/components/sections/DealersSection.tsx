'use client';

import { useState } from 'react';
import {
  TrendingDown,
  BadgeCheck,
  Clock,
  Handshake,
  CheckCircle,
} from 'lucide-react';
import { DEALER_WHY_US, DEALER_BENEFITS } from '@/data/site-data';

const ICON_MAP: Record<string, React.ElementType> = {
  'trending-down': TrendingDown,
  'badge-check': BadgeCheck,
  clock: Clock,
  handshake: Handshake,
};

interface DealerFormData {
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  message: string;
}

export default function DealersSection() {
  const [formData, setFormData] = useState<DealerFormData>({
    businessName: '',
    contactPerson: '',
    phone: '',
    email: '',
    city: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/dealer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
      setFormData({
        businessName: '',
        contactPerson: '',
        phone: '',
        email: '',
        city: '',
        message: '',
      });
    } catch {
      // Silently handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="dealers"
      className="bg-gradient-to-br from-[#002b5c] to-[#001a33] py-16 lg:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-white text-center text-2xl lg:text-3xl font-bold">
          Become Our Partner
        </h2>
        <p className="text-white/70 text-center mt-2 mb-12">
          Join our growing network of authorized dealers and distributors
        </p>

        {/* Why Partner With Us */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {DEALER_WHY_US.map((item) => {
            const IconComponent = ICON_MAP[item.icon] || BadgeCheck;
            return (
              <div
                key={item.icon}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/15 transition-all"
              >
                <IconComponent className="text-[#0088ff] text-3xl mb-3 mx-auto" />
                <h3 className="text-white font-semibold text-base">
                  {item.title}
                </h3>
                <p className="text-white/70 text-sm mt-2">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Dealer Benefits */}
        <div className="mb-16">
          <h3 className="text-white text-xl font-bold mb-6 text-center">
            Dealer Benefits
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {DEALER_BENEFITS.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="text-green-400 w-5 h-5 mt-0.5 shrink-0" />
                <span className="text-white/90 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dealer Registration Form */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-white text-xl font-bold mb-6 text-center">
            Dealer Registration
          </h3>
          {submitted ? (
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 text-center">
              <CheckCircle className="text-green-400 w-10 h-10 mx-auto mb-3" />
              <p className="text-white font-semibold text-lg">
                Registration Submitted!
              </p>
              <p className="text-white/70 text-sm mt-1">
                Thank you for your interest. We will contact you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-[#2563EB] hover:text-[#1d4ed8] text-sm font-medium underline"
              >
                Submit another registration
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-white/80 text-sm font-medium mb-1.5 block">
                  Business Name
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your business name"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-white/80 text-sm font-medium mb-1.5 block">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  required
                  placeholder="Enter contact person name"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-white/80 text-sm font-medium mb-1.5 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter phone number"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-white/80 text-sm font-medium mb-1.5 block">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email address"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-white/80 text-sm font-medium mb-1.5 block">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Enter your city"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-white/80 text-sm font-medium mb-1.5 block">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about your business..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2563EB] text-white py-3 rounded-lg font-semibold hover:bg-[#1d4ed8] transition-colors mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Registration'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}