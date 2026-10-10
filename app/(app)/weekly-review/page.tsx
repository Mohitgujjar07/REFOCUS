"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FOUNDER_INITIAL_PROFILE } from "@/lib/constants";
import {
  Sparkles,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Flame,
  Beef,
  Footprints,
  Moon,
  Calendar,
  Save,
} from "lucide-react";

export default function WeeklyReviewPage() {
  const [reflectionNotes, setReflectionNotes] = useState(
    "Felt great energy levels this week. Managing 3 boiled eggs in the morning and roasted chana post-college worked smoothly. Upper Body B chest press felt easier."
  );
  const [isSaved, setIsSaved] = useState(false);
  const [suggestionState, setSuggestionState] = useState<"pending" | "accepted" | "modified">("pending");

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-content-primary flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span>Weekly Review & Adaptive Guidance</span>
          </h1>
          <p className="text-xs text-content-secondary mt-0.5">
            Transparent, rule-based review of your recorded metrics to inform sensible weekly adjustments.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-lg text-xs font-semibold text-content-primary self-start sm:self-auto shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>Week 2 (4 Oct – 10 Oct 2026)</span>
        </div>
      </div>

      {/* Adaptive Recommendation Card (Rule-Based) */}
      <Card className="border-2 border-primary/30 bg-primary-soft/30 shadow-xs">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-primary" />
              Automated Adaptive Assessment
            </span>
            <span className="text-xs bg-card px-2.5 py-0.5 rounded-full border border-primary/20 text-primary font-medium">
              Rule-Based • Transparent
            </span>
          </div>
          <CardTitle className="text-lg mt-1 text-content-primary">
            Recommendation: Maintain Current 1,800 kcal & 120g Protein Plan
          </CardTitle>
          <CardDescription className="text-content-secondary text-xs">
            Evaluated against weight slope (-0.65 kg/week), workout completion (4/4 sessions), and logged recovery.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 pt-2">
          <div className="p-3 bg-card rounded-lg border border-border/80 text-xs text-content-secondary space-y-1.5 leading-relaxed">
            <p>
              ✅ <strong>Healthy Fat-Loss Rate:</strong> Your weekly average weight declined by <strong>0.65 kg</strong> (from 82.75 kg to 82.10 kg), which falls directly within the optimal sustainable target of 0.5–0.7 kg/week.
            </p>
            <p>
              ✅ <strong>High Training Adherence:</strong> You completed all 4 scheduled resistance sessions without missing compound exercises.
            </p>
            <p>
              💡 <strong>Action:</strong> Do not decrease calories further. Cutting calories when progress is already steady increases muscle loss and hunger risk. Continue executing this baseline for the upcoming week.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            {suggestionState === "pending" ? (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSuggestionState("accepted")}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Accept & Continue Baseline (1,800 kcal)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSuggestionState("modified")}
                >
                  Edit Targets in Settings
                </Button>
              </>
            ) : (
              <span className="text-xs font-semibold text-primary bg-primary-soft px-3 py-1.5 rounded-lg border border-primary/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Plan Confirmed for Next Week
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Performance Scorecard Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 bg-card border border-border">
          <span className="text-xs font-medium text-content-secondary block">
            Avg Weight Delta
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-primary tabular-nums">
              -0.65
            </span>
            <span className="text-xs text-content-secondary">kg this week</span>
          </div>
          <span className="text-[10px] text-content-secondary mt-1 block">
            From 82.75 kg to 82.10 kg
          </span>
        </Card>

        <Card className="p-4 bg-card border border-border">
          <span className="text-xs font-medium text-content-secondary block">
            Gym Adherence
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-content-primary tabular-nums">
              4 / 4
            </span>
            <span className="text-xs text-content-secondary">sessions</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-medium mt-1 block">
            100% adherence to 4-day plan
          </span>
        </Card>

        <Card className="p-4 bg-card border border-border">
          <span className="text-xs font-medium text-content-secondary block">
            Avg Daily Calories
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-content-primary tabular-nums">
              1,780
            </span>
            <span className="text-xs text-content-secondary">kcal / day</span>
          </div>
          <span className="text-[10px] text-content-secondary mt-1 block">
            Target: 1,800 kcal (99% adherence)
          </span>
        </Card>

        <Card className="p-4 bg-card border border-border">
          <span className="text-xs font-medium text-content-secondary block">
            Avg Daily Protein
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-emerald-700 tabular-nums">
              118
            </span>
            <span className="text-xs text-content-secondary">g / day</span>
          </div>
          <span className="text-[10px] text-content-secondary mt-1 block">
            Target: 120g (98% adherence)
          </span>
        </Card>
      </div>

      {/* User Reflection & Journaling */}
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Founder Weekly Journal & Reflection</CardTitle>
          <CardDescription>
            Record subjective notes on energy, college workload, recovery, and hunger.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <form onSubmit={handleSaveNotes} className="space-y-3">
            <textarea
              rows={4}
              value={reflectionNotes}
              onChange={(e) => setReflectionNotes(e.target.value)}
              className="w-full p-3 rounded-lg border border-border bg-card text-xs text-content-primary leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="How did you feel this week? Any energy dips or schedule conflicts?"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-content-secondary">
                {isSaved ? "Saved successfully!" : "Reflections help identify non-scale victories."}
              </span>
              <Button type="submit" variant="primary" size="sm">
                <Save className="w-3.5 h-3.5 mr-1" />
                Save Reflection
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
