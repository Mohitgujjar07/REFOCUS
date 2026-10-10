import assert from "node:assert/strict";
import test from "node:test";

// Calculation formulas mirroring lib/calculations/index.ts
function calculateBmi(weightKg, heightCm) {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Number(bmi.toFixed(1));
}

function calculateNutrientsForGrams(food, quantityGrams) {
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

function calculateDailyNutritionTotals(logs) {
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

function calculateAverageWeight(weights) {
  const validWeights = weights.filter((w) => typeof w === "number" && w > 0);
  if (validWeights.length === 0) return 0;
  const sum = validWeights.reduce((a, b) => a + b, 0);
  return Number((sum / validWeights.length).toFixed(2));
}

function calculateWeightDelta(startWeight, currentWeight) {
  const delta = Number((currentWeight - startWeight).toFixed(2));
  if (Math.abs(delta) < 0.05) {
    return { deltaKg: 0, direction: "neutral", formatted: "0.0 kg" };
  }
  if (delta < 0) {
    return { deltaKg: delta, direction: "loss", formatted: `${Math.abs(delta)} kg lost` };
  }
  return { deltaKg: delta, direction: "gain", formatted: `+${delta} kg gained` };
}

function calculateGoalProgress(startingWeight, currentWeight, targetWeight) {
  if (startingWeight <= 0 || targetWeight <= 0 || currentWeight <= 0) return 0;
  const totalChangeNeeded = startingWeight - targetWeight;
  if (Math.abs(totalChangeNeeded) < 0.001) return 100;
  const changeAchieved = startingWeight - currentWeight;
  const progressFraction = changeAchieved / totalChangeNeeded;
  return Math.max(0, Math.min(100, Math.round(progressFraction * 100)));
}

function calculateWorkoutVolume(sets) {
  return sets
    .filter((s) => s.completed)
    .reduce((sum, s) => sum + (s.weightKg || 0) * (s.reps || 0), 0);
}

// TESTS
test("BMI calculation matches standard formula", () => {
  // Founder starting: 83.15 kg, 165 cm
  const bmi = calculateBmi(83.15, 165);
  // 83.15 / (1.65^2) = 83.15 / 2.7225 = 30.54
  assert.equal(bmi, 30.5);
});

test("BMI handles zero or invalid values gracefully without throwing", () => {
  assert.equal(calculateBmi(0, 165), 0);
  assert.equal(calculateBmi(80, 0), 0);
  assert.equal(calculateBmi(-10, 165), 0);
});

test("Nutrient calculation accurately scales per 100g food values", () => {
  const wholeEgg = {
    caloriesPer100g: 143,
    proteinPer100g: 12.6,
    carbsPer100g: 0.7,
    fatPer100g: 9.5,
  };

  // 3 eggs = 150g
  const nutrients = calculateNutrientsForGrams(wholeEgg, 150);
  assert.equal(nutrients.calories, Math.round(143 * 1.5)); // 215
  assert.equal(nutrients.proteinG, 18.9);
  assert.equal(nutrients.carbsG, 1.0);
  assert.equal(nutrients.fatG, 14.3);
});

test("Nutrient calculation handles zero grams", () => {
  const food = { caloriesPer100g: 200, proteinPer100g: 10, carbsPer100g: 20, fatPer100g: 5 };
  assert.deepEqual(calculateNutrientsForGrams(food, 0), {
    calories: 0,
    proteinG: 0,
    carbsG: 0,
    fatG: 0,
  });
});

test("Daily nutrition totals sum properly across multiple logs", () => {
  const logs = [
    { calories: 215, proteinG: 18.9, carbsG: 1.1, fatG: 14.3 },
    { calories: 300, proteinG: 13.4, carbsG: 38.5, fatG: 9.8 },
    { calories: 480, proteinG: 22.8, carbsG: 68.0, fatG: 11.2 },
  ];
  const totals = calculateDailyNutritionTotals(logs);
  assert.equal(totals.totalCalories, 995);
  assert.equal(Number(totals.totalProteinG.toFixed(1)), 55.1);
});

test("Average weight filters out non-positive entries", () => {
  const weights = [83.15, 82.9, 0, -5, 82.75];
  const avg = calculateAverageWeight(weights);
  assert.equal(avg, 82.93);
});

test("Weight delta identifies direction correctly", () => {
  const loss = calculateWeightDelta(83.15, 82.15);
  assert.equal(loss.direction, "loss");
  assert.equal(loss.deltaKg, -1.0);

  const gain = calculateWeightDelta(83.15, 84.15);
  assert.equal(gain.direction, "gain");
  assert.equal(gain.deltaKg, 1.0);

  const neutral = calculateWeightDelta(83.15, 83.16);
  assert.equal(neutral.direction, "neutral");
});

test("Goal progress percentage clamps between 0% and 100%", () => {
  // Start 83.15, Target 78.0 (5.15kg change needed)
  // Current 83.15 -> 0%
  assert.equal(calculateGoalProgress(83.15, 83.15, 78.0), 0);

  // Current 80.575 -> 50%
  assert.equal(calculateGoalProgress(83.15, 80.575, 78.0), 50);

  // Current 78.0 -> 100%
  assert.equal(calculateGoalProgress(83.15, 78.0, 78.0), 100);

  // Beyond target -> clamped to 100%
  assert.equal(calculateGoalProgress(83.15, 76.0, 78.0), 100);

  // Equal starting and target weights handles gracefully without division error
  assert.equal(calculateGoalProgress(80.0, 80.0, 80.0), 100);
});

test("Workout volume sums only completed sets", () => {
  const sets = [
    { weightKg: 30, reps: 10, completed: true },  // 300
    { weightKg: 30, reps: 10, completed: true },  // 300
    { weightKg: 35, reps: 8, completed: false },  // skipped/incomplete
  ];
  assert.equal(calculateWorkoutVolume(sets), 600);
});
