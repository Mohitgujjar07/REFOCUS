"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AlertCircle, RefreshCw, LogIn } from "lucide-react";

export default function RootErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("REFOCOUS Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link href="/login">
        <BrandLogo size="md" />
      </Link>
      <Card className="mt-6 max-w-md w-full border border-border p-6 shadow-sm">
        <CardContent className="p-0 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-status-errorBg text-status-error flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-bold text-content-primary">
              Something unexpected occurred
            </h2>
            <p className="text-xs text-content-secondary leading-relaxed">
              {error?.message || "An issue occurred while rendering this page."}
            </p>
            {error?.digest && (
              <p className="text-[10px] text-content-tertiary font-mono pt-1">
                Ref: {error.digest}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => reset()}
              className="flex-1"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Reload Page
            </Button>
            <Link href="/login" className="flex-1">
              <Button variant="primary" size="sm" className="w-full">
                <LogIn className="w-3.5 h-3.5 mr-1" /> Go to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
