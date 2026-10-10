"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { WORKOUT_TEMPLATES } from "@/lib/constants";
import { WorkoutTemplate, WorkoutExerciseLog, WorkoutSetRecord } from "@/types";
import {
  Dumbbell,
  Play,
  CheckCircle2,
  Clock,
  RotateCcw,
  Plus,
  AlertCircle,
  X,
  History,
  ShieldCheck,
  ChevronRight,
  Flame,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { WorkoutRepository } from "@/lib/repositories/workoutRepository";

export default function TrainingPage() {
  const { user, isConfigured } = useAuth();
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const activeTemplate = WORKOUT_TEMPLATES[selectedTemplateIndex];

  // Active workout state
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Active workout exercises state
  const [activeExercises, setActiveExercises] = useState<WorkoutExerciseLog[]>([]);

  // Rest timer
  const [restTimerSeconds, setRestTimerSeconds] = useState<number | null>(null);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState(false);

  // Completed workout history
  const [workoutHistory, setWorkoutHistory] = useState([
    {
      id: "hist_1",
      name: "Upper Body A",
      date: "Thu, 8 Oct 2026",
      durationMins: 48,
      totalVolumeKg: 3420,
      setsCompleted: 14,
    },
    {
      id: "hist_2",
      name: "Lower Body A",
      date: "Tue, 6 Oct 2026",
      durationMins: 42,
      totalVolumeKg: 4680,
      setsCompleted: 12,
    },
  ]);

  // Load persistent workouts from Firestore
  useEffect(() => {
    async function loadSessions() {
      if (user && isConfigured) {
        try {
          const sessions = await WorkoutRepository.getWorkoutSessions(user.uid);
          if (sessions.length > 0) {
            setWorkoutHistory(
              sessions.map((s) => ({
                id: s.id,
                name: s.workoutName,
                date: s.date,
                durationMins: s.durationMinutes,
                totalVolumeKg: s.exercises.reduce(
                  (sum, ex) =>
                    sum +
                    ex.sets
                      .filter((st) => st.completed)
                      .reduce((stSum, st) => stSum + st.weightKg * st.reps, 0),
                  0
                ),
                setsCompleted: s.exercises.reduce(
                  (sum, ex) => sum + ex.sets.filter((st) => st.completed).length,
                  0
                ),
              }))
            );
          }
        } catch (err) {
          console.error("Failed to load workout sessions:", err);
        }
      }
    }
    loadSessions();
  }, [user, isConfigured]);

  // Timer loop for elapsed session time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive]);

  // Timer loop for rest timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRestTimerRunning && restTimerSeconds !== null && restTimerSeconds > 0) {
      timer = setInterval(() => {
        setRestTimerSeconds((prev) => (prev && prev > 1 ? prev - 1 : 0));
      }, 1000);
    } else if (restTimerSeconds === 0) {
      setIsRestTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRestTimerRunning, restTimerSeconds]);

  const startWorkoutSession = (template: WorkoutTemplate) => {
    const initialized: WorkoutExerciseLog[] = template.exercises.map((ex) => ({
      exerciseId: ex.id,
      exerciseName: ex.name,
      sets: Array.from({ length: ex.defaultSets }, (_, i) => ({
        setNumber: i + 1,
        weightKg: 20, // default placeholder starting weight
        reps: 10,
        completed: false,
      })),
      notes: ex.guidanceNote,
    }));

    setActiveExercises(initialized);
    setIsWorkoutActive(true);
    setElapsedSeconds(0);
    setSessionStartTime(Date.now());
  };

  const toggleSetComplete = (exerciseIndex: number, setIndex: number) => {
    setActiveExercises((prev) => {
      const updated = [...prev];
      const targetSet = updated[exerciseIndex].sets[setIndex];
      targetSet.completed = !targetSet.completed;

      // Automatically trigger 90-sec rest timer on set completion
      if (targetSet.completed) {
        setRestTimerSeconds(90);
        setIsRestTimerRunning(true);
      }
      return updated;
    });
  };

  const updateSetValues = (
    exerciseIndex: number,
    setIndex: number,
    field: "weightKg" | "reps",
    value: number
  ) => {
    setActiveExercises((prev) => {
      const updated = [...prev];
      updated[exerciseIndex].sets[setIndex][field] = value;
      return updated;
    });
  };

  const finishWorkoutSession = async () => {
    const totalSets = activeExercises.reduce(
      (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
      0
    );
    const volume = activeExercises.reduce(
      (sum, ex) =>
        sum +
        ex.sets
          .filter((s) => s.completed)
          .reduce((sSum, s) => sSum + s.weightKg * s.reps, 0),
      0
    );
    const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

    if (user && isConfigured) {
      try {
        await WorkoutRepository.createWorkoutSession(user.uid, {
          workoutName: activeTemplate.name,
          date: new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }),
          startedAt: new Date(sessionStartTime || Date.now()).toISOString(),
          finishedAt: new Date().toISOString(),
          status: "completed",
          durationMinutes,
          exercises: activeExercises,
        });
      } catch (err) {
        console.error("Failed to persist workout session to Firestore:", err);
      }
    }

    const newHistoryItem = {
      id: `hist_${Date.now()}`,
      name: activeTemplate.name,
      date: "Today, 10 Oct 2026",
      durationMins: durationMinutes,
      totalVolumeKg: volume,
      setsCompleted: totalSets,
    };

    setWorkoutHistory([newHistoryItem, ...workoutHistory]);
    setIsWorkoutActive(false);
    setElapsedSeconds(0);
    setIsRestTimerRunning(false);
    setRestTimerSeconds(null);
  };

  const cancelWorkoutSession = () => {
    if (window.confirm("Are you sure you want to cancel this workout session? Unsaved sets will be discarded.")) {
      setIsWorkoutActive(false);
      setElapsedSeconds(0);
      setIsRestTimerRunning(false);
      setRestTimerSeconds(null);
    }
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-content-primary flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-primary" />
            <span>4-Day Beginner Training Program</span>
          </h1>
          <p className="text-xs text-content-secondary mt-0.5">
            Progressive overload for muscle preservation and strength. Mon/Tue & Thu/Fri routine.
          </p>
        </div>

        {!isWorkoutActive && (
          <Button
            variant="primary"
            onClick={() => startWorkoutSession(activeTemplate)}
            className="self-start sm:self-auto"
          >
            <Play className="w-4 h-4 mr-1.5 fill-current" />
            Start {activeTemplate.name}
          </Button>
        )}
      </div>

      {/* Safety & Form Reminder Banner */}
      <div className="p-3.5 rounded-xl bg-surface-subtle border border-border flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-xs text-content-secondary">
          <strong className="text-content-primary font-medium">Training Safety Principles:</strong>{" "}
          Master movement technique before adding weight. Keep 1–2 repetitions in reserve (RIR). If an exercise causes joint or sharp pain, stop immediately and ask gym staff for form guidance.
        </div>
      </div>

      {/* Active Workout Session Logger Overlay / View */}
      {isWorkoutActive && (
        <Card className="border-2 border-primary bg-card shadow-md animate-in fade-in duration-200">
          <CardHeader className="bg-primary-soft/50 rounded-t-xl pb-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold tracking-wider text-primary uppercase">
                  Active Workout In Progress
                </span>
                <CardTitle className="text-lg mt-0.5">{activeTemplate.name}</CardTitle>
              </div>

              {/* Workout Duration & Rest Timer */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-mono font-bold text-content-primary">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>{formatTimer(elapsedSeconds)}</span>
                </div>

                {restTimerSeconds !== null && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-mono font-bold text-amber-800">
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Rest: {formatTimer(restTimerSeconds)}</span>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={cancelWorkoutSession}
                  className="text-status-error hover:bg-status-errorBg"
                >
                  <X className="w-3.5 h-3.5 mr-1" /> Cancel
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {activeExercises.map((exLog, exIndex) => (
              <div
                key={exLog.exerciseId}
                className="p-4 rounded-xl bg-surface-subtle border border-border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-content-primary">
                      {exIndex + 1}. {exLog.exerciseName}
                    </h4>
                    {exLog.notes && (
                      <p className="text-[11px] text-content-secondary mt-0.5">
                        💡 {exLog.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Sets Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-content-secondary border-b border-border/60">
                        <th className="pb-2 w-16">Set</th>
                        <th className="pb-2 w-28">Weight (kg)</th>
                        <th className="pb-2 w-28">Reps</th>
                        <th className="pb-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {exLog.sets.map((set, setIndex) => (
                        <tr key={set.setNumber} className="py-1.5">
                          <td className="py-2 font-mono font-medium">#{set.setNumber}</td>
                          <td className="py-2">
                            <input
                              type="number"
                              min="0"
                              max="400"
                              value={set.weightKg}
                              onChange={(e) =>
                                updateSetValues(
                                  exIndex,
                                  setIndex,
                                  "weightKg",
                                  Number(e.target.value)
                                )
                              }
                              className="w-20 px-2 py-1 rounded border border-border bg-card font-mono text-xs"
                            />
                          </td>
                          <td className="py-2">
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={set.reps}
                              onChange={(e) =>
                                updateSetValues(
                                  exIndex,
                                  setIndex,
                                  "reps",
                                  Number(e.target.value)
                                )
                              }
                              className="w-20 px-2 py-1 rounded border border-border bg-card font-mono text-xs"
                            />
                          </td>
                          <td className="py-2 text-right">
                            <button
                              onClick={() => toggleSetComplete(exIndex, setIndex)}
                              className={`px-3 py-1 rounded-md text-xs font-semibold inline-flex items-center gap-1 transition-colors ${
                                set.completed
                                  ? "bg-status-success text-white"
                                  : "bg-card border border-border text-content-secondary hover:text-content-primary"
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {set.completed ? "Done" : "Check"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-border flex justify-end gap-3">
              <Button variant="primary" size="lg" onClick={finishWorkoutSession}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Finish & Log Workout
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Routine Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {WORKOUT_TEMPLATES.map((tpl, idx) => (
          <button
            key={tpl.id}
            onClick={() => setSelectedTemplateIndex(idx)}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
              selectedTemplateIndex === idx
                ? "bg-primary text-white shadow-xs"
                : "bg-card border border-border text-content-secondary hover:bg-surface-subtle hover:text-content-primary"
            }`}
          >
            <span>{tpl.name}</span>
            <span className="text-[10px] opacity-80">({tpl.dayOfWeek})</span>
          </button>
        ))}
      </div>

      {/* Template Details Card */}
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg">{activeTemplate.name}</CardTitle>
              <CardDescription>
                {activeTemplate.focus} • Scheduled for {activeTemplate.dayOfWeek} evenings
              </CardDescription>
            </div>
            {!isWorkoutActive && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => startWorkoutSession(activeTemplate)}
              >
                <Play className="w-3.5 h-3.5 mr-1 fill-current" />
                Start This Workout
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeTemplate.exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="p-3.5 rounded-lg bg-surface-subtle border border-border/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-content-primary">
                      {index + 1}. {exercise.name}
                    </span>
                    <span className="text-[10px] font-semibold bg-card px-2 py-0.5 rounded border border-border text-content-secondary">
                      {exercise.targetMuscle}
                    </span>
                  </div>
                  <p className="text-xs text-content-secondary mt-1 font-mono">
                    {exercise.defaultSets} sets × {exercise.targetReps}
                  </p>
                  {exercise.guidanceNote && (
                    <p className="text-[11px] text-content-tertiary mt-2">
                      💡 {exercise.guidanceNote}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workout History Section */}
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            <span>Recent Workout History</span>
          </CardTitle>
          <CardDescription>
            Logs are recorded only when sessions are performed and finished.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="space-y-2">
            {workoutHistory.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-surface-subtle border border-border flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-content-primary">{item.name}</p>
                  <p className="text-[11px] text-content-secondary">
                    {item.date} • {item.durationMins} minutes • {item.setsCompleted} completed sets
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-primary tabular-nums block">
                    {item.totalVolumeKg.toLocaleString()} kg
                  </span>
                  <span className="text-[10px] text-content-tertiary">Total Volume</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
