"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/ui/StatCard";
import {
  Scale,
  Flame,
  Beef,
  Footprints,
  Moon,
  Dumbbell,
} from "lucide-react";
import { calculateGoalProgress } from "@/lib/calculations";

interface SummaryCardsGridProps {
  currentWeightKg: number;
  startingWeightKg: number;
  milestoneWeightKg: number;
  caloriesLogged: number;
  calorieTarget: number;
  proteinLoggedG: number;
  proteinTargetG: number;
  stepsLogged: number;
  stepTarget: number;
  sleepLoggedHours?: number;
  sleepTargetHours: number;
  workoutTitle: string;
  workoutStatus: "not_started" | "in_progress" | "completed";
  isEmptyState?: boolean;
}

export const SummaryCardsGrid: React.FC<SummaryCardsGridProps> = ({
  currentWeightKg,
  startingWeightKg,
  milestoneWeightKg,
  caloriesLogged,
  calorieTarget,
  proteinLoggedG,
  proteinTargetG,
  stepsLogged,
  stepTarget,
  sleepLoggedHours,
  sleepTargetHours,
  workoutTitle,
  workoutStatus,
  isEmptyState = false,
}) => {
  const router = useRouter();

  // If empty state, display zero or unlogged indicators cleanly
  const calories = isEmptyState ? 0 : caloriesLogged;
  const protein = isEmptyState ? 0 : proteinLoggedG;
  const steps = isEmptyState ? 0 : stepsLogged;
  const sleep = isEmptyState ? undefined : sleepLoggedHours;
  const status = isEmptyState ? "not_started" : workoutStatus;

  const weightProgress = calculateGoalProgress(
    startingWeightKg,
    currentWeightKg,
    milestoneWeightKg
  );

  const remainingKg = Math.max(0, currentWeightKg - milestoneWeightKg).toFixed(2);
  const remainingCalories = Math.max(0, calorieTarget - calories);
  const remainingProtein = Math.max(0, proteinTargetG - protein);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 1. Weight Milestone Card */}
      <StatCard
        title="Weight Milestone"
        icon={<Scale className="w-4 h-4" />}
        value={currentWeightKg.toFixed(2)}
        unit="kg"
        target={milestoneWeightKg.toFixed(1)}
        subtitle={
          remainingKg === "0.00"
            ? "Milestone 1 reached!"
            : `${remainingKg} kg to reach Phase 1 target`
        }
        badgeText={`Phase 1: ${milestoneWeightKg} kg`}
        badgeVariant="primary"
        progressValue={weightProgress}
        progressMax={100}
        onClick={() => router.push("/progress")}
      />

      {/* 2. Calories Consumed vs Target */}
      <StatCard
        title="Calories"
        icon={<Flame className="w-4 h-4 text-amber-600" />}
        value={calories}
        unit="kcal"
        target={calorieTarget}
        subtitle={
          calories === 0
            ? "No meals logged yet today"
            : `${remainingCalories} kcal remaining allowance`
        }
        badgeText={calories > calorieTarget ? "Target Exceeded" : "Within Allowance"}
        badgeVariant={calories > calorieTarget ? "warning" : "success"}
        progressValue={calories}
        progressMax={calorieTarget}
        progressVariant={calories > calorieTarget ? "warning" : "primary"}
        onClick={() => router.push("/nutrition")}
      />

      {/* 3. Protein Consumed vs Target */}
      <StatCard
        title="Protein"
        icon={<Beef className="w-4 h-4 text-emerald-600" />}
        value={protein}
        unit="g"
        target={proteinTargetG}
        subtitle={
          protein === 0
            ? "Log meals to track daily protein"
            : `${remainingProtein} g needed to hit target`
        }
        badgeText={protein >= proteinTargetG ? "Target Hit" : `${Math.round((protein / proteinTargetG) * 100)}%`}
        badgeVariant={protein >= proteinTargetG ? "success" : "neutral"}
        progressValue={protein}
        progressMax={proteinTargetG}
        progressVariant="success"
        onClick={() => router.push("/nutrition")}
      />

      {/* 4. Steps Completed vs Target */}
      <StatCard
        title="Daily Steps"
        icon={<Footprints className="w-4 h-4 text-teal-600" />}
        value={steps.toLocaleString()}
        unit="steps"
        target={stepTarget.toLocaleString()}
        subtitle={
          steps === 0
            ? "Tap to record today's step count"
            : `${Math.max(0, stepTarget - steps).toLocaleString()} steps to daily goal`
        }
        badgeText={steps >= stepTarget ? "Goal Reached" : `${Math.round((steps / stepTarget) * 100)}%`}
        badgeVariant={steps >= stepTarget ? "success" : "neutral"}
        progressValue={steps}
        progressMax={stepTarget}
        onClick={() => router.push("/habits")}
      />

      {/* 5. Sleep Duration */}
      <StatCard
        title="Sleep"
        icon={<Moon className="w-4 h-4 text-indigo-500" />}
        value={sleep !== undefined ? `${sleep}` : "Not logged"}
        unit={sleep !== undefined ? "hrs" : ""}
        target={sleepTargetHours}
        subtitle={
          sleep !== undefined
            ? "Last night's recorded recovery"
            : "Tap to record previous night's sleep"
        }
        badgeText={sleep && sleep >= 7 ? "Optimal" : sleep ? "Sub-optimal" : "Pending"}
        badgeVariant={sleep && sleep >= 7 ? "success" : "neutral"}
        progressValue={sleep ? sleep : 0}
        progressMax={sleepTargetHours}
        onClick={() => router.push("/habits")}
      />

      {/* 6. Workout Status */}
      <StatCard
        title="Workout Status"
        icon={<Dumbbell className="w-4 h-4 text-primary" />}
        value={status === "completed" ? "Done" : status === "in_progress" ? "Active" : "Planned"}
        subtitle={workoutTitle}
        badgeText={
          status === "completed"
            ? "Completed"
            : status === "in_progress"
            ? "In Progress"
            : "Scheduled (Evening)"
        }
        badgeVariant={status === "completed" ? "success" : "primary"}
        onClick={() => router.push("/training")}
      />
    </div>
  );
};
