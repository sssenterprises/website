'use client';

import { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
} from 'lucide-react';
import { CONTACT_INFO } from '@/data/site-data';

const SUBJECT_OPTIONS = [
  'General Enquiry',
  'Product Enquiry',
  'Dealer Partnership',
  'Complaint',
  'Other',
];

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: 'General Enquiry',
    message: '',
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
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Enquiry',
        message: '',
      });
    } catch {
      // Silently handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-center text-2xl lg:text-3xl font-bold text-[#002b5c]">
          Contact Us
        </h2>
        <p className="text-center text-gray-600 mt-2 mb-12">
          Get in touch with us for any enquiries or partnership opportunities
        </p>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Info + Form */}
          <div>
            {/* Contact Info Cards */}
            <div className="space-y-3">
              {/* Phone Card */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#f8f9fa] border border-gray-100">
                <div className="bg-[#2563EB] rounded-lg w-10 h-10 flex items-center justify-center text-white shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#002b5c]">Phone</p>
                  <p className="text-gray-600 text-sm mt-0.5">
                    {CONTACT_INFO.phones.map((p) => `+91 ${p}`).join(' / ')}
                  </p>
                </div>
              </div>

              {/* Email Card */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#f8f9fa] border border-gray-100">
                <div className="bg-[#2563EB] rounded-lg w-10 h-10 flex items-center justify-center text-white shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#002b5c]">Email</p>
                  <p className="text-gray-600 text-sm mt-0.5">
                    {CONTACT_INFO.email}
                  </p>
                </div>
              </div>

              {/* Address Card */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#f8f9fa] border border-gray-100">
                <div className="bg-[#2563EB] rounded-lg w-10 h-10 flex items-center justify-center text-white shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#002b5c]">Address</p>
                  <p className="text-gray-600 text-sm mt-0.5">
                    {CONTACT_INFO.address}
                  </p>
                </div>
              </div>

              {/* Hours Card */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#f8f9fa] border border-gray-100">
                <div className="bg-[#2563EB] rounded-lg w-10 h-10 flex items-center justify-center text-white shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#002b5c]">
                    Business Hours
                  </p>
                  <p className="text-gray-600 text-sm mt-0.5">
                    {CONTACT_INFO.hours.weekdays}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {CONTACT_INFO.hours.sunday}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="mt-8">
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <p className="text-green-700 font-semibold text-lg">
                    Message Sent!
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    Thank you for reaching out. We will get back to you soon.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-[#2563EB] hover:text-[#1d4ed8] text-sm font-medium underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Your email"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Your phone number"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
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
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white"
                    >
                      {SUBJECT_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
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
                      required
                      rows={4}
                      placeholder="Your message..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#2563EB] text-white py-3 px-8 rounded-lg font-semibold hover:bg-[#1d4ed8] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column - Map + Quick Actions */}
          <div>
            {/* Map */}
            <div className="rounded-xl overflow-hidden h-80 bg-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.7!2d80.2!3d13.08!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDA0JzQ4LjAiTiA4MMKwMTInMDAuMCJF!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="320"
                style={{ border: 0, borderRadius: 12 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SSS Enterprises Location"
              />
            </div>

            {/* Quick Action Cards */}
            <div className="mt-6">
              {/* WhatsApp Card */}
              <a
                href={`https://wa.me/91${CONTACT_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 hover:bg-green-100 transition-colors"
              >
                <div className="bg-green-500 rounded-lg w-10 h-10 flex items-center justify-center text-white shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-green-800">
                    Chat on WhatsApp
                  </p>
                  <p className="text-green-700 text-sm">
                    +91 {CONTACT_INFO.whatsapp}
                  </p>
                </div>
              </a>

              {/* Call Card */}
              <a
                href={`tel:+91${CONTACT_INFO.phones[0]}`}
                className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3 mt-3 hover:bg-blue-100 transition-colors"
              >
                <div className="bg-[#2563EB] rounded-lg w-10 h-10 flex items-center justify-center text-white shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-blue-800">
                    Call Us Now
                  </p>
                  <p className="text-blue-700 text-sm">
                    +91 {CONTACT_INFO.phones[0]}
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}