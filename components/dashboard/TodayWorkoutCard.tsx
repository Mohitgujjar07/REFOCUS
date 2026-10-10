"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Dumbbell, Clock, Layers, Play, CheckCircle, ShieldAlert } from "lucide-react";
import { WorkoutTemplate } from "@/types";

interface TodayWorkoutCardProps {
  template: WorkoutTemplate;
  isRestDay?: boolean;
  status?: "not_started" | "in_progress" | "completed";
}

export const TodayWorkoutCard: React.FC<TodayWorkoutCardProps> = ({
  template,
  isRestDay = false,
  status = "not_started",
}) => {
  const router = useRouter();

  if (isRestDay) {
    return (
      <Card className="h-full flex flex-col justify-between">
        <div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Recovery Day
              </span>
              <span className="text-xs bg-surface-subtle px-2 py-0.5 rounded-full border border-border">
                Rest & Regeneration
              </span>
            </div>
            <CardTitle className="text-lg mt-1">Active Recovery & Mobility</CardTitle>
            <CardDescription>
              No scheduled lifting today. Your muscles rebuild and adapt during rest.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3.5 bg-primary-soft/60 rounded-lg border border-primary/20 space-y-1.5 text-xs text-content-primary">
              <p className="font-semibold text-primary">Recommended recovery actions:</p>
              <ul className="list-disc list-inside space-y-1 text-content-secondary">
                <li>30–45 minute low-intensity walking to hit step target</li>
                <li>Gentle hamstring, hip flexor and chest stretching</li>
                <li>Maintain 120g protein intake to support muscle repair</li>
              </ul>
            </div>
          </CardContent>
        </div>
        <div className="pt-4 border-t border-border">
          <Link href="/training">
            <Button variant="outline" size="sm" className="w-full">
              Review 4-Day Training Program
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5" />
              Evening Session
            </span>
            <span className="text-xs font-medium text-content-secondary bg-surface-subtle px-2 py-0.5 rounded-full border border-border">
              {template.dayOfWeek}
            </span>
          </div>
          <CardTitle className="text-lg mt-1">{template.name}</CardTitle>
          <CardDescription>{template.focus}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          {/* Workout Stats Meta */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-subtle border border-border/80">
              <Layers className="w-4 h-4 text-primary" />
              <div>
                <span className="text-content-secondary block text-[10px]">Exercises</span>
                <span className="font-semibold text-content-primary tabular-nums">
                  {template.exercises.length} Movements
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-subtle border border-border/80">
              <Clock className="w-4 h-4 text-primary" />
              <div>
                <span className="text-content-secondary block text-[10px]">Est. Duration</span>
                <span className="font-semibold text-content-primary tabular-nums">
                  45–50 Mins
                </span>
              </div>
            </div>
          </div>

          {/* Exercise Preview List */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-content-secondary tracking-wide uppercase">
              Exercise Lineup
            </span>
            <div className="space-y-1">
              {template.exercises.slice(0, 4).map((ex, index) => (
                <div
                  key={ex.id}
                  className="flex items-center justify-between py-1.5 px-2.5 rounded-md bg-surface-subtle/50 text-xs text-content-primary border border-border/50"
                >
                  <span className="font-medium truncate mr-2">
                    {index + 1}. {ex.name}
                  </span>
                  <span className="text-[11px] text-content-secondary font-mono flex-shrink-0">
                    {ex.defaultSets} × {ex.targetReps.split(" ")[0]}
                  </span>
                </div>
              ))}
              {template.exercises.length > 4 && (
                <p className="text-[11px] text-content-tertiary px-1 text-center">
                  + {template.exercises.length - 4} more exercises in this session
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </div>

      <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-2">
        <Button
          variant="primary"
          className="flex-1"
          onClick={() => router.push("/training?action=start")}
        >
          <Play className="w-4 h-4 mr-1.5 fill-current" />
          {status === "completed" ? "Repeat Workout" : "Start Workout Session"}
        </Button>
        <Link href="/training">
          <Button variant="outline" className="w-full sm:w-auto">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};
