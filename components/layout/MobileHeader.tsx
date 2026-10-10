"use client";

import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { FOUNDER_INITIAL_PROFILE } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";

export const MobileHeader: React.FC = () => {
  const { profile } = useAuth();
  const displayName = profile?.displayName || FOUNDER_INITIAL_PROFILE.displayName;

  return (
    <header className="md:hidden sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
      <Link href="/today" className="focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
        <BrandLogo size="sm" />
      </Link>

      <div className="flex items-center gap-2">
        <Link
          href="/settings"
          className="w-8 h-8 rounded-full bg-surface-subtle border border-border flex items-center justify-center text-primary text-xs font-semibold hover:border-primary/50 transition-colors"
          aria-label="Account Settings"
        >
          {displayName.substring(0, 1).toUpperCase()}
        </Link>
      </div>
    </header>
  );
};
