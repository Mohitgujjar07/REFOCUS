"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading, isConfigured } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (isConfigured && !user) {
      router.replace("/login");
    } else {
      router.replace("/today");
    }
  }, [user, isLoading, isConfigured, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <BrandLogo size="lg" />
      <div className="mt-6 flex items-center gap-2 text-xs text-content-secondary font-medium">
        <svg
          className="animate-spin h-5 w-5 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span>Entering REFOCOUS...</span>
      </div>
    </div>
  );
}
