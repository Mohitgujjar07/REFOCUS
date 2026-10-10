"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FOUNDER_INITIAL_PROFILE } from "@/lib/constants";
import { calculateBmi, getBmiCategory, calculateAverageWeight } from "@/lib/calculations";
import { BodyCompositionLog } from "@/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Scale,
  Plus,
  TrendingDown,
  Info,
  Calendar,
  Layers,
  Ruler,
  Percent,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { ProgressRepository } from "@/lib/repositories/progressRepository";
import { ProfileRepository } from "@/lib/repositories/profileRepository";

export default function ProgressPage() {
  const { user, profile, isConfigured, refreshProfile } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"weight" | "waist" | "bodyFat">("weight");
  const [isSavingLog, setIsSavingLog] = useState(false);

  // Initial historical logs fallback
  const [logs, setLogs] = useState<BodyCompositionLog[]>([
    {
      id: "log_1",
      date: "2026-09-22",
      weightKg: 83.15,
      waistCm: 96.5,
      bodyFatPercentage: 27.8,
      visceralFatRating: 9,
      notes: "Starting measurement at college entrance",
    },
    {
      id: "log_2",
      date: "2026-09-29",
      weightKg: 82.8,
      waistCm: 96.0,
      notes: "Week 1 check-in",
    },
    {
      id: "log_3",
      date: "2026-10-06",
      weightKg: 82.25,
      waistCm: 95.2,
      bodyFatPercentage: 27.1,
      notes: "Week 2 - consistent gym & egg intake",
    },
    {
      id: "log_4",
      date: "2026-10-10",
      weightKg: 81.9,
      waistCm: 94.8,
      notes: "Today's morning weigh-in",
    },
  ]);

  // Form input state
  const [newDate, setNewDate] = useState("2026-10-10");
  const [newWeight, setNewWeight] = useState<string>("81.9");
  const [newWaist, setNewWaist] = useState<string>("94.8");
  const [newBodyFat, setNewBodyFat] = useState<string>("");
  const [newNotes, setNewNotes] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);

    async function loadBodyLogs() {
      if (user && isConfigured) {
        try {
          const remoteLogs = await ProgressRepository.getBodyLogs(user.uid);
          if (remoteLogs.length > 0) {
            setLogs(remoteLogs);
          }
        } catch (err) {
          console.error("Failed to load body logs from Firestore:", err);
        }
      }
    }
    loadBodyLogs();
  }, [user, isConfigured]);

  const latestLog = logs[logs.length - 1] || {
    weightKg: profile?.currentWeightKg || FOUNDER_INITIAL_PROFILE.currentWeightKg,
    waistCm: 96.5,
  };

  const currentHeight = profile?.heightCm || FOUNDER_INITIAL_PROFILE.heightCm;
  const bmi = calculateBmi(latestLog.weightKg, currentHeight);
  const bmiCategory = getBmiCategory(bmi);
  const avg7Day = calculateAverageWeight(logs.map((l) => l.weightKg));

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    const weightVal = parseFloat(newWeight);
    if (isNaN(weightVal) || weightVal <= 0) return;

    setIsSavingLog(true);
    const newEntryData: Omit<BodyCompositionLog, "id"> = {
      date: newDate,
      weightKg: weightVal,
      waistCm: newWaist ? parseFloat(newWaist) : undefined,
      bodyFatPercentage: newBodyFat ? parseFloat(newBodyFat) : undefined,
      notes: newNotes || undefined,
    };

    try {
      if (user && isConfigured) {
        const saved = await ProgressRepository.addBodyLog(user.uid, newEntryData);
        // Also update current weight on profile
        await ProfileRepository.updateUserProfile(user.uid, { currentWeightKg: weightVal });
        await refreshProfile();
        setLogs([...logs, saved]);
      } else {
        const localEntry: BodyCompositionLog = {
          ...newEntryData,
          id: `log_${Date.now()}`,
        };
        setLogs([...logs, localEntry]);
      }
      setNewNotes("");
    } catch (err) {
      console.error("Failed to add body measurement:", err);
      alert("Failed to save measurement to Firestore.");
    } finally {
      setIsSavingLog(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-content-primary flex items-center gap-2">
            <Scale className="w-6 h-6 text-primary" />
            <span>Body Composition & Progress</span>
          </h1>
          <p className="text-xs text-content-secondary mt-0.5">
            Track weight trends, waist circumference, and milestone targets over time.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 bg-card border border-border">
          <span className="text-xs font-medium text-content-secondary block">
            Current Weight
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-content-primary tabular-nums">
              {latestLog.weightKg.toFixed(2)}
            </span>
            <span className="text-xs text-content-secondary">kg</span>
          </div>
          <span className="text-[10px] text-content-secondary mt-1 block">
            Target 1: {FOUNDER_INITIAL_PROFILE.targetWeightKg} kg
          </span>
        </Card>

        <Card className="p-4 bg-card border border-border">
          <span className="text-xs font-medium text-content-secondary block">
            Calculated BMI
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-content-primary tabular-nums">
              {bmi}
            </span>
            <span className="text-xs text-content-secondary">kg/m²</span>
          </div>
          <span className="text-[10px] text-primary font-medium mt-1 block">
            {bmiCategory} (165 cm)
          </span>
        </Card>

        <Card className="p-4 bg-card border border-border">
          <span className="text-xs font-medium text-content-secondary block">
            Waist Circumference
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-content-primary tabular-nums">
              {latestLog.waistCm || 95}
            </span>
            <span className="text-xs text-content-secondary">cm</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-medium mt-1 block">
            -1.7 cm from baseline
          </span>
        </Card>

        <Card className="p-4 bg-card border border-border">
          <span className="text-xs font-medium text-content-secondary block">
            Average Weight
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-content-primary tabular-nums">
              {avg7Day}
            </span>
            <span className="text-xs text-content-secondary">kg</span>
          </div>
          <span className="text-[10px] text-content-secondary mt-1 block">
            Smoothing daily water shifts
          </span>
        </Card>
      </div>

      {/* Disclaimers & Transparency Note */}
      <div className="p-3.5 rounded-xl bg-surface-subtle border border-border flex items-start gap-3">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-xs text-content-secondary">
          <strong className="text-content-primary font-medium">Measurement Guidance:</strong>{" "}
          Body weight naturally fluctuates day-to-day due to water retention, carbohydrate intake, and sodium. Always evaluate multi-week averages and waist measurements rather than single weigh-ins. REFOCOUS provides progress tracking and does not provide medical diagnoses.
        </p>
      </div>

      {/* Chart Section */}
      <Card className="border border-border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-primary" />
              <span>Historical Trend Analytics</span>
            </CardTitle>
            <CardDescription>
              Verified measurements plotted against first milestone target (78 kg).
            </CardDescription>
          </div>

          <div className="flex items-center gap-1 bg-surface-subtle p-1 rounded-lg border border-border text-xs">
            <button
              onClick={() => setActiveTab("weight")}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeTab === "weight" ? "bg-card shadow-xs text-primary font-bold" : "text-content-secondary"
              }`}
            >
              Weight (kg)
            </button>
            <button
              onClick={() => setActiveTab("waist")}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeTab === "waist" ? "bg-card shadow-xs text-primary font-bold" : "text-content-secondary"
              }`}
            >
              Waist (cm)
            </button>
            <button
              onClick={() => setActiveTab("bodyFat")}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeTab === "bodyFat" ? "bg-card shadow-xs text-primary font-bold" : "text-content-secondary"
              }`}
            >
              Body Fat (%)
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="h-64 w-full">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={logs} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E7E1" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#6B756E"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#E2E7E1" }}
                  />
                  <YAxis
                    stroke="#6B756E"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#E2E7E1" }}
                    domain={activeTab === "weight" ? [76, 85] : ["auto", "auto"]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E2E7E1",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                  />
                  {activeTab === "weight" && (
                    <ReferenceLine
                      y={FOUNDER_INITIAL_PROFILE.targetWeightKg}
                      stroke="#16A34A"
                      strokeDasharray="4 4"
                      label={{
                        value: "Milestone: 78kg",
                        position: "insideBottomRight",
                        fill: "#16A34A",
                        fontSize: 10,
                      }}
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey={
                      activeTab === "weight"
                        ? "weightKg"
                        : activeTab === "waist"
                        ? "waistCm"
                        : "bodyFatPercentage"
                    }
                    stroke="#245B46"
                    strokeWidth={2.5}
                    dot={{ fill: "#245B46", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-content-secondary bg-surface-subtle rounded-lg">
                Loading charts...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Two Column: Add Measurement Form + Measurement History Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form (4 cols) */}
        <div className="lg:col-span-4">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-primary" />
                <span>Log New Measurement</span>
              </CardTitle>
              <CardDescription>
                Record your weight, waist, or body composition readings.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2">
              <form onSubmit={handleAddLog} className="space-y-3 text-xs">
                <div>
                  <label className="block text-content-secondary font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-card text-content-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-content-secondary font-medium mb-1">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="30"
                    max="300"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-card font-mono text-content-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-content-secondary font-medium mb-1">
                    Waist Circumference (cm, optional)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="40"
                    max="200"
                    value={newWaist}
                    onChange={(e) => setNewWaist(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-card font-mono text-content-primary"
                  />
                </div>

                <div>
                  <label className="block text-content-secondary font-medium mb-1">
                    Body Fat % (optional)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="3"
                    max="60"
                    value={newBodyFat}
                    onChange={(e) => setNewBodyFat(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-card font-mono text-content-primary"
                  />
                </div>

                <div>
                  <label className="block text-content-secondary font-medium mb-1">
                    Notes / Conditions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. morning, post-bathroom"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-card text-content-primary"
                  />
                </div>

                <Button type="submit" variant="primary" size="sm" className="w-full mt-2" isLoading={isSavingLog}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Save Measurement
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* History Table (8 cols) */}
        <div className="lg:col-span-8">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Measurement History</CardTitle>
              <CardDescription>
                Chronological list of all logged body metrics.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-border/80 text-content-secondary">
                      <th className="pb-2.5">Date</th>
                      <th className="pb-2.5">Weight (kg)</th>
                      <th className="pb-2.5">Waist (cm)</th>
                      <th className="pb-2.5">Body Fat</th>
                      <th className="pb-2.5">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    {logs.map((log) => (
                      <tr key={log.id} className="py-2 hover:bg-surface-subtle/50">
                        <td className="py-2.5 font-sans font-medium text-content-primary">
                          {log.date}
                        </td>
                        <td className="py-2.5 font-bold text-content-primary tabular-nums">
                          {log.weightKg.toFixed(2)} kg
                        </td>
                        <td className="py-2.5 tabular-nums text-content-secondary">
                          {log.waistCm ? `${log.waistCm} cm` : "—"}
                        </td>
                        <td className="py-2.5 tabular-nums text-content-secondary">
                          {log.bodyFatPercentage ? `${log.bodyFatPercentage}%` : "—"}
                        </td>
                        <td className="py-2.5 font-sans text-content-secondary text-[11px]">
                          {log.notes || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
