import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { FirebaseSetupBanner } from "@/components/auth/FirebaseSetupBanner";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <FirebaseSetupBanner />
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
