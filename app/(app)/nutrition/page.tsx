"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { INITIAL_FOOD_CATALOGUE, FOUNDER_INITIAL_PROFILE } from "@/lib/constants";
import { FoodItem, FoodLogEntry } from "@/types";
import { calculateNutrientsForGrams } from "@/lib/calculations";
import {
  Apple,
  Search,
  Plus,
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Flame,
  Beef,
  Wheat,
  Droplet,
  Info,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { FoodLogRepository } from "@/lib/repositories/foodLogRepository";

export default function NutritionPage() {
  const { user, profile, isConfigured } = useAuth();
  const [selectedDate, setSelectedDate] = useState("Today, 10 Oct 2026");
  const [currentIsoDate, setCurrentIsoDate] = useState("2026-10-10");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner" | "snacks">("lunch");
  const [activeFood, setActiveFood] = useState<FoodItem>(INITIAL_FOOD_CATALOGUE[0]);
  const [quantityGrams, setQuantityGrams] = useState<number>(INITIAL_FOOD_CATALOGUE[0].defaultServingGrams);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [isAddingFood, setIsAddingFood] = useState(false);

  // Initial logged meals fallback
  const [loggedMeals, setLoggedMeals] = useState<FoodLogEntry[]>([
    {
      id: "log_1",
      foodId: "egg_whole",
      foodName: "Whole Egg (Boiled)",
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
      foodName: "Rolled Oats",
      mealCategory: "breakfast",
      servingQuantity: 1,
      servingUnit: "portion",
      quantityGrams: 40,
      calories: 156,
      proteinG: 5.4,
      carbsG: 26.5,
      fatG: 2.8,
      loggedDate: "2026-10-10",
      timestamp: "08:10 AM",
    },
    {
      id: "log_3",
      foodId: "milk_toned",
      foodName: "Toned Cow Milk",
      mealCategory: "breakfast",
      servingQuantity: 1,
      servingUnit: "glass",
      quantityGrams: 250,
      calories: 145,
      proteinG: 8.0,
      carbsG: 12.0,
      fatG: 7.5,
      loggedDate: "2026-10-10",
      timestamp: "08:15 AM",
    },
    {
      id: "log_4",
      foodId: "dal_tadka_cooked",
      foodName: "Cooked Toor / Moong Dal",
      mealCategory: "lunch",
      servingQuantity: 1.5,
      servingUnit: "katoris",
      quantityGrams: 225,
      calories: 236,
      proteinG: 12.4,
      carbsG: 33.8,
      fatG: 6.3,
      loggedDate: "2026-10-10",
      timestamp: "01:20 PM",
    },
    {
      id: "log_5",
      foodId: "roti_wheat",
      foodName: "Whole Wheat Roti",
      mealCategory: "lunch",
      servingQuantity: 2,
      servingUnit: "rotis",
      quantityGrams: 70,
      calories: 168,
      proteinG: 6.0,
      carbsG: 34.3,
      fatG: 1.1,
      loggedDate: "2026-10-10",
      timestamp: "01:25 PM",
    },
  ]);

  // Load persistent food logs from Firestore when user is authenticated
  React.useEffect(() => {
    async function loadUserFoodLogs() {
      if (user && isConfigured) {
        setIsLoadingLogs(true);
        try {
          const logs = await FoodLogRepository.getFoodLogsForDate(user.uid, currentIsoDate);
          setLoggedMeals(logs);
        } catch (err) {
          console.error("Failed to fetch food logs from Firestore:", err);
        } finally {
          setIsLoadingLogs(false);
        }
      }
    }
    loadUserFoodLogs();
  }, [user, isConfigured, currentIsoDate]);

  // Live calculation of preview food
  const previewNutrients = calculateNutrientsForGrams(activeFood, quantityGrams);

  // Filter catalogue
  const filteredFoodCatalogue = INITIAL_FOOD_CATALOGUE.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate day totals
  const totalCalories = loggedMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = Number(loggedMeals.reduce((acc, m) => acc + m.proteinG, 0).toFixed(1));
  const totalCarbs = Number(loggedMeals.reduce((acc, m) => acc + m.carbsG, 0).toFixed(1));
  const totalFat = Number(loggedMeals.reduce((acc, m) => acc + m.fatG, 0).toFixed(1));

  const calorieTarget = profile?.dailyCalorieTarget || FOUNDER_INITIAL_PROFILE.dailyCalorieTarget;
  const proteinTarget = profile?.dailyProteinTargetGrams || FOUNDER_INITIAL_PROFILE.dailyProteinTargetGrams;

  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantityGrams <= 0) return;

    setIsAddingFood(true);
    const newLogData: Omit<FoodLogEntry, "id"> = {
      foodId: activeFood.id,
      foodName: activeFood.name,
      mealCategory: selectedMealType,
      servingQuantity: 1,
      servingUnit: `${quantityGrams}g`,
      quantityGrams: quantityGrams,
      calories: previewNutrients.calories,
      proteinG: previewNutrients.proteinG,
      carbsG: previewNutrients.carbsG,
      fatG: previewNutrients.fatG,
      loggedDate: currentIsoDate,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    try {
      if (user && isConfigured) {
        const persisted = await FoodLogRepository.addFoodLog(user.uid, newLogData);
        setLoggedMeals([persisted, ...loggedMeals]);
      } else {
        const localLog: FoodLogEntry = {
          ...newLogData,
          id: `log_${Date.now()}`,
        };
        setLoggedMeals([localLog, ...loggedMeals]);
      }
    } catch (err) {
      console.error("Failed to add food log:", err);
      alert("Failed to save food log to Firestore. Please check your network connection.");
    } finally {
      setIsAddingFood(false);
    }
  };

  const handleDeleteFood = async (id: string) => {
    if (!window.confirm("Remove this entry from today's diary?")) return;

    try {
      if (user && isConfigured) {
        await FoodLogRepository.deleteFoodLog(user.uid, id);
      }
      setLoggedMeals(loggedMeals.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Failed to delete food log:", err);
      alert("Failed to delete entry from Firestore.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-content-primary flex items-center gap-2">
            <Apple className="w-6 h-6 text-primary" />
            <span>Nutrition & Macro Tracker</span>
          </h1>
          <p className="text-xs text-content-secondary mt-0.5">
            Designed for Indian vegetarian diets with eggs. Track calories, protein density and portions.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-lg shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setSelectedDate("Yesterday, 9 Oct 2026")}
            className="p-1 text-content-secondary hover:text-content-primary rounded hover:bg-surface-subtle"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-content-primary px-1">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>{selectedDate}</span>
          </div>
          <button
            onClick={() => setSelectedDate("Today, 10 Oct 2026")}
            className="p-1 text-content-secondary hover:text-content-primary rounded hover:bg-surface-subtle"
            aria-label="Next day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Daily Macro Progress Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 bg-card border border-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-content-secondary flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-600" /> Calories
            </span>
            <span className="text-xs font-bold text-content-primary tabular-nums">
              {totalCalories} / {calorieTarget}
            </span>
          </div>
          <ProgressBar value={totalCalories} max={calorieTarget} variant="primary" />
          <span className="text-[10px] text-content-secondary mt-1 block">
            {Math.max(0, calorieTarget - totalCalories)} kcal remaining
          </span>
        </Card>

        <Card className="p-4 bg-card border border-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-content-secondary flex items-center gap-1">
              <Beef className="w-3.5 h-3.5 text-emerald-600" /> Protein
            </span>
            <span className="text-xs font-bold text-emerald-700 tabular-nums">
              {totalProtein}g / {proteinTarget}g
            </span>
          </div>
          <ProgressBar value={totalProtein} max={proteinTarget} variant="success" />
          <span className="text-[10px] text-content-secondary mt-1 block">
            {Math.max(0, proteinTarget - totalProtein).toFixed(1)}g to hit 120g target
          </span>
        </Card>

        <Card className="p-4 bg-card border border-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-content-secondary flex items-center gap-1">
              <Wheat className="w-3.5 h-3.5 text-amber-700" /> Carbs
            </span>
            <span className="text-xs font-bold text-content-primary tabular-nums">
              {totalCarbs}g
            </span>
          </div>
          <ProgressBar value={totalCarbs} max={200} variant="primary" />
          <span className="text-[10px] text-content-secondary mt-1 block">
            Energy for training & studies
          </span>
        </Card>

        <Card className="p-4 bg-card border border-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-content-secondary flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5 text-blue-600" /> Fat
            </span>
            <span className="text-xs font-bold text-content-primary tabular-nums">
              {totalFat}g
            </span>
          </div>
          <ProgressBar value={totalFat} max={65} variant="primary" />
          <span className="text-[10px] text-content-secondary mt-1 block">
            Hormonal health baseline
          </span>
        </Card>
      </div>

      {/* Main Two-Column Layout: Food Selector / Log Form + Daily Diary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Food Search and Logging Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Log Food Item</span>
                <span className="text-xs font-normal text-content-secondary bg-surface-subtle px-2 py-0.5 rounded border border-border">
                  Indian Foods
                </span>
              </CardTitle>
              <CardDescription>
                Search verified Indian food items or select from catalogue.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-content-tertiary absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search eggs, paneer, dal, soya, roti..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-card focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-content-primary"
                />
              </div>

              {/* Food Catalogue List */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {filteredFoodCatalogue.map((food) => {
                  const isSelected = activeFood.id === food.id;
                  return (
                    <button
                      key={food.id}
                      type="button"
                      onClick={() => {
                        setActiveFood(food);
                        setQuantityGrams(food.defaultServingGrams);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-primary-soft border-primary/40 text-primary font-semibold"
                          : "bg-surface-subtle/40 border-border hover:bg-surface-subtle text-content-primary"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="truncate">{food.name}</p>
                        <p className="text-[10px] text-content-secondary font-normal truncate">
                          {food.servingDescription}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 font-mono text-[11px]">
                        <span className="block font-medium">{food.caloriesPer100g} kcal/100g</span>
                        <span className="text-emerald-700">{food.proteinPer100g}g P</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Serving & Quantity Calculator Form */}
              <form onSubmit={handleAddFood} className="p-3.5 rounded-lg bg-surface-subtle border border-border space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-content-primary">
                  <span>Selected: {activeFood.name}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-content-secondary mb-1">
                      Meal Slot
                    </label>
                    <select
                      value={selectedMealType}
                      onChange={(e) => setSelectedMealType(e.target.value as any)}
                      className="w-full p-1.5 rounded-md border border-border bg-card text-content-primary text-xs"
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snacks">Snacks</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-content-secondary mb-1">
                      Quantity (grams)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="2000"
                      value={quantityGrams}
                      onChange={(e) => setQuantityGrams(Number(e.target.value))}
                      className="w-full p-1.5 rounded-md border border-border bg-card text-content-primary text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Live Macro Calculation Preview */}
                <div className="p-2 bg-card rounded-md border border-border/80 flex items-center justify-around text-center text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-content-secondary block">Calories</span>
                    <span className="font-bold text-content-primary tabular-nums">
                      {previewNutrients.calories} kcal
                    </span>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <div>
                    <span className="text-[10px] text-content-secondary block">Protein</span>
                    <span className="font-bold text-emerald-700 tabular-nums">
                      {previewNutrients.proteinG}g
                    </span>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <div>
                    <span className="text-[10px] text-content-secondary block">Carbs</span>
                    <span className="font-semibold text-content-primary tabular-nums">
                      {previewNutrients.carbsG}g
                    </span>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <div>
                    <span className="text-[10px] text-content-secondary block">Fat</span>
                    <span className="font-semibold text-content-primary tabular-nums">
                      {previewNutrients.fatG}g
                    </span>
                  </div>
                </div>

                <Button type="submit" variant="primary" size="sm" className="w-full" isLoading={isAddingFood}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add to {selectedMealType.toUpperCase()}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Daily Diary Breakdown (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Logged Food Diary</CardTitle>
                  <CardDescription>
                    Snapshot nutrients are preserved for historical integrity.
                  </CardDescription>
                </div>
                <span className="text-xs font-semibold text-primary tabular-nums">
                  {loggedMeals.length} Entries
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              {(["breakfast", "lunch", "snacks", "dinner"] as const).map((mealType) => {
                const mealsForSlot = loggedMeals.filter((m) => m.mealCategory === mealType);
                const slotCalories = mealsForSlot.reduce((sum, m) => sum + m.calories, 0);
                const slotProtein = Number(
                  mealsForSlot.reduce((sum, m) => sum + m.proteinG, 0).toFixed(1)
                );

                return (
                  <div
                    key={mealType}
                    className="p-3.5 rounded-xl bg-surface-subtle/50 border border-border space-y-2.5"
                  >
                    <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-content-primary">
                          {mealType}
                        </span>
                        <span className="text-[11px] text-content-tertiary">
                          ({mealsForSlot.length} items)
                        </span>
                      </div>
                      <div className="text-xs font-mono text-content-secondary tabular-nums">
                        <strong className="text-content-primary font-semibold">{slotCalories} kcal</strong> •{" "}
                        <span className="text-emerald-700 font-medium">{slotProtein}g P</span>
                      </div>
                    </div>

                    {mealsForSlot.length === 0 ? (
                      <p className="text-[11px] text-content-tertiary italic py-1">
                        No food recorded for {mealType}.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {mealsForSlot.map((meal) => (
                          <div
                            key={meal.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/80 text-xs shadow-xs"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="font-medium text-content-primary truncate">
                                {meal.foodName}
                              </p>
                              <p className="text-[11px] text-content-secondary">
                                {meal.quantityGrams}g • {meal.timestamp}
                              </p>
                            </div>

                            <div className="flex items-center gap-3 flex-shrink-0">
                              <div className="text-right font-mono text-[11px]">
                                <span className="font-semibold text-content-primary tabular-nums block">
                                  {meal.calories} kcal
                                </span>
                                <span className="text-[10px] text-emerald-700 tabular-nums">
                                  {meal.proteinG}g P
                                </span>
                              </div>
                              <button
                                onClick={() => handleDeleteFood(meal.id)}
                                className="p-1 text-content-tertiary hover:text-status-error rounded hover:bg-surface-subtle transition-colors"
                                aria-label={`Delete ${meal.foodName}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
