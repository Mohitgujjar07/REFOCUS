"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { FoodLogEntry } from "@/types";
import { Plus, UtensilsCrossed, ArrowRight } from "lucide-react";

interface TodayNutritionSummaryProps {
  loggedMeals: FoodLogEntry[];
  totalCalories: number;
  calorieTarget: number;
  totalProteinG: number;
  proteinTargetG: number;
  totalCarbsG: number;
  totalFatG: number;
  isEmptyState?: boolean;
}

export const TodayNutritionSummary: React.FC<TodayNutritionSummaryProps> = ({
  loggedMeals,
  totalCalories,
  calorieTarget,
  totalProteinG,
  proteinTargetG,
  totalCarbsG,
  totalFatG,
  isEmptyState = false,
}) => {
  const router = useRouter();

  const calories = isEmptyState ? 0 : totalCalories;
  const protein = isEmptyState ? 0 : totalProteinG;
  const carbs = isEmptyState ? 0 : totalCarbsG;
  const fat = isEmptyState ? 0 : totalFatG;
  const meals = isEmptyState ? [] : loggedMeals;

  const remainingCalories = Math.max(0, calorieTarget - calories);
  const remainingProtein = Math.max(0, proteinTargetG - protein);

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <span>Today&apos;s Nutrition Breakdown</span>
            </CardTitle>
            <CardDescription>
              Target: {calorieTarget} kcal • {proteinTargetG}g protein
            </CardDescription>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push("/nutrition")}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Log Food
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          {/* Calorie & Protein Progress Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-surface-subtle border border-border/80">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-semibold text-content-primary">Calories</span>
                <span className="font-mono text-content-secondary tabular-nums">
                  {calories} / {calorieTarget} kcal
                </span>
              </div>
              <ProgressBar
                value={calories}
                max={calorieTarget}
                variant={calories > calorieTarget ? "warning" : "primary"}
              />
              <span className="text-[11px] text-content-secondary mt-1 block">
                {remainingCalories} kcal allowance left
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface-subtle border border-border/80">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-semibold text-content-primary">Protein</span>
                <span className="font-mono text-emerald-700 tabular-nums">
                  {protein}g / {proteinTargetG}g
                </span>
              </div>
              <ProgressBar
                value={protein}
                max={proteinTargetG}
                variant="success"
              />
              <span className="text-[11px] text-content-secondary mt-1 block">
                {remainingProtein > 0 ? `${remainingProtein}g to reach target` : "Target reached!"}
              </span>
            </div>
          </div>

          {/* Secondary Macro Distribution */}
          <div className="flex items-center justify-around py-2 px-3 rounded-lg bg-surface-subtle/50 border border-border/60 text-xs">
            <div className="text-center">
              <span className="text-content-secondary block text-[10px]">Carbohydrates</span>
              <span className="font-semibold text-content-primary tabular-nums font-mono">{carbs}g</span>
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="text-center">
              <span className="text-content-secondary block text-[10px]">Dietary Fat</span>
              <span className="font-semibold text-content-primary tabular-nums font-mono">{fat}g</span>
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="text-center">
              <span className="text-content-secondary block text-[10px]">Vegetarian / Eggs</span>
              <span className="font-semibold text-primary">Budget ₹1,500</span>
            </div>
          </div>

          {/* Meals List / Empty State */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-content-secondary uppercase tracking-wider">
                Logged Today ({meals.length})
              </span>
              <Link
                href="/nutrition"
                className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-0.5"
              >
                <span>View Full Diary</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {meals.length === 0 ? (
              <div className="p-6 text-center rounded-lg border border-dashed border-border bg-surface-subtle/40">
                <UtensilsCrossed className="w-6 h-6 text-content-tertiary mx-auto mb-2" />
                <p className="text-xs font-medium text-content-secondary">
                  No food logged for today yet
                </p>
                <p className="text-[11px] text-content-tertiary mt-0.5">
                  Track your breakfast, lunch, dinner or snacks to calculate daily calories and protein.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 text-xs"
                  onClick={() => router.push("/nutrition")}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Log First Meal
                </Button>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-surface-subtle border border-border text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-medium text-content-primary truncate">
                        {meal.foodName}
                      </p>
                      <p className="text-[11px] text-content-secondary">
                        {meal.servingQuantity} {meal.servingUnit} ({meal.quantityGrams}g) • <span className="capitalize">{meal.mealCategory}</span>
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 font-mono">
                      <span className="font-semibold text-content-primary tabular-nums block">
                        {meal.calories} kcal
                      </span>
                      <span className="text-[10px] text-emerald-700 tabular-nums">
                        {meal.proteinG}g protein
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </div>

      <div className="pt-3 border-t border-border mt-3 flex justify-between items-center text-xs text-content-secondary">
        <span>Dietary focus: High protein eggs, curd, paneer, soy & lentils.</span>
        <Link href="/nutrition" className="text-primary font-medium hover:underline">
          Manage Catalogue
        </Link>
      </div>
    </Card>
  );
};
