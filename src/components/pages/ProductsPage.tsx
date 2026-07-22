"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Smartphone, Star } from "lucide-react";
import { BRANDS } from "@/data/site-data";
import PageHeader from "@/components/layout/PageHeader";

interface Product {
  id: string;
  title: string;
  description: string;
  brand: string;
  slug: string;
  featured: boolean;
  image: string;
  thumbnail: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Replace with your actual WhatsApp number
  const WHATSAPP_NUMBER = "919008599797";

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedBrand !== "all") params.set("brand", selectedBrand);
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedBrand, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleWhatsAppEnquiry = (productName: string, productBrand: string) => {
    const message = `Hi, I'm interested in ${productBrand} ${productName}. Please share the wholesale price and availability.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  const filteredProducts = products;

  return (
    <main>
      <PageHeader
        title="Our Products"
        subtitle="Browse our wide range of genuine mobile phones from top brands at competitive wholesale prices"
        breadcrumbs={[
          { label: "Home", href: "home" },
          { label: "Products" },
        ]}
      />

      {/* Filters */}
      <section className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative w-full max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              aria-label="Search products"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedBrand("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                selectedBrand === "all"
                  ? "bg-[#002b5c] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Brands
            </button>
            {BRANDS.map((brand) => (
              <button
                key={brand.slug}
                onClick={() => setSelectedBrand(brand.slug)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  selectedBrand === brand.slug
                    ? "bg-[#002b5c] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="bg-[#f8f9fa] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!loading && (
            <p className="text-sm text-gray-500 mb-6">
              Showing {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""}
            </p>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse border border-gray-100"
                >
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-16" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-9 bg-gray-200 rounded-lg mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group border border-gray-100 flex flex-col"
                >
                  {/* Image - Square aspect ratio like admin panel */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    
                    
                    
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <img
                        src={product.thumbnail || product.image}
                        alt={product.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  
                  {/* Info - Like admin panel */}
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-xs font-medium text-[#2563EB] uppercase tracking-wide">
                      {product.brand}
                    </p>
                    <h3 className="text-sm font-semibold text-[#002b5c] mt-1 line-clamp-2 min-h-[40px]">
                      {product.title}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">
                        {product.description}
                      </p>
                    )}
                    
                    {/* Enquiry Button */}
                    <button
                      onClick={() => handleWhatsAppEnquiry(product.title, product.brand)}
                      className="mt-4 w-full bg-[#002b5c] hover:bg-[#002b5c] text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                   
                      Enquire Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No products found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedBrand("all");
                  setSearchQuery("");
                }}
                className="mt-4 text-[#002b5c] hover:underline text-sm font-medium cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>


    </main>
  );
}