"use client";

import React, { useState } from "react";
import { TodayHeader } from "@/components/dashboard/TodayHeader";
import { SummaryCardsGrid } from "@/components/dashboard/SummaryCardsGrid";
import { TodayPriorities } from "@/components/dashboard/TodayPriorities";
import { TodayWorkoutCard } from "@/components/dashboard/TodayWorkoutCard";
import { TodayNutritionSummary } from "@/components/dashboard/TodayNutritionSummary";
import { TodayProgressPreview } from "@/components/dashboard/TodayProgressPreview";
import { Info, ToggleLeft, ToggleRight } from "lucide-react";
import {
  FOUNDER_INITIAL_PROFILE,
  INITIAL_FOOD_CATALOGUE,
  WORKOUT_TEMPLATES,
} from "@/lib/constants";
import { DailyPriority, FoodLogEntry } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { FoodLogRepository } from "@/lib/repositories/foodLogRepository";
import { ProgressRepository } from "@/lib/repositories/progressRepository";
import { HabitRepository } from "@/lib/repositories/habitRepository";

export default function TodayDashboardPage() {
  const { user, profile, isConfigured } = useAuth();
  // State toggle to demonstrate both Sample Data mode and Fresh Empty State mode
  const [isEmptyStateMode, setIsEmptyStateMode] = useState(false);
  const [liveFoodLogs, setLiveFoodLogs] = useState<FoodLogEntry[] | null>(null);
  const [liveWeightTrend, setLiveWeightTrend] = useState<{ date: string; weightKg: number }[] | null>(null);
  const [liveSteps, setLiveSteps] = useState<number | null>(null);
  const [liveSleep, setLiveSleep] = useState<number | null>(null);

  const activeProfile = profile || FOUNDER_INITIAL_PROFILE;
  const todayDate = "2026-10-10";

  // Load user's real Firestore data if authenticated
  React.useEffect(() => {
    async function loadTodayData() {
      if (user && isConfigured) {
        try {
          const logs = await FoodLogRepository.getFoodLogsForDate(user.uid, todayDate);
          if (logs.length > 0) {
            setLiveFoodLogs(logs);
          }
          const bodyLogs = await ProgressRepository.getBodyLogs(user.uid);
          if (bodyLogs.length > 0) {
            setLiveWeightTrend(
              bodyLogs.map((b) => ({
                date: b.date.substring(5), // MM-DD
                weightKg: b.weightKg,
              }))
            );
          }
          const daily = await HabitRepository.getDailyLog(user.uid, todayDate);
          if (daily) {
            if (daily.steps !== undefined) setLiveSteps(daily.steps);
            if (daily.sleepHours !== undefined) setLiveSleep(daily.sleepHours);
          }
        } catch (err) {
          console.error("Failed to load today's dashboard records:", err);
        }
      }
    }
    loadTodayData();
  }, [user, isConfigured]);

  // Initial founder priorities
  const initialPriorities: DailyPriority[] = [
    {
      id: "p1",
      title: "Hit 120g Daily Protein",
      description: "Distribute across meals with eggs, curd, dal and paneer/soy",
      completed: true,
      category: "nutrition",
    },
    {
      id: "p2",
      title: "Complete Upper Body A Session",
      description: "Evening workout at 5:30 PM (6 exercises, 3 sets chest & back)",
      completed: false,
      category: "workout",
    },
    {
      id: "p3",
      title: "Reach 8,000 Daily Steps",
      description: "Campus walk during lunch and post-college transit",
      completed: false,
      category: "activity",
    },
    {
      id: "p4",
      title: "Record Evening Weight & Hydration",
      description: "Consistent weighing condition; aim for 3.5L total water",
      completed: true,
      category: "recovery",
    },
    {
      id: "p5",
      title: "Maintain 1,800 kcal Target",
      description: "Budget remaining 520 kcal for dinner post-workout",
      completed: false,
      category: "nutrition",
    },
  ];

  // Realistic sample food logs for the founder's college day
  const sampleFoodLogs: FoodLogEntry[] = [
    {
      id: "log_1",
      foodId: "egg_whole",
      foodName: "Whole Eggs (Boiled)",
      mealCategory: "breakfast",
      servingQuantity: 3,
      servingUnit: "eggs",
      quantityGrams: 150,
      calories: 215,
      proteinG: 18.9,
      carbsG: 1.1,
      fatG: 14.3,
      loggedDate: "2026-10-10",
      timestamp: "08:00 AM",
    },
    {
      id: "log_2",
      foodId: "oats_rolled",
      foodName: "Rolled Oats with Toned Milk",
      mealCategory: "breakfast",
      servingQuantity: 1,
      servingUnit: "bowl",
      quantityGrams: 290,
      calories: 300,
      proteinG: 13.4,
      carbsG: 38.5,
      fatG: 9.8,
      loggedDate: "2026-10-10",
      timestamp: "08:15 AM",
    },
    {
      id: "log_3",
      foodId: "dal_tadka_cooked",
      foodName: "Home Dal with 2 Rotis & Plain Curd",
      mealCategory: "lunch",
      servingQuantity: 1,
      servingUnit: "packed tiffin",
      quantityGrams: 370,
      calories: 475,
      proteinG: 22.8,
      carbsG: 68.0,
      fatG: 11.2,
      loggedDate: "2026-10-10",
      timestamp: "01:15 PM",
    },
    {
      id: "log_4",
      foodId: "chana_roasted",
      foodName: "Roasted Chana (Pre-gym snack)",
      mealCategory: "snacks",
      servingQuantity: 1,
      servingUnit: "handful",
      quantityGrams: 40,
      calories: 144,
      proteinG: 7.4,
      carbsG: 23.2,
      fatG: 2.0,
      loggedDate: "2026-10-10",
      timestamp: "04:45 PM",
    },
    {
      id: "log_5",
      foodId: "paneer_lowfat",
      foodName: "Low-Fat Paneer (Raw with chaat masala)",
      mealCategory: "snacks",
      servingQuantity: 1,
      servingUnit: "serving",
      quantityGrams: 100,
      calories: 146,
      proteinG: 25.5,
      carbsG: 3.2,
      fatG: 3.5,
      loggedDate: "2026-10-10",
      timestamp: "05:00 PM",
    },
  ];

  // Progress trend sample points
  const sampleWeightTrend = [
    { date: "Day 1", weightKg: 83.15 },
    { date: "Day 4", weightKg: 82.9 },
    { date: "Day 7", weightKg: 82.75 },
    { date: "Day 10", weightKg: 82.5 },
    { date: "Day 14", weightKg: 82.3 },
    { date: "Day 18", weightKg: 82.05 },
    { date: "Today", weightKg: 81.9 },
  ];

  // Calculation totals for effective food logs
  const effectiveFoodLogs = liveFoodLogs !== null ? liveFoodLogs : sampleFoodLogs;
  const totalCalories = effectiveFoodLogs.reduce((acc, m) => acc + m.calories, 0);
  const totalProteinG = Number(
    effectiveFoodLogs.reduce((acc, m) => acc + m.proteinG, 0).toFixed(1)
  );
  const totalCarbsG = Number(
    effectiveFoodLogs.reduce((acc, m) => acc + m.carbsG, 0).toFixed(1)
  );
  const totalFatG = Number(
    effectiveFoodLogs.reduce((acc, m) => acc + m.fatG, 0).toFixed(1)
  );

  const upperATemplate = WORKOUT_TEMPLATES[0];

  return (
    <div className="space-y-6">
      {/* Sample Data & Mode Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-subtle border border-border">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="text-xs text-content-secondary">
            <strong className="text-content-primary font-medium">
              {user && isConfigured ? "Authenticated Cloud Session:" : "Founder Blueprint Mode:"}
            </strong>{" "}
            Viewing active profile for {activeProfile.displayName} (Starting {activeProfile.startingWeightKg} kg • {activeProfile.heightCm} cm • {activeProfile.dailyCalorieTarget} kcal • {activeProfile.dailyProteinTargetGrams}g protein).
          </p>
        </div>

        {/* Empty State vs Sample State Switcher */}
        <button
          onClick={() => setIsEmptyStateMode(!isEmptyStateMode)}
          className="inline-flex items-center gap-2 self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-surface-subtle transition-colors text-content-primary"
          title="Toggle between sample data and fresh empty state to verify zero states"
        >
          {isEmptyStateMode ? (
            <>
              <ToggleLeft className="w-4 h-4 text-content-tertiary" />
              <span>Viewing Fresh Empty State</span>
            </>
          ) : (
            <>
              <ToggleRight className="w-4 h-4 text-primary" />
              <span>Viewing Populated State</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dashboard Header */}
      <TodayHeader
        displayName={activeProfile.displayName}
        hasSampleDataBadge={!isEmptyStateMode && !user}
        supportiveMessage={
          isEmptyStateMode
            ? "Your transformation starts today. Begin by logging your first meal or completing today's workout."
            : "College ends at 4:00 PM. Hydrate and prepare your pre-gym snack before the evening Upper Body session."
        }
      />

      {/* 6 Key Daily Summary Cards Grid */}
      <SummaryCardsGrid
        currentWeightKg={isEmptyStateMode ? activeProfile.startingWeightKg : activeProfile.currentWeightKg}
        startingWeightKg={activeProfile.startingWeightKg}
        milestoneWeightKg={activeProfile.targetWeightKg}
        caloriesLogged={totalCalories}
        calorieTarget={activeProfile.dailyCalorieTarget}
        proteinLoggedG={totalProteinG}
        proteinTargetG={activeProfile.dailyProteinTargetGrams}
        stepsLogged={liveSteps !== null ? liveSteps : 6420}
        stepTarget={activeProfile.dailyStepTarget}
        sleepLoggedHours={liveSleep !== null ? liveSleep : 7.5}
        sleepTargetHours={activeProfile.dailySleepTargetHours}
        workoutTitle="Upper Body A (Evening 5:30 PM)"
        workoutStatus="not_started"
        isEmptyState={isEmptyStateMode}
      />

      {/* Two Column Section: Action Priorities & Today's Workout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayPriorities initialPriorities={initialPriorities} />
        <TodayWorkoutCard
          template={upperATemplate}
          isRestDay={false}
          status="not_started"
        />
      </div>

      {/* Two Column Section: Nutrition Summary & Progress Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayNutritionSummary
          loggedMeals={effectiveFoodLogs}
          totalCalories={totalCalories}
          calorieTarget={activeProfile.dailyCalorieTarget}
          totalProteinG={totalProteinG}
          proteinTargetG={activeProfile.dailyProteinTargetGrams}
          totalCarbsG={totalCarbsG}
          totalFatG={totalFatG}
          isEmptyState={isEmptyStateMode}
        />
        <TodayProgressPreview
          startingWeightKg={activeProfile.startingWeightKg}
          targetWeightKg={activeProfile.targetWeightKg}
          currentWeightKg={isEmptyStateMode ? activeProfile.startingWeightKg : activeProfile.currentWeightKg}
          data={
            isEmptyStateMode
              ? [{ date: "Today", weightKg: activeProfile.startingWeightKg }]
              : liveWeightTrend || sampleWeightTrend
          }
        />
      </div>
    </div>
  );
}
