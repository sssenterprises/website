"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import {
  ArrowLeft,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Upload,
  Loader2,
  Star,
  Check,
  LogOut,
  Package,
  ImageIcon,
  Eye,
  Home,
} from "lucide-react";
import { useNavigation } from "@/lib/store";
import { BRANDS } from "@/data/site-data";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Product {
  id: string;       // Cloudinary public_id
  title: string;    // caption
  description: string;
  brand: string;
  slug: string;
  featured: boolean;
  image: string;    // secure_url
  thumbnail: string;
  createdAt: string;
}

const ADMIN_PASSWORD = "sssadmin123";

// ─── Login Screen ────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const { navigate } = useNavigation();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        onLogin();
      } else {
        setError("Invalid password. Please try again.");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002b5c] to-[#001a33] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
        {/* Back to Site Button */}
        <button
          onClick={() => navigate("home")}
          className="absolute top-4 right-4 flex items-center gap-1.5 text-gray-400 hover:text-[#002b5c] text-xs font-medium transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Back to Site</span>
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#002b5c] rounded-xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#002b5c]">Admin Panel</h1>
          <p className="text-gray-500 mt-1 text-sm">
            SSS Enterprises — Product Management
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <Eye className={`w-4 h-4 ${showPassword ? "hidden" : ""}`} />
                {showPassword && (
                  <X className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm bg-red-50 p-2.5 rounded-lg">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-[#2563EB] text-white py-2.5 rounded-lg font-semibold hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-6">
          Default password: sssadmin123
        </p>
      </div>
    </div>
  );
}

// ─── Product Form Modal ─────────────────────────────────────────────────────

function ProductFormModal({
  product,
  onSave,
  onCancel,
}: {
  product: Product | null;
  onSave: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}) {
  const isEditing = !!product;

  const [title, setTitle] = useState(product?.title || "");
  const [description, setDescription] = useState(product?.description || "");
  const [brand, setBrand] = useState(product?.brand || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [featured, setFeatured] = useState(product?.featured || false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(product?.image || null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBrandChange = (brandName: string) => {
    const b = BRANDS.find((br) => br.name === brandName);
    setBrand(brandName);
    setSlug(b?.slug || brandName.toLowerCase().replace(/\s+/g, "-"));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!title.trim() || !brand) return;
    setSaving(true);

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("description", description.trim());
    fd.append("brand", brand);
    fd.append("slug", slug);
    fd.append("featured", String(featured));

    if (file) {
      fd.append("file", file);
    }

    await onSave(fd);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#002b5c]">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Brand <span className="text-red-500">*</span>
            </label>
            <select
              value={brand}
              onChange={(e) => handleBrandChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white cursor-pointer appearance-none"
            >
              <option value="">Select Brand</option>
              {BRANDS.map((b) => (
                <option key={b.slug} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. iPhone 15 Pro Max"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mobile details, specifications, key features..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product Image <span className="text-red-500">*</span>
            </label>
            <div
              className={`border-2 border-dashed rounded-xl p-4 transition-colors ${
                previewUrl
                  ? "border-[#2563EB]/30 bg-blue-50/50"
                  : "border-gray-300 hover:border-[#2563EB]"
              }`}
            >
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-56 object-contain bg-white rounded-lg"
                  />
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white/90 text-[#2563EB] p-1.5 rounded-full shadow hover:bg-white transition-colors cursor-pointer"
                      title="Change image"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setPreviewUrl(null);
                        }}
                        className="bg-red-500 text-white p-1.5 rounded-full shadow hover:bg-red-600 transition-colors cursor-pointer"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center py-10 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    Click to upload product image
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    JPEG, PNG, WebP — Max 10MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Featured Toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB]"
            />
            <Star className={`w-4 h-4 ${featured ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`} />
            <span className="text-sm text-gray-700">Featured — show on homepage</span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim() || !brand || (!isEditing && !file)}
            className="flex-1 bg-[#2563EB] text-white py-2.5 rounded-lg font-medium hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditing ? "Update Product" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ────────────────────────────────────────────────────

function DeleteConfirmModal({
  product,
  onConfirm,
  onCancel,
}: {
  product: Product;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}) {
  const [deleting, setDeleting] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-7 h-7 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 text-center">
          Delete Product?
        </h3>
        <p className="text-sm text-gray-500 text-center mt-2">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-700">{product.title}</span>?
          This will permanently remove the image from Cloudinary.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              setDeleting(true);
              await onConfirm();
              setDeleting(false);
            }}
            disabled={deleting}
            className="flex-1 bg-red-500 text-white py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Dashboard ─────────────────────────────────────────────────────────

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { navigate } = useNavigation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (brandFilter !== "all") params.set("brand", brandFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [brandFilter, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSave = async (formData: FormData) => {
    try {
      const url = editingProduct
        ? `/api/products/${encodeURIComponent(editingProduct.id)}`
        : "/api/products";

      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      const result = await res.json();

      if (result.success) {
        showToast(
          editingProduct
            ? "Product updated successfully!"
            : "Product added successfully!"
        );
        setShowForm(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        showToast(result.message || "Operation failed.");
      }
    } catch {
      showToast("An error occurred. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    try {
      const res = await fetch(
        `/api/products/${encodeURIComponent(deletingProduct.id)}`,
        { method: "DELETE" }
      );
      const result = await res.json();
      if (result.success) {
        showToast("Product deleted successfully!");
        setDeletingProduct(null);
        fetchProducts();
      } else {
        showToast("Failed to delete product.");
      }
    } catch {
      showToast("An error occurred.");
      setDeletingProduct(null);
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      const res = await fetch(
        `/api/products/${encodeURIComponent(product.id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ featured: !product.featured }),
        }
      );
      const result = await res.json();
      if (result.success) {
        fetchProducts();
        showToast(
          product.featured ? "Removed from featured" : "Marked as featured"
        );
      }
    } catch {
      showToast("Failed to update.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-[#002b5c] text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("home")}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Back to Website"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold">Admin Panel</h1>
                <p className="text-xs text-white/60">SSS Enterprises</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Product</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back to Site Button - Mobile Friendly */}
        <div className="mb-4 sm:hidden">
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-2 text-[#2563EB] hover:text-[#1d4ed8] text-sm font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {products.length}
                </p>
                <p className="text-xs text-gray-500">Total Products</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter((p) => p.featured).length}
                </p>
                <p className="text-xs text-gray-500">Featured</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter((p) => p.image).length}
                </p>
                <p className="text-xs text-gray-500">With Images</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by title, brand, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              />
            </div>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white cursor-pointer"
            >
              <option value="all">All Brands</option>
              {BRANDS.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin mx-auto" />
              <p className="text-gray-500 mt-3">Loading products from Cloudinary...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="text-gray-500 mt-3">No products yet.</p>
              <p className="text-gray-400 text-sm mt-1">
                Add your first product with an image — it will be stored directly in Cloudinary.
              </p>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowForm(true);
                }}
                className="mt-4 inline-flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1d4ed8] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add First Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border-t border-gray-100">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-4 border-b border-r border-gray-100 hover:bg-gray-50/80 transition-colors group"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
                    <img
                      src={product.thumbnail || product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.featured && (
                      <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-yellow-900" />
                        Featured
                      </span>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setShowForm(true);
                        }}
                        className="bg-white text-gray-800 p-2.5 rounded-full shadow-lg hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingProduct(product)}
                        className="bg-white text-red-500 p-2.5 rounded-full shadow-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div>
                    <p className="text-xs font-medium text-[#2563EB] uppercase tracking-wide">
                      {product.brand}
                    </p>
                    <h3 className="text-sm font-semibold text-gray-900 mt-0.5 line-clamp-1">
                      {product.title}
                    </h3>
                    {product.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleToggleFeatured(product)}
                      className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                        product.featured
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-500 hover:bg-yellow-50 hover:text-yellow-600"
                      }`}
                    >
                      <Star
                        className={`w-3 h-3 ${product.featured ? "fill-yellow-500" : ""}`}
                      />
                      {product.featured ? "Featured" : "Set Featured"}
                    </button>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setShowForm(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingProduct(product)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cloudinary Connected Banner */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-green-800">
              Cloudinary Connected — No Database Needed
            </h3>
            <p className="text-xs text-green-700">
              Products and images are stored in your Cloudinary account. Vercel-ready.
            </p>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showForm && (
        <ProductFormModal
          key={editingProduct?.id || "new"}
          product={editingProduct}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
      {deletingProduct && (
        <DeleteConfirmModal
          product={deletingProduct}
          onConfirm={handleDelete}
          onCancel={() => setDeletingProduct(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-50">
          {toast}
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Page ─────────────────────────────────────────────────────────

export default function AdminPage() {
  const { adminAuth, setAdminAuth } = useNavigation();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!adminAuth) {
    return <LoginScreen onLogin={() => setAdminAuth(true)} />;
  }

  return <AdminDashboard onLogout={() => setAdminAuth(false)} />;
}