'use client';

import { useState } from 'react';
import { Search, Smartphone } from 'lucide-react';
import { PRODUCTS, BRANDS } from '@/data/site-data';

export default function ProductsSection() {
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesBrand =
      selectedBrand === 'all' || product.slug === selectedBrand;
    const matchesSearch =
      searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  return (
    <section id="products" className="bg-[#f8f9fa] py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 className="text-center text-2xl lg:text-3xl font-bold text-[#002b5c]">
          Our Products
        </h2>
        <p className="text-center text-gray-600 mt-2 mb-8">
          Browse our wide range of genuine mobile phones from top brands
        </p>

        {/* Filter Bar */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
            />
          </div>

          {/* Brand Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedBrand('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedBrand === 'all'
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-[#2563EB]'
              }`}
            >
              All
            </button>
            {BRANDS.map((brand) => (
              <button
                key={brand.slug}
                onClick={() => setSelectedBrand(brand.slug)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedBrand === brand.slug
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-[#2563EB]'
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              {/* Image Area */}
              <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
                <span className="absolute top-3 left-3 bg-[#002b5c] text-white text-xs px-2 py-1 rounded-md">
                  {product.brand}
                </span>
                <Smartphone className="w-16 h-16 text-gray-300 group-hover:text-[#2563EB] transition-colors" />
              </div>

              {/* Content Area */}
              <div className="p-4">
                <p className="text-xs font-medium text-[#2563EB] uppercase tracking-wide">
                  {product.brand}
                </p>
                <h3 className="text-base font-semibold text-[#002b5c] mt-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Price on Request</p>
                <button className="mt-3 w-full bg-[#2563EB] text-white text-sm py-2 rounded-lg hover:bg-[#1d4ed8] transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No products found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSelectedBrand('all');
                setSearchQuery('');
              }}
              className="mt-4 text-[#2563EB] hover:underline text-sm font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}