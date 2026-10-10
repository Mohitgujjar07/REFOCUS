"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { DailyPriority } from "@/types";
import { CheckCircle2, Circle, Dumbbell, Utensils, Footprints, Moon } from "lucide-react";

interface TodayPrioritiesProps {
  initialPriorities: DailyPriority[];
}

export const TodayPriorities: React.FC<TodayPrioritiesProps> = ({ initialPriorities }) => {
  const [priorities, setPriorities] = useState<DailyPriority[]>(initialPriorities);

  const togglePriority = (id: string) => {
    setPriorities((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = priorities.filter((p) => p.completed).length;
  const progressPercent = Math.round((completedCount / priorities.length) * 100);

  const getIcon = (category: DailyPriority["category"]) => {
    switch (category) {
      case "workout":
        return <Dumbbell className="w-4 h-4 text-primary" />;
      case "nutrition":
        return <Utensils className="w-4 h-4 text-emerald-600" />;
      case "activity":
        return <Footprints className="w-4 h-4 text-teal-600" />;
      case "recovery":
        return <Moon className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <span>Today&apos;s Action Priorities</span>
              <span className="text-xs font-normal text-content-secondary bg-surface-subtle px-2 py-0.5 rounded-full border border-border tabular-nums">
                {completedCount}/{priorities.length} Done
              </span>
            </CardTitle>
            <CardDescription>
              Key daily actions based on your college schedule and goals.
            </CardDescription>
          </div>
          <span className="text-xs font-semibold text-primary tabular-nums">
            {progressPercent}%
          </span>
        </CardHeader>

        <CardContent className="pt-3 space-y-2.5">
          {priorities.map((item) => (
            <button
              key={item.id}
              onClick={() => togglePriority(item.id)}
              className={`w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-all ${
                item.completed
                  ? "bg-surface-subtle/70 border-border/60 opacity-80"
                  : "bg-card border-border hover:border-primary/40 hover:bg-surface-subtle/30 shadow-xs"
              }`}
              aria-label={`Mark "${item.title}" as ${item.completed ? "incomplete" : "complete"}`}
            >
              <div className="mt-0.5 flex-shrink-0 text-primary">
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-status-success fill-status-successBg" />
                ) : (
                  <Circle className="w-5 h-5 text-content-tertiary" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium ${
                      item.completed
                        ? "line-through text-content-secondary"
                        : "text-content-primary"
                    }`}
                  >
                    {item.title}
                  </span>
                  <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
                    {getIcon(item.category)}
                  </div>
                </div>
                <p
                  className={`text-xs mt-0.5 ${
                    item.completed ? "text-content-tertiary" : "text-content-secondary"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </CardContent>
      </div>

      <div className="p-3 mt-3 bg-surface-subtle rounded-lg border border-border/80 text-[11px] text-content-secondary">
        💡 <strong>Founder Tip:</strong> After college (4:00 PM), drink 500ml water and eat 1 banana or a handful of roasted chana before your 5:30 PM gym session.
      </div>
    </Card>
  );
};
