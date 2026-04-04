"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumbs = () => {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter((item) => item !== "" && item !== "edit");

  return (
    <nav aria-label="Breadcrumb" className="flex">
      <ol className="flex items-center space-x-2 text-sm font-medium text-slate-500">
        <li className="flex items-center">
          <Link
            href="/dashboard"
            className="hover:text-slate-900 transition-colors flex items-center gap-1"
          >
            <Home size={16} />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;

          const isLast = index === segments.length - 1;

          const label =
            segment.charAt(0).toUpperCase() +
            segment.slice(1).replace(/-/g, " ");

          return (
            <li key={href} className="flex items-center space-x-2">
              <ChevronRight size={14} className="text-slate-400 shrink-0" />

              {isLast ? (
                <span className="text-slate-900 font-semibold truncate max-w-[150px]">
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="hover:text-slate-900 transition-colors truncate max-w-[120px]"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
