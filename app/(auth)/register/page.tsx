"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, ShieldCheck, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { signInWithGoogle, isConfigured } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignUp = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await signInWithGoogle();
      router.push("/onboarding");
    } catch (err: any) {
      setErrorMessage(
        err.message || "Failed to sign up with Google. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/today" className="inline-block">
          <BrandLogo size="lg" />
        </Link>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-content-primary">
          Begin Your Transformation
        </h2>
        <p className="mt-1 text-xs text-content-secondary max-w-sm mx-auto">
          Set up your calibrated 4-day workout routine and realistic nutrition targets.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="border border-border p-8 shadow-sm">
          <CardContent className="p-0 space-y-6">
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-semibold text-content-primary">
                Create Your Account with Google
              </h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                No passwords to remember. One click instantly connects your profile and launches your onboarding setup.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-status-errorBg border border-status-error/20 text-status-error text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Google Sign-up Button */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-xl bg-card hover:bg-surface-subtle transition-all duration-200 text-content-primary font-medium text-sm shadow-sm hover:shadow hover:border-primary/40 disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoading ? "Setting up..." : "Sign up with Google"}</span>
            </button>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-content-tertiary">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Safe, fast, and encrypted. No password required.</span>
            </div>

            {!isConfigured && (
              <div className="pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/onboarding")}
                  className="w-full text-xs"
                >
                  Explore Onboarding Wizard (Demo Mode)
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            )}

            <div className="pt-4 border-t border-border text-center text-xs text-content-secondary">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign In with Google
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
