import { FoodItem, FoodLogEntry } from "@/types";

/**
 * Calculates Body Mass Index (BMI).
 * Formula: weight (kg) / [height (m)]^2
 * Returns 0 if height is non-positive.
 */
export function calculateBmi(weightKg: number, heightCm: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Number(bmi.toFixed(1));
}

/**
 * Returns WHO BMI classification descriptor.
 */
export function getBmiCategory(bmi: number): string {
  if (bmi <= 0) return "Unknown";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 24.9) return "Normal weight range";
  if (bmi < 29.9) return "Overweight";
  return "Obesity range";
}

/**
 * Calculates nutrients from a food item based on quantity in grams.
 * Formula: nutrientAmount = (nutrientPer100g * quantityGrams) / 100
 */
export function calculateNutrientsForGrams(
  food: Pick<FoodItem, "caloriesPer100g" | "proteinPer100g" | "carbsPer100g" | "fatPer100g">,
  quantityGrams: number
) {
  if (quantityGrams <= 0) {
    return { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 };
  }
  const ratio = quantityGrams / 100;
  return {
    calories: Math.round(food.caloriesPer100g * ratio),
    proteinG: Number((food.proteinPer100g * ratio).toFixed(1)),
    carbsG: Number((food.carbsPer100g * ratio).toFixed(1)),
    fatG: Number((food.fatPer100g * ratio).toFixed(1)),
  };
}

/**
 * Sums up daily totals from an array of food logs.
 */
export function calculateDailyNutritionTotals(logs: FoodLogEntry[]) {
  return logs.reduce(
    (acc, log) => {
      acc.totalCalories += log.calories || 0;
      acc.totalProteinG += log.proteinG || 0;
      acc.totalCarbsG += log.carbsG || 0;
      acc.totalFatG += log.fatG || 0;
      return acc;
    },
    { totalCalories: 0, totalProteinG: 0, totalCarbsG: 0, totalFatG: 0 }
  );
}

/**
 * Computes weekly average weight from a list of weights.
 */
export function calculateAverageWeight(weights: number[]): number {
  const validWeights = weights.filter((w) => typeof w === "number" && w > 0);
  if (validWeights.length === 0) return 0;
  const sum = validWeights.reduce((a, b) => a + b, 0);
  return Number((sum / validWeights.length).toFixed(2));
}

/**
 * Calculates weight change between starting and current.
 * Positive means gained, negative means lost.
 */
export function calculateWeightDelta(startWeight: number, currentWeight: number): {
  deltaKg: number;
  direction: "loss" | "gain" | "neutral";
  formatted: string;
} {
  const delta = Number((currentWeight - startWeight).toFixed(2));
  if (Math.abs(delta) < 0.05) {
    return { deltaKg: 0, direction: "neutral", formatted: "0.0 kg" };
  }
  if (delta < 0) {
    return { deltaKg: delta, direction: "loss", formatted: `${Math.abs(delta)} kg lost` };
  }
  return { deltaKg: delta, direction: "gain", formatted: `+${delta} kg gained` };
}

/**
 * Calculates goal progress percentage towards a target weight.
 * Handles equal, inverse, or zero differences safely without division errors.
 */
export function calculateGoalProgress(
  startingWeight: number,
  currentWeight: number,
  targetWeight: number
): number {
  if (startingWeight <= 0 || targetWeight <= 0 || currentWeight <= 0) return 0;
  
  const totalChangeNeeded = startingWeight - targetWeight;
  // If target equals starting, return 100%
  if (Math.abs(totalChangeNeeded) < 0.001) return 100;

  const changeAchieved = startingWeight - currentWeight;
  const progressFraction = changeAchieved / totalChangeNeeded;

  // Clamp between 0 and 100%
  const percentage = Math.max(0, Math.min(100, Math.round(progressFraction * 100)));
  return percentage;
}

/**
 * Calculates total lifting volume (Weight * Reps) across completed sets.
 */
export function calculateWorkoutVolume(
  sets: { weightKg: number; reps: number; completed: boolean }[]
): number {
  return sets
    .filter((s) => s.completed)
    .reduce((sum, s) => sum + (s.weightKg || 0) * (s.reps || 0), 0);
}
