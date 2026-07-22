"use client";

import { ChevronRight, Home } from "lucide-react";
import { useNavigation, type PageName } from "@/lib/store";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
}

export default function PageHeader({ title, subtitle, breadcrumbs }: PageHeaderProps) {
  const { navigate } = useNavigation();

  return (
    <section 
      className="relative py-16 lg:py-20 overflow-hidden"
      style={{
        backgroundImage: `url('/productbanner.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
        {/* Decorative shapes */}
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-2 text-sm flex-wrap">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />}
                {crumb.href ? (
                  <button
                    onClick={() => navigate(crumb.href as PageName)}
                    className="text-white/60 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {index === 0 && <Home className="w-3.5 h-3.5" />}
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-white font-medium">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/80 mt-3 text-lg w-100">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}