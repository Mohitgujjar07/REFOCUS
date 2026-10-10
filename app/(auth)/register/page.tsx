"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Lock, Mail, User, AlertCircle, Info } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isConfigured } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isConfigured) {
      // Offline / Local development mode
      router.push("/onboarding");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, name);
      router.push("/onboarding");
    } catch (err: any) {
      setErrorMessage(err.message || "Registration failed. Please check your details.");
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
        <h2 className="mt-4 text-xl font-bold tracking-tight text-content-primary">
          Begin Your Transformation
        </h2>
        <p className="mt-1 text-xs text-content-secondary">
          Create an account to configure your personal targets and four-day routine.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="border border-border p-6 shadow-sm">
          <CardContent className="p-0">
            {!isConfigured && (
              <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Local Foundation Mode:</strong> Running without Firebase credentials. Click <strong>Create Account</strong> to preview the full onboarding wizard.
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-status-errorBg border border-status-error/20 text-status-error text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-content-secondary mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-content-tertiary absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required={isConfigured}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-card text-content-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="e.g. Mohit"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-content-secondary mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-content-tertiary absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required={isConfigured}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-card text-content-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-content-secondary mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-content-tertiary absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required={isConfigured}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-card text-content-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-mono"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full mt-2"
              >
                Create Account & Start Onboarding
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-border text-center text-xs text-content-secondary">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
