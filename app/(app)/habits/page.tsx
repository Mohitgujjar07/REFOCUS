"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { HabitItem } from "@/types";
import {
  CheckSquare,
  CheckCircle2,
  Circle,
  Footprints,
  Moon,
  Droplets,
  Plus,
  Sparkles,
  Info,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { HabitRepository } from "@/lib/repositories/habitRepository";

export default function HabitsPage() {
  const { user, isConfigured } = useAuth();
  const todayDate = "2026-10-10";

  // Initial habits fallback
  const [habits, setHabits] = useState<HabitItem[]>([
    {
      id: "h_gym",
      name: "Gym Workout (4x / week)",
      category: "training",
      frequencyPerWeek: 4,
      currentStreak: 3,
      isCompletedToday: false,
      active: true,
    },
    {
      id: "h_protein",
      name: "Hit Daily Protein (120g)",
      category: "nutrition",
      frequencyPerWeek: 7,
      currentStreak: 5,
      isCompletedToday: true,
      active: true,
    },
    {
      id: "h_steps",
      name: "Walk 8,000 Steps Daily",
      category: "activity",
      frequencyPerWeek: 7,
      currentStreak: 4,
      isCompletedToday: false,
      active: true,
    },
    {
      id: "h_sleep",
      name: "7.5 Hours Sleep Routine",
      category: "sleep",
      frequencyPerWeek: 7,
      currentStreak: 6,
      isCompletedToday: true,
      active: true,
    },
    {
      id: "h_water",
      name: "Drink 3.5 Litres Water",
      category: "wellness",
      frequencyPerWeek: 7,
      currentStreak: 4,
      isCompletedToday: true,
      active: true,
    },
    {
      id: "h_stretch",
      name: "Evening Mobility / Stretching (10 min)",
      category: "wellness",
      frequencyPerWeek: 5,
      currentStreak: 2,
      isCompletedToday: false,
      active: true,
    },
  ]);

  // Steps & Sleep manual logs
  const [dailySteps, setDailySteps] = useState(6420);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [waterGlasses, setWaterGlasses] = useState(7); // 7 x 500ml = 3.5L

  // Load habits and daily log from Firestore
  React.useEffect(() => {
    async function loadHabitsAndLogs() {
      if (user && isConfigured) {
        try {
          const remoteHabits = await HabitRepository.getHabits(user.uid);
          if (remoteHabits.length > 0) {
            setHabits(remoteHabits);
          }
          const daily = await HabitRepository.getDailyLog(user.uid, todayDate);
          if (daily) {
            if (daily.steps !== undefined) setDailySteps(daily.steps);
            if (daily.sleepHours !== undefined) setSleepHours(daily.sleepHours);
            if (daily.waterLitres !== undefined) setWaterGlasses(Math.round(daily.waterLitres / 0.5));
          }
        } catch (err) {
          console.error("Failed to load habits from Firestore:", err);
        }
      }
    }
    loadHabitsAndLogs();
  }, [user, isConfigured]);

  // Toggle habit completion
  const toggleHabit = async (id: string) => {
    let updatedHabit: HabitItem | null = null;
    const newHabits = habits.map((h) => {
      if (h.id === id) {
        const nextState = !h.isCompletedToday;
        updatedHabit = {
          ...h,
          isCompletedToday: nextState,
          currentStreak: nextState ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1),
        };
        return updatedHabit;
      }
      return h;
    });

    setHabits(newHabits);

    if (user && isConfigured && updatedHabit) {
      try {
        await HabitRepository.saveHabit(user.uid, updatedHabit);
      } catch (err) {
        console.error("Failed to persist habit to Firestore:", err);
      }
    }
  };

  const persistDailyActivity = async (steps: number, sleep: number, glasses: number) => {
    if (user && isConfigured) {
      try {
        await HabitRepository.saveDailyLog(user.uid, todayDate, {
          steps,
          sleepHours: sleep,
          waterLitres: glasses * 0.5,
        });
      } catch (err) {
        console.error("Failed to persist daily metrics:", err);
      }
    }
  };

  // Add new habit
  const [newHabitName, setNewHabitName] = useState("");
  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    const newH: HabitItem = {
      id: `h_${Date.now()}`,
      name: newHabitName.trim(),
      category: "wellness",
      frequencyPerWeek: 7,
      currentStreak: 0,
      isCompletedToday: false,
      active: true,
    };
    setHabits([...habits, newH]);
    setNewHabitName("");

    if (user && isConfigured) {
      try {
        await HabitRepository.saveHabit(user.uid, newH);
      } catch (err) {
        console.error("Failed to persist new habit:", err);
      }
    }
  };

  const completedCount = habits.filter((h) => h.isCompletedToday).length;
  const consistencyPercent = Math.round((completedCount / habits.length) * 100);

  // Weekly days representation for visual weekly consistency
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-content-primary flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-primary" />
            <span>Habits & Daily Actions</span>
          </h1>
          <p className="text-xs text-content-secondary mt-0.5">
            Sustainable micro-habits designed to support your college routine and fitness targets.
          </p>
        </div>
      </div>

      {/* Philosophy note: non-punitive consistency */}
      <div className="p-3.5 rounded-xl bg-surface-subtle border border-border flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-xs text-content-secondary">
          <strong className="text-content-primary font-medium">Sustainable Habit Philosophy:</strong>{" "}
          One missed day never erases your accumulated effort. Consistency is measured by your overall 7-day adherence rather than fragile, punitive unbroken streaks.
        </p>
      </div>

      {/* Daily Metrics: Steps, Sleep, Hydration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Steps Card */}
        <Card className="p-4 border border-border bg-card">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold text-content-secondary uppercase tracking-wider flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-teal-600" /> Daily Steps
            </span>
            <span className="text-xs font-mono text-content-secondary tabular-nums">
              Goal: 8,000
            </span>
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <input
              type="number"
              step="100"
              value={dailySteps}
              onChange={(e) => setDailySteps(Number(e.target.value))}
              className="text-2xl font-bold text-content-primary font-mono bg-surface-subtle px-2 py-1 rounded border border-border w-32"
            />
            <span className="text-xs text-content-secondary">steps logged today</span>
          </div>
          <p className="text-[11px] text-content-tertiary">
            ~35 mins campus walking across college schedule.
          </p>
        </Card>

        {/* Sleep Card */}
        <Card className="p-4 border border-border bg-card">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold text-content-secondary uppercase tracking-wider flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-indigo-500" /> Sleep Duration
            </span>
            <span className="text-xs font-mono text-content-secondary tabular-nums">
              Goal: 7.5 hrs
            </span>
          </div>
          <div className="flex items-baseline gap-2 my-2">
            <input
              type="number"
              step="0.5"
              min="3"
              max="14"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="text-2xl font-bold text-content-primary font-mono bg-surface-subtle px-2 py-1 rounded border border-border w-24"
            />
            <span className="text-xs text-content-secondary">hours last night</span>
          </div>
          <p className="text-[11px] text-content-tertiary">
            Essential for muscle protein synthesis and mental focus.
          </p>
        </Card>

        {/* Hydration Card */}
        <Card className="p-4 border border-border bg-card">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold text-content-secondary uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-500" /> Water Intake
            </span>
            <span className="text-xs font-mono text-content-secondary tabular-nums">
              Goal: 3.5 Litres
            </span>
          </div>
          <div className="flex items-center gap-2 my-2">
            <span className="text-2xl font-bold text-content-primary font-mono tabular-nums">
              {(waterGlasses * 0.5).toFixed(1)} L
            </span>
            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
                className="w-7 h-7 rounded bg-surface-subtle border border-border text-xs font-bold hover:bg-surface-muted"
              >
                -
              </button>
              <button
                onClick={() => setWaterGlasses(waterGlasses + 1)}
                className="w-7 h-7 rounded bg-primary-soft text-primary border border-primary/20 text-xs font-bold hover:bg-[#DCEAE0]"
              >
                +
              </button>
            </div>
          </div>
          <p className="text-[11px] text-content-tertiary">
            {waterGlasses} of 7 bottles (500ml each) logged.
          </p>
        </Card>
      </div>

      {/* Main Habits List */}
      <Card className="border border-border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <span>Today&apos;s Core Habits Checklist</span>
              <span className="text-xs font-semibold text-primary bg-primary-soft px-2 py-0.5 rounded-full border border-primary/20 tabular-nums">
                {completedCount} / {habits.length} ({consistencyPercent}%)
              </span>
            </CardTitle>
            <CardDescription>
              Check off actions as you execute them throughout the day.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {habits.map((habit) => (
              <button
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  habit.isCompletedToday
                    ? "bg-surface-subtle/80 border-border/70 opacity-80"
                    : "bg-card border-border hover:border-primary/40 hover:bg-surface-subtle/30 shadow-xs"
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {habit.isCompletedToday ? (
                    <CheckCircle2 className="w-5 h-5 text-status-success fill-status-successBg" />
                  ) : (
                    <Circle className="w-5 h-5 text-content-tertiary" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-xs font-semibold ${
                        habit.isCompletedToday
                          ? "line-through text-content-secondary"
                          : "text-content-primary"
                      }`}
                    >
                      {habit.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-content-tertiary">
                    <span>Target: {habit.frequencyPerWeek}x / week</span>
                    <span>•</span>
                    <span className="font-mono text-content-secondary">
                      {habit.currentStreak} day streak
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Add Habit Inline Form */}
          <form
            onSubmit={handleAddHabit}
            className="pt-3 border-t border-border flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Add a new custom transformation habit..."
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              className="flex-1 p-2 rounded-lg border border-border bg-card text-xs text-content-primary"
            />
            <Button type="submit" variant="secondary" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Habit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
