"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationConfig } from "@/config/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full border-b border-space-latte bg-deep-space z-999">
      <div className="flex flex-row items-center justify-center gap-4 px-4 py-2 flex-wrap">
        {navigationConfig.map((route) => {
          const isCurrentRoute = pathname === route.path;
          const hasSections = route.sections.length > 0;

          if (isCurrentRoute && hasSections) {
            return (
              <div key={route.path} className="flex flex-row items-center gap-4">
                <span>[</span>
                {route.sections.map((section, sectionIndex) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="hover:opacity-70 transition-opacity"
                  >
                    {section.label}
                  </a>
                ))}
                <span>]</span>
              </div>
            );
          }

          return (
            <Link 
              key={route.path}
              href={route.path}
              className="hover:opacity-70 transition-opacity"
            >
              {route.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

