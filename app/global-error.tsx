"use client";

import React, { useEffect } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("REFOCOUS Global Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-content-primary antialiased font-sans flex flex-col items-center justify-center p-4">
        <BrandLogo size="md" />
        <Card className="mt-6 max-w-md w-full border border-border p-6 shadow-sm">
          <CardContent className="p-0 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-status-errorBg text-status-error flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-base font-bold text-content-primary">
                Application Exception
              </h2>
              <p className="text-xs text-content-secondary leading-relaxed">
                {error?.message || "An unhandled exception occurred in the application."}
              </p>
              {error?.digest && (
                <p className="text-[10px] text-content-tertiary font-mono pt-1">
                  Digest: {error.digest}
                </p>
              )}
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => reset()}
                className="w-full"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" /> Reload Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </body>
    </html>
  );
}
