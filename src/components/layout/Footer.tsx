"use client";

import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react";
import { CONTACT_INFO, BRANDS } from "@/data/site-data";
import { useNavigation, type PageName } from "@/lib/store";

const QUICK_LINKS: { label: string; page: PageName }[] = [
  { label: "Home", page: "home" },
  { label: "Products", page: "products" },
  { label: "Services", page: "services" },
  { label: "Dealers", page: "dealers" },
  { label: "Contact", page: "contact" },
];

const SOCIAL_LINKS = [
  {
    icon: Facebook,
    href: "https://facebook.com",
    label: "Facebook",
  },
  {
    icon: Instagram,
    href: "https://instagram.com",
    label: "Instagram",
  },
  {
    icon: MessageCircle,
    href: `https://wa.me/${CONTACT_INFO.whatsapp}`,
    label: "WhatsApp",
  },
];

export default function Footer() {
  const { navigate } = useNavigation();

  return (
    <footer className="bg-[#001a33] text-white">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1: Logo & About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <button
              onClick={() => navigate("home")}
              className="inline-block cursor-pointer"
              aria-label="Go to Home"
            >
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-bold tracking-tight text-white lg:text-3xl">
                  SSS
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 lg:text-xs">
                  ENTERPRISES
                </span>
              </div>
            </button>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Your Trusted Wholesale Mobile Distribution Partner in Chennai. We
              supply genuine mobile phones and accessories from all major brands
              at competitive prices.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#2563EB] hover:text-white"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => navigate(link.page)}
                    className="text-sm text-white/70 transition-colors hover:text-white cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Brands */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Our Brands
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {BRANDS.map((brand) => (
                <li key={brand.slug}>
                  <span className="text-sm text-white/70">{brand.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contact Info
            </h3>
            <ul className="space-y-3">
              {CONTACT_INFO.phones.map((phone) => (
                <li key={phone} className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#2563EB]" />
                  <div>
                    <a
                      href={`tel:${phone}`}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      +91 {phone}
                    </a>
                  </div>
                </li>
              ))}

              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#2563EB]" />
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-sm text-white/70 transition-colors hover:text-white break-all"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#2563EB]" />
                <span className="text-sm leading-relaxed text-white/70">
                  {CONTACT_INFO.address}
                </span>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#2563EB]" />
                <div className="text-sm text-white/70">
                  <p>{CONTACT_INFO.hours.weekdays}</p>
                  <p>{CONTACT_INFO.hours.sunday}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-center text-sm text-white/60 sm:text-left">
            © 2025<button
              onClick={() => navigate("admin")}
              className="ml-2 text-white/60 hover:text-white/50 transition-colors cursor-pointer"
              aria-label="Admin Panel"
              title="Admin Panel"
            >
              SSS ENTERPRISES
            </button> All Rights Reserved.
          

          </p>
        
        </div>
      </div>
    </footer>
  );
}