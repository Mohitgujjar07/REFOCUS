"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { ArrowRight, TrendingDown } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

interface WeightPoint {
  date: string;
  weightKg: number;
}

interface TodayProgressPreviewProps {
  startingWeightKg: number;
  targetWeightKg: number;
  currentWeightKg: number;
  data: WeightPoint[];
}

export const TodayProgressPreview: React.FC<TodayProgressPreviewProps> = ({
  startingWeightKg,
  targetWeightKg,
  currentWeightKg,
  data,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalLost = (startingWeightKg - currentWeightKg).toFixed(2);

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-primary" />
              <span>Weight Progress & Milestone Trend</span>
            </CardTitle>
            <CardDescription>
              Baseline: {startingWeightKg} kg • Target Milestone: {targetWeightKg} kg
            </CardDescription>
          </div>
          <Link
            href="/progress"
            className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 group"
          >
            <span>Full Analytics</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </CardHeader>

        <CardContent className="pt-2">
          {/* Key Metric Pills */}
          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div className="p-2 rounded-lg bg-surface-subtle border border-border">
              <span className="text-[10px] text-content-secondary uppercase block font-medium">
                Starting
              </span>
              <span className="text-sm font-bold text-content-primary tabular-nums">
                {startingWeightKg} kg
              </span>
            </div>
            <div className="p-2 rounded-lg bg-primary-soft border border-primary/20">
              <span className="text-[10px] text-primary uppercase block font-medium">
                Current
              </span>
              <span className="text-sm font-bold text-primary tabular-nums">
                {currentWeightKg} kg
              </span>
            </div>
            <div className="p-2 rounded-lg bg-surface-subtle border border-border">
              <span className="text-[10px] text-content-secondary uppercase block font-medium">
                Milestone 1
              </span>
              <span className="text-sm font-bold text-content-primary tabular-nums">
                {targetWeightKg} kg
              </span>
            </div>
          </div>

          {/* Sparkline / Chart */}
          <div className="h-44 w-full">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E7E1" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#6B756E"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#E2E7E1" }}
                  />
                  <YAxis
                    domain={[76, 85]}
                    stroke="#6B756E"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#E2E7E1" }}
                    unit="kg"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E2E7E1",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                    formatter={(val: number) => [`${val} kg`, "Recorded Weight"]}
                  />
                  <ReferenceLine
                    y={targetWeightKg}
                    stroke="#16A34A"
                    strokeDasharray="4 4"
                    label={{
                      value: "Milestone: 78kg",
                      position: "insideBottomRight",
                      fill: "#16A34A",
                      fontSize: 10,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weightKg"
                    stroke="#245B46"
                    strokeWidth={2.5}
                    dot={{ fill: "#245B46", r: 3 }}
                    activeDot={{ r: 5, stroke: "#FFFFFF", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-content-secondary bg-surface-subtle rounded-lg">
                Loading progress chart...
              </div>
            )}
          </div>
        </CardContent>
      </div>

      <div className="pt-3 border-t border-border mt-3 flex items-center justify-between text-xs">
        <span className="text-content-secondary">
          Track waist & composition weekly for accurate body recomposition insight.
        </span>
        <Link
          href="/progress"
          className="text-primary font-medium hover:underline flex-shrink-0 ml-2"
        >
          Log Weight
        </Link>
      </div>
    </Card>
  );
};
