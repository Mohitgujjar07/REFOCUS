"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { FOUNDER_INITIAL_PROFILE } from "@/lib/constants";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  User,
  Target,
  Utensils,
  Calendar,
  Dumbbell,
  Sliders,
  Check,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { ProfileRepository } from "@/lib/repositories/profileRepository";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile, isConfigured, refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;
  const [isSaving, setIsSaving] = useState(false);

  // Form State initialized with profile if available, or Founder baseline
  const [formData, setFormData] = useState({
    displayName: profile?.displayName || FOUNDER_INITIAL_PROFILE.displayName,
    age: profile?.age || 21,
    heightCm: profile?.heightCm || FOUNDER_INITIAL_PROFILE.heightCm,
    currentWeightKg: profile?.currentWeightKg || FOUNDER_INITIAL_PROFILE.startingWeightKg,
    targetWeightKg: profile?.targetWeightKg || FOUNDER_INITIAL_PROFILE.targetWeightKg,
    primaryGoal: "fat_loss_muscle_preservation",
    dietaryPattern: profile?.dietaryPattern || FOUNDER_INITIAL_PROFILE.dietaryPattern,
    monthlyGroceryBudgetInr: profile?.monthlyGroceryBudgetInr || FOUNDER_INITIAL_PROFILE.monthlyGroceryBudgetInr,
    collegeHours: "8:30 AM – 4:00 PM, Mon-Fri",
    workoutTime: "Evening (5:30 PM)",
    gymDaysPerWeek: profile?.availableGymDaysPerWeek || 4,
    experienceLevel: profile?.experienceLevel || "beginner",
    dailyCalorieTarget: profile?.dailyCalorieTarget || FOUNDER_INITIAL_PROFILE.dailyCalorieTarget,
    dailyProteinTargetGrams: profile?.dailyProteinTargetGrams || FOUNDER_INITIAL_PROFILE.dailyProteinTargetGrams,
    dailyStepTarget: profile?.dailyStepTarget || FOUNDER_INITIAL_PROFILE.dailyStepTarget,
  });

  const nextStep = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsSaving(true);
      try {
        if (user && isConfigured) {
          await ProfileRepository.updateUserProfile(user.uid, {
            displayName: formData.displayName,
            age: formData.age,
            heightCm: formData.heightCm,
            startingWeightKg: formData.currentWeightKg,
            currentWeightKg: formData.currentWeightKg,
            targetWeightKg: formData.targetWeightKg,
            dailyCalorieTarget: formData.dailyCalorieTarget,
            dailyProteinTargetGrams: formData.dailyProteinTargetGrams,
            dailyStepTarget: formData.dailyStepTarget,
            dietaryPattern: formData.dietaryPattern as any,
            monthlyGroceryBudgetInr: formData.monthlyGroceryBudgetInr,
            availableGymDaysPerWeek: formData.gymDaysPerWeek,
            experienceLevel: formData.experienceLevel as any,
          });
          await refreshProfile();
        }
      } catch (err) {
        console.error("Failed to persist onboarding profile:", err);
      } finally {
        setIsSaving(false);
        router.push("/today");
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      {/* Top Header */}
      <div className="max-w-2xl mx-auto w-full flex items-center justify-between pb-6 border-b border-border">
        <BrandLogo size="md" />
        <span className="text-xs font-semibold text-content-secondary bg-surface-subtle px-3 py-1 rounded-full border border-border tabular-nums">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Progress Line */}
      <div className="max-w-2xl mx-auto w-full my-4">
        <ProgressBar value={currentStep} max={totalSteps} variant="primary" />
      </div>

      {/* Main Wizard Card */}
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center my-4">
        <Card className="border border-border p-6 shadow-sm">
          {/* STEP 1: WELCOME */}
          {currentStep === 1 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-primary-soft text-primary mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-content-primary">
                Welcome to REFOCOUS
              </h2>
              <p className="text-xs text-content-secondary leading-relaxed max-w-md mx-auto">
                Turn your long-term self-improvement vision into clear, sustainable daily actions. We will calibrate your nutrition, 4-day training schedule, and initial milestones around your real college lifestyle.
              </p>
              <div className="p-3 bg-surface-subtle rounded-lg text-[11px] text-content-secondary max-w-md mx-auto border border-border">
                🌱 <strong>Our Core Promise:</strong> Factual tracking, zero punitive streaks, sustainable nutrition with Indian staples, and progressive strength training.
              </div>
            </div>
          )}

          {/* STEP 2: BASIC PROFILE */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                <User className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold text-content-primary">
                  Step 2: Basic Profile & Measurements
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-content-secondary font-medium mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-border bg-card text-content-primary"
                  />
                </div>
                <div>
                  <label className="block text-content-secondary font-medium mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-border bg-card text-content-primary"
                  />
                </div>
                <div>
                  <label className="block text-content-secondary font-medium mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.heightCm}
                    onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-border bg-card font-mono text-content-primary"
                  />
                </div>
                <div>
                  <label className="block text-content-secondary font-medium mb-1">
                    Starting Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={formData.currentWeightKg}
                    onChange={(e) =>
                      setFormData({ ...formData, currentWeightKg: Number(e.target.value) })
                    }
                    className="w-full p-2 rounded-lg border border-border bg-card font-mono text-content-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: GOALS */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold text-content-primary">
                  Step 3: Goals & Milestones
                </h3>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-content-secondary font-medium mb-1">
                    Primary Transformation Goal
                  </label>
                  <select
                    value={formData.primaryGoal}
                    onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                    className="w-full p-2 rounded-lg border border-border bg-card text-content-primary"
                  >
                    <option value="fat_loss_muscle_preservation">
                      Reduce Body Fat while Preserving & Building Muscle
                    </option>
                    <option value="strength_building">Strength & Muscle Hypertrophy Focus</option>
                    <option value="general_fitness">General Mobility & Habit Reset</option>
                  </select>
                </div>

                <div>
                  <label className="block text-content-secondary font-medium mb-1">
                    First Realistic Milestone Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.targetWeightKg}
                    onChange={(e) =>
                      setFormData({ ...formData, targetWeightKg: Number(e.target.value) })
                    }
                    className="w-full p-2 rounded-lg border border-border bg-card font-mono font-bold text-content-primary"
                  />
                  <p className="text-[11px] text-content-tertiary mt-1">
                    Founder starting weight: 83.15 kg. Milestone 1: 78.0 kg (~5.15 kg reduction).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: NUTRITION & BUDGET */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                <Utensils className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold text-content-primary">
                  Step 4: Nutrition & Grocery Budget
                </h3>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-content-secondary font-medium mb-1">
                    Dietary Pattern
                  </label>
                  <select
                    value={formData.dietaryPattern}
                    onChange={(e) => setFormData({ ...formData, dietaryPattern: e.target.value as any })}
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
                    value={formData.monthlyGroceryBudgetInr}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        monthlyGroceryBudgetInr: Number(e.target.value),
                      })
                    }
                    className="w-full p-2 rounded-lg border border-border bg-card font-mono text-content-primary"
                  />
                  <p className="text-[11px] text-content-tertiary mt-1">
                    Optimised for budget-friendly protein: eggs (crate of 30: ₹180), soy chunks (₹45/200g), roasted chana, and curd.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: SCHEDULE */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold text-content-primary">
                  Step 5: Schedule & College Routine
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-content-secondary font-medium mb-1">
                    College / Study Hours
                  </label>
                  <input
                    type="text"
                    value={formData.collegeHours}
                    onChange={(e) => setFormData({ ...formData, collegeHours: e.target.value })}
                    className="w-full p-2 rounded-lg border border-border bg-card text-content-primary"
                  />
                </div>
                <div>
                  <label className="block text-content-secondary font-medium mb-1">
                    Preferred Gym Window
                  </label>
                  <input
                    type="text"
                    value={formData.workoutTime}
                    onChange={(e) => setFormData({ ...formData, workoutTime: e.target.value })}
                    className="w-full p-2 rounded-lg border border-border bg-card text-content-primary"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-content-secondary font-medium mb-1">
                    Available Gym Days per Week
                  </label>
                  <select
                    value={formData.gymDaysPerWeek}
                    onChange={(e) =>
                      setFormData({ ...formData, gymDaysPerWeek: Number(e.target.value) })
                    }
                    className="w-full p-2 rounded-lg border border-border bg-card text-content-primary"
                  >
                    <option value={4}>4 Days (Recommended: Mon, Tue, Thu, Fri)</option>
                    <option value={3}>3 Days (Full Body)</option>
                    <option value={5}>5 Days (Upper / Lower + Conditioning)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: TRAINING EXPERIENCE */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                <Dumbbell className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold text-content-primary">
                  Step 6: Training Experience & Setup
                </h3>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-content-secondary font-medium mb-1">
                    Resistance Training Experience
                  </label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-border bg-card text-content-primary"
                  >
                    <option value="beginner">Beginner (Learning form, machine & dumbbell basics)</option>
                    <option value="intermediate">Intermediate (Consistent lifting &gt; 1 year)</option>
                  </select>
                </div>
                <div className="p-3 bg-surface-subtle rounded-lg border border-border text-content-secondary text-[11px] leading-relaxed">
                  🏋️ <strong>Initial 4-Day Routine Assigned:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    <li>Monday: Upper Body A (Chest press, lat pulldown, row, shoulder, arms)</li>
                    <li>Tuesday: Lower Body A (Leg press, curls, extensions, calves, plank)</li>
                    <li>Thursday: Upper Body B (Incline press, lat pulldown, row, lateral raises)</li>
                    <li>Friday: Lower Body B (Goblet squat/leg press, RDL, curls, calves)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: PROPOSED TARGETS */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                <Sliders className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold text-content-primary">
                  Step 7: Calibrated Baseline Targets
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-content-secondary font-medium mb-1">
                    Daily Calories (kcal)
                  </label>
                  <input
                    type="number"
                    value={formData.dailyCalorieTarget}
                    onChange={(e) =>
                      setFormData({ ...formData, dailyCalorieTarget: Number(e.target.value) })
                    }
                    className="w-full p-2 rounded-lg border border-border bg-card font-mono font-bold text-content-primary"
                  />
                  <span className="text-[10px] text-content-tertiary mt-0.5 block">
                    ~1,800 kcal baseline
                  </span>
                </div>
                <div>
                  <label className="block text-content-secondary font-medium mb-1">
                    Daily Protein (g)
                  </label>
                  <input
                    type="number"
                    value={formData.dailyProteinTargetGrams}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dailyProteinTargetGrams: Number(e.target.value),
                      })
                    }
                    className="w-full p-2 rounded-lg border border-border bg-card font-mono font-bold text-emerald-700"
                  />
                  <span className="text-[10px] text-content-tertiary mt-0.5 block">
                    ~120g target
                  </span>
                </div>
                <div>
                  <label className="block text-content-secondary font-medium mb-1">
                    Daily Step Target
                  </label>
                  <input
                    type="number"
                    value={formData.dailyStepTarget}
                    onChange={(e) =>
                      setFormData({ ...formData, dailyStepTarget: Number(e.target.value) })
                    }
                    className="w-full p-2 rounded-lg border border-border bg-card font-mono font-bold text-content-primary"
                  />
                  <span className="text-[10px] text-content-tertiary mt-0.5 block">
                    8,000 steps
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: FINAL REVIEW */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                <Check className="w-5 h-5 text-status-success" />
                <h3 className="text-base font-bold text-content-primary">
                  Step 8: Plan Review & Confirmation
                </h3>
              </div>
              <div className="p-3.5 bg-surface-subtle rounded-xl border border-border space-y-2 text-xs text-content-secondary">
                <p>
                  <strong>User:</strong> {formData.displayName} (Height {formData.heightCm} cm • Starting {formData.currentWeightKg} kg)
                </p>
                <p>
                  <strong>First Milestone:</strong> {formData.targetWeightKg} kg target
                </p>
                <p>
                  <strong>Daily Caloric & Macro Plan:</strong> {formData.dailyCalorieTarget} kcal • {formData.dailyProteinTargetGrams}g Protein
                </p>
                <p>
                  <strong>Routine:</strong> 4 Gym Days/week (Evening after 4:00 PM college) + 8,000 daily steps
                </p>
                <p>
                  <strong>Dietary Pattern:</strong> Vegetarian with eggs (Monthly grocery budget ₹{formData.monthlyGroceryBudgetInr})
                </p>
              </div>
              <p className="text-[11px] text-content-tertiary text-center">
                All parameters can be refined anytime in Settings.
              </p>
            </div>
          )}

          {/* Wizard Navigation Controls */}
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            {currentStep > 1 ? (
              <Button variant="outline" size="sm" onClick={prevStep}>
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Back
              </Button>
            ) : (
              <div />
            )}

            <Button variant="primary" size="sm" onClick={nextStep} isLoading={isSaving}>
              {currentStep === totalSteps ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Launch Today Dashboard
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-content-tertiary">
        REFOCOUS • Personal Transformation Application
      </div>
    </div>
  );
}
