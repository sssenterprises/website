"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { CONTACT_INFO } from "@/data/site-data";
import PageHeader from "@/components/layout/PageHeader";

const SUBJECT_OPTIONS = [
  "General Enquiry",
  "Product Enquiry",
  "Dealer Partnership",
  "Complaint",
  "Other",
];

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    phone: "",
    email: "",
    subject: "General Enquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "General Enquiry",
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
        title="Contact Us"
        subtitle="Get in touch with us for any enquiries, partnerships, or support"
        breadcrumbs={[
          { label: "Home", href: "home" },
          { label: "Contact Us" },
        ]}
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left Column - Contact Info (2 cols) */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-[#002b5c] mb-2">
                Get In Touch
              </h2>
              <p className="text-gray-600 text-sm mb-8">
                Have questions? We&apos;d love to hear from you. Reach out through any of the channels below.
              </p>

              <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#f8f9fa] border border-gray-100">
                  <div className="bg-[#002b5c] rounded-lg w-10 h-10 flex items-center justify-center text-white shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#002b5c]">Call Us</p>
                    {CONTACT_INFO.phones.map((p) => (
                      <a
                        key={p}
                        href={`tel:+91${p}`}
                        className="text-gray-600 text-sm hover:text-[#002b5c] transition-colors block"
                      >
                        +91 {p}
                      </a>
                    ))}
                  </div>
                </div>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/91${CONTACT_INFO.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-xl bg-green-50 border border-green-200 hover:bg-green-100 transition-colors"
                >
                  <div className="bg-green-500 rounded-lg w-10 h-10 flex items-center justify-center text-white shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-green-800">WhatsApp</p>
                    <p className="text-green-700 text-sm">+91 {CONTACT_INFO.whatsapp}</p>
                  </div>
                </a>

                {/* Email */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#f8f9fa] border border-gray-100">
                  <div className="bg-[#002b5c] rounded-lg w-10 h-10 flex items-center justify-center text-white shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#002b5c]">Email Us</p>
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="text-gray-600 text-sm hover:text-[#002b5c] transition-colors break-all"
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#f8f9fa] border border-gray-100">
                  <div className="bg-[#002b5c] rounded-lg w-10 h-10 flex items-center justify-center text-white shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#002b5c]">Our Location</p>
                    <p className="text-gray-600 text-sm">{CONTACT_INFO.address}</p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#f8f9fa] border border-gray-100">
                  <div className="bg-[#002b5c] rounded-lg w-10 h-10 flex items-center justify-center text-white shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#002b5c]">Business Hours</p>
                    <p className="text-gray-600 text-sm">{CONTACT_INFO.hours.weekdays}</p>
                    <p className="text-gray-600 text-sm">{CONTACT_INFO.hours.sunday}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form + Map (3 cols) */}
            <div className="lg:col-span-3">
              {/* Contact Form */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-[#002b5c] mb-2">
                  Send Us a Message
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  Fill out the form and we&apos;ll get back to you as soon as possible.
                </p>

                {submitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                    <p className="text-green-800 font-semibold text-xl">
                      Message Sent!
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      Thank you for reaching out. We will get back to you soon.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 text-[#002b5c] hover:text-[#1d4ed8] text-sm font-medium underline cursor-pointer"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Your name"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#002b5c] focus:border-transparent"
                        />
                      </div>
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
                          placeholder="Your phone number"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#002b5c] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#002b5c] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                          Subject
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#002b5c] focus:border-transparent bg-white"
                        >
                          {SUBJECT_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Write your message here..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#002b5c] focus:border-transparent resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#002b5c] text-white py-3 px-8 rounded-lg font-semibold hover:bg-[#1d4ed8] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </div>

              {/* Map */}
              <div>
                <h2 className="text-2xl font-bold text-[#002b5c] mb-2">
                  Our Location
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  Visit us at our office in Anna Nagar West, Chennai
                </p>

                <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.7535!2d80.2056!3d13.0827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265e4e0e3b0e1%3A0x8e5c3c5f7f8a9e2d!2sAnna%20Nagar%20West%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="SSS Enterprises Location"
                  />
                </div>

                <a
                  href="https://www.google.com/maps/search/SSS+Enterprises+Anna+Nagar+West+Chennai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-[#002b5c] hover:text-[#1d4ed8] text-sm font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}