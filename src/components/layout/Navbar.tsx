"use client";

import { useState, useEffect, useCallback } from "react";
import { Menu, X, Phone } from "lucide-react";
import { CONTACT_INFO } from "@/data/site-data";
import { useNavigation, type PageName } from "@/lib/store";
 import Image from "next/image";

const NAV_ITEMS: { label: string; page: PageName }[] = [
  { label: "Home", page: "home" },
  { label: "Products", page: "products" },
  { label: "Services", page: "services" },
  { label: "Dealers", page: "dealers" },
  { label: "Contact", page: "contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentPage, navigate } = useNavigation();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleClick = (page: PageName) => {
    setIsOpen(false);
    navigate(page);
  };

  return (
    <header
      className={`sticky top-0 z-[100] transition-shadow duration-300 ${
        scrolled ? "shadow-lg" : ""
      }`}
    >
      <nav className="relative bg-[#001a33]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => handleClick("home")}
              className="flex flex-shrink-0 items-center gap-2 cursor-pointer"
              aria-label="Go to Home"
            >
      

<div className="flex items-center">
  <Image
    src="/sss1.png"
    alt="SSS Enterprises"
    width={120}
    height={50}
    className="h-auto w-auto object-contain"
  />
</div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 lg:flex">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleClick(item.page)}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    currentPage === item.page
                      ? "bg-white/15 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Desktop Call Button */}
            <div className="hidden lg:flex">
              <a
                href={`tel:${CONTACT_INFO.phones[0]}`}
                className="flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-[#001a33] transition-colors hover:bg-[#001a33] hover:text-white border border-white/20"
              >
                <Phone className="h-4 w-4" />
                Call Now
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-md p-2 text-white lg:hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`absolute left-0 right-0 top-full z-[999] origin-top bg-[#001a33] border-t border-white/10 shadow-xl transition-all duration-300 ease-in-out lg:hidden ${
            isOpen
              ? "scale-y-100 opacity-100"
              : "pointer-events-none scale-y-0 opacity-0"
          }`}
        >
          <div className="space-y-1 px-4 py-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.page}
                onClick={() => handleClick(item.page)}
                className={`block w-full rounded-md px-3 py-3 text-left text-sm font-medium transition-colors ${
                  currentPage === item.page
                    ? "bg-white/15 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}

            <a
              href={`tel:${CONTACT_INFO.phones[0]}`}
              className="mt-3 flex items-center justify-center gap-2 rounded-md bg-[#001a33] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#001a33]"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}