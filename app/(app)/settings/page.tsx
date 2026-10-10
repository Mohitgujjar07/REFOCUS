"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FOUNDER_INITIAL_PROFILE } from "@/lib/constants";
import {
  Settings,
  User,
  Target,
  Utensils,
  Dumbbell,
  Shield,
  Save,
  CheckCircle2,
  Trash2,
  LogOut,
  HelpCircle,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { ProfileRepository } from "@/lib/repositories/profileRepository";
import { auth } from "@/lib/firebase/client";
import { deleteUser } from "firebase/auth";

export default function SettingsPage() {
  const { user, profile: authProfile, isConfigured, logout, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(authProfile || FOUNDER_INITIAL_PROFILE);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (authProfile) {
      setProfile(authProfile);
    }
  }, [authProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSaving(true);

    try {
      if (user && isConfigured) {
        await ProfileRepository.updateUserProfile(user.uid, profile);
        await refreshProfile();
      }
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save profile changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out of REFOCOUS?")) {
      await logout();
      window.location.href = "/login";
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.prompt(
        "Type 'DELETE' to confirm permanent deletion of your profile and data. This action cannot be undone."
      ) === "DELETE"
    ) {
      try {
        if (user && isConfigured) {
          await ProfileRepository.deleteUserProfile(user.uid);
          if (auth?.currentUser) {
            await deleteUser(auth.currentUser);
          }
        }
        alert("Account and data successfully deleted.");
        window.location.href = "/register";
      } catch (err: any) {
        alert(err.message || "Failed to delete account. You may need to sign in again first.");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-content-primary flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            <span>Profile & Application Settings</span>
          </h1>
          <p className="text-xs text-content-secondary mt-0.5">
            Manage your personal baseline, daily targets, dietary preferences, and account privacy.
          </p>
        </div>

        {isSaved && (
          <span className="text-xs font-semibold text-primary bg-primary-soft px-3 py-1.5 rounded-lg border border-primary/20 flex items-center gap-1.5 self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4" /> Changes Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Basic Profile */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span>Personal Profile & Measurements</span>
            </CardTitle>
            <CardDescription>
              Fundamental bio-metrics used for BMI and baseline energy calculations.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-content-secondary font-medium mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  className="w-full p-2 rounded-lg border border-border bg-card text-content-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-content-secondary font-medium mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={profile.heightCm}
                  onChange={(e) => setProfile({ ...profile, heightCm: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-border bg-card font-mono text-content-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-content-secondary font-medium mb-1">
                  Time Zone
                </label>
                <input
                  type="text"
                  value={profile.timeZone}
                  onChange={(e) => setProfile({ ...profile, timeZone: e.target.value })}
                  className="w-full p-2 rounded-lg border border-border bg-card text-content-primary"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Goals & Milestones */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span>Transformation Targets & Milestones</span>
            </CardTitle>
            <CardDescription>
              Editable goals. Changing a target does not delete your historical logs.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-content-secondary font-medium mb-1">
                  Starting Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={profile.startingWeightKg}
                  disabled
                  className="w-full p-2 rounded-lg border border-border bg-surface-subtle font-mono text-content-secondary cursor-not-allowed"
                />
                <span className="text-[10px] text-content-tertiary mt-0.5 block">
                  Preserved starting baseline
                </span>
              </div>

              <div>
                <label className="block text-content-secondary font-medium mb-1">
                  First Milestone Target (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={profile.targetWeightKg}
                  onChange={(e) => setProfile({ ...profile, targetWeightKg: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-border bg-card font-mono text-content-primary font-bold"
                  required
                />
                <span className="text-[10px] text-content-tertiary mt-0.5 block">
                  Current goal: 78.0 kg
                </span>
              </div>

              <div>
                <label className="block text-content-secondary font-medium mb-1">
                  Daily Step Target
                </label>
                <input
                  type="number"
                  step="500"
                  value={profile.dailyStepTarget}
                  onChange={(e) => setProfile({ ...profile, dailyStepTarget: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-border bg-card font-mono text-content-primary"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
              <div>
                <label className="block text-content-secondary font-medium mb-1">
                  Daily Calorie Target (kcal)
                </label>
                <input
                  type="number"
                  step="50"
                  value={profile.dailyCalorieTarget}
                  onChange={(e) => setProfile({ ...profile, dailyCalorieTarget: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-border bg-card font-mono text-content-primary font-bold"
                  required
                />
                <span className="text-[10px] text-content-tertiary mt-0.5 block">
                  Moderate deficit suitable for fat loss with resistance training
                </span>
              </div>

              <div>
                <label className="block text-content-secondary font-medium mb-1">
                  Daily Protein Target (grams)
                </label>
                <input
                  type="number"
                  step="5"
                  value={profile.dailyProteinTargetGrams}
                  onChange={(e) => setProfile({ ...profile, dailyProteinTargetGrams: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-border bg-card font-mono text-emerald-700 font-bold"
                  required
                />
                <span className="text-[10px] text-content-tertiary mt-0.5 block">
                  ~1.45g per kg of starting bodyweight to safeguard muscle
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Nutrition & Lifestyle Preferences */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Utensils className="w-4 h-4 text-primary" />
              <span>Dietary Routine & Grocery Budget</span>
            </CardTitle>
            <CardDescription>
              Tailored to your Indian college student meal setup.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-content-secondary font-medium mb-1">
                  Dietary Pattern
                </label>
                <select
                  value={profile.dietaryPattern}
                  onChange={(e) => setProfile({ ...profile, dietaryPattern: e.target.value as any })}
                  className="w-full p-2 rounded-lg border border-border bg-card text-content-primary"
                >
                  <option value="vegetarian_with_eggs">Vegetarian with Eggs (Eggetarian)</option>
                  <option value="vegetarian">Pure Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="non_vegetarian">Non-Vegetarian</option>
                </select>
              </div>

              <div>
                <label className="block text-content-secondary font-medium mb-1">
                  Additional Monthly Grocery Budget (INR ₹)
                </label>
                <input
                  type="number"
                  step="100"
                  value={profile.monthlyGroceryBudgetInr}
                  onChange={(e) => setProfile({ ...profile, monthlyGroceryBudgetInr: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-border bg-card font-mono text-content-primary"
                />
                <span className="text-[10px] text-content-tertiary mt-0.5 block">
                  Allocated for eggs, soya chunks, roasted chana, and milk/curd
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-status-errorBg border border-status-error/20 text-status-error text-xs">
            {errorMessage}
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md" isLoading={isSaving}>
            <Save className="w-4 h-4 mr-1.5" />
            Save Target Changes
          </Button>
        </div>
      </form>

      {/* Account Management & Security */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span>Account Security & Privacy</span>
          </CardTitle>
          <CardDescription>
            Session management and data ownership controls.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-surface-subtle border border-border">
            <div>
              <p className="font-semibold text-content-primary">Active Session</p>
              <p className="text-[11px] text-content-secondary">
                Logged in as {profile.email} ({profile.displayName})
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="self-start sm:self-auto"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Log Out
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-status-errorBg/40 border border-status-error/20">
            <div>
              <p className="font-semibold text-status-error">Permanent Account Deletion</p>
              <p className="text-[11px] text-content-secondary">
                Permanently purge your account, meal snapshots, body logs, and workout history.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteAccount}
              className="self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
