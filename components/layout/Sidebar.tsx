"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { MAIN_NAV_ITEMS } from "./NavigationItems";
import { User, LogOut, ChevronRight } from "lucide-react";
import { FOUNDER_INITIAL_PROFILE } from "@/lib/constants";

import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const pathname = usePathname();
  const { profile } = useAuth();
  const activeProfile = profile || FOUNDER_INITIAL_PROFILE;

  return (
    <aside
      className={`hidden md:flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0 z-30 select-none ${className}`}
      aria-label="Main Navigation"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-border/60">
        <Link
          href="/today"
          className="focus-visible:ring-2 focus-visible:ring-primary rounded-lg block"
          aria-label="REFOCOUS Home"
        >
          <BrandLogo size="md" />
        </Link>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-content-tertiary uppercase">
          Daily Transformation
        </div>
        {MAIN_NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary-soft text-primary font-semibold shadow-xs"
                  : "text-content-secondary hover:text-content-primary hover:bg-surface-subtle"
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? "text-primary" : "text-content-secondary"
                }`}
              />
              <span>{item.name}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-border/80 bg-surface-subtle/50">
        <Link
          href="/settings"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-subtle transition-colors group"
        >
          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold text-xs flex-shrink-0">
            {activeProfile.displayName.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-content-primary truncate group-hover:text-primary transition-colors">
              {activeProfile.displayName}
            </p>
            <p className="text-[11px] text-content-secondary truncate">
              {activeProfile.currentWeightKg} kg • Goal: {activeProfile.targetWeightKg} kg
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-content-tertiary group-hover:text-content-primary group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </aside>
  );
};
