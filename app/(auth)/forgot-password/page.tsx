"use client";

import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ShieldCheck, ExternalLink } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/today" className="inline-block">
          <BrandLogo size="lg" />
        </Link>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-content-primary">
          Passwordless Authentication
        </h2>
        <p className="mt-1 text-xs text-content-secondary max-w-sm mx-auto">
          REFOCOUS exclusively uses Google Sign-In for all accounts.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="border border-border p-8 shadow-sm">
          <CardContent className="p-0 space-y-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary-soft text-primary flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-semibold text-content-primary">
                No Password Needed
              </h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                We do not store passwords. You authenticate directly through your Google Account, ensuring maximum security and zero password-reset hassle.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-subtle border border-border text-left space-y-1.5 text-xs text-content-secondary">
              <p className="font-medium text-content-primary">
                Need to manage your Google credentials?
              </p>
              <p className="text-[11px] leading-relaxed">
                You can manage or recover your Google Account credentials directly at Google Account Settings.
              </p>
              <a
                href="https://myaccount.google.com/security"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline pt-1"
              >
                Open Google Security Center <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="pt-2">
              <Link href="/login">
                <Button variant="primary" size="md" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> Return to Google Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
