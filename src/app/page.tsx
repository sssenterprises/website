"use client";

import { useNavigation } from "@/lib/store";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import HomePage from "@/components/pages/HomePage";
import ProductsPage from "@/components/pages/ProductsPage";
import ServicesPage from "@/components/pages/ServicesPage";
import DealersPage from "@/components/pages/DealersPage";
import ContactPage from "@/components/pages/ContactPage";
import AdminPage from "@/components/pages/AdminPage";

function PageContent() {
  const { currentPage } = useNavigation();

  switch (currentPage) {
    case "home":
      return <HomePage />;
    case "products":
      return <ProductsPage />;
    case "services":
      return <ServicesPage />;
    case "dealers":
      return <DealersPage />;
    case "contact":
      return <ContactPage />;
    case "admin":
      return <AdminPage />;
    default:
      return <HomePage />;
  }
}

export default function App() {
  const { currentPage } = useNavigation();

  // Admin page has its own layout (no navbar/footer)
  if (currentPage === "admin") {
    return <AdminPage />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <PageContent />
      </div>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}