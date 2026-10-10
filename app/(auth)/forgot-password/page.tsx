"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, CheckCircle2, Mail, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const { resetPassword, isConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setErrorMessage(null);

    if (!isConfigured) {
      setIsSubmitted(true);
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to dispatch reset email. Please try again.");
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
          Reset Your Password
        </h2>
        <p className="mt-1 text-xs text-content-secondary">
          Enter your registered email and we&apos;ll send instructions to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="border border-border p-6 shadow-sm">
          <CardContent className="p-0">
            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-status-errorBg border border-status-error/20 text-status-error text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {isSubmitted ? (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-status-success mx-auto" />
                <h3 className="text-sm font-bold text-content-primary">
                  Password Reset Email Sent
                </h3>
                <p className="text-xs text-content-secondary leading-relaxed">
                  If an account exists for <strong className="text-content-primary">{email}</strong>, a secure reset link has been dispatched.
                </p>
                <div className="pt-2">
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Login
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-content-secondary mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-content-tertiary absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-card text-content-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder="you@example.com"
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
                  Send Reset Link
                </Button>

                <div className="pt-2 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-xs text-primary font-medium hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
