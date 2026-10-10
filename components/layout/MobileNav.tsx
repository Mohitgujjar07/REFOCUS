"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Apple,
  Dumbbell,
  LineChart,
  Menu,
  X,
  CheckSquare,
  Sparkles,
  Settings,
} from "lucide-react";

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const primaryItems = [
    { name: "Today", href: "/today", icon: CalendarDays },
    { name: "Nutrition", href: "/nutrition", icon: Apple },
    { name: "Training", href: "/training", icon: Dumbbell },
    { name: "Progress", href: "/progress", icon: LineChart },
  ];

  const secondaryItems = [
    { name: "Habits", href: "/habits", icon: CheckSquare },
    { name: "Weekly Review", href: "/weekly-review", icon: Sparkles },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Secondary Menu Drawer for Mobile */}
      {isMoreOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs flex flex-col justify-end">
          <div
            className="fixed inset-0"
            onClick={() => setIsMoreOpen(false)}
            aria-hidden="true"
          />
          <div className="relative bg-card rounded-t-2xl border-t border-border p-5 pb-24 shadow-xl z-50 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-sm font-semibold text-content-primary">
                More Destinations
              </span>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-1 rounded-md text-content-secondary hover:text-content-primary"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-3">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMoreOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary-soft text-primary font-semibold"
                        : "text-content-primary hover:bg-surface-subtle"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-primary" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-md border-t border-border px-2 py-1.5 flex items-center justify-around safe-area-bottom select-none"
        aria-label="Mobile Navigation"
      >
        {primaryItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-md text-[11px] font-medium transition-colors ${
                isActive
                  ? "text-primary font-semibold"
                  : "text-content-secondary hover:text-content-primary"
              }`}
            >
              <div
                className={`p-1 rounded-md transition-colors ${
                  isActive ? "bg-primary-soft text-primary" : "text-content-secondary"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="mt-0.5">{item.name}</span>
            </Link>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-md text-[11px] font-medium transition-colors ${
            isMoreOpen
              ? "text-primary font-semibold"
              : "text-content-secondary hover:text-content-primary"
          }`}
          aria-label="More navigation links"
        >
          <div
            className={`p-1 rounded-md transition-colors ${
              isMoreOpen ? "bg-primary-soft text-primary" : "text-content-secondary"
            }`}
          >
            <Menu className="w-5 h-5" />
          </div>
          <span className="mt-0.5">More</span>
        </button>
      </nav>
    </>
  );
};
