export type DietaryPattern = 
  | "vegetarian_with_eggs" 
  | "vegetarian" 
  | "vegan" 
  | "non_vegetarian" 
  | "pescatarian";

export type FitnessGoalType = 
  | "fat_loss" 
  | "muscle_gain" 
  | "strength" 
  | "general_fitness";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  age?: number;
  heightCm: number;
  startingWeightKg: number;
  currentWeightKg: number;
  targetWeightKg: number;
  preferredUnits: "metric" | "imperial";
  timeZone: string;
  dietaryPattern: DietaryPattern;
  monthlyGroceryBudgetInr?: number;
  availableGymDaysPerWeek: number;
  dailyCalorieTarget: number;
  dailyProteinTargetGrams: number;
  dailyStepTarget: number;
  dailySleepTargetHours: number;
  experienceLevel: ExperienceLevel;
  trainingScheduleDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MetricSummary {
  current: number;
  target: number;
  unit: string;
  status?: "under" | "on_track" | "over";
}

export interface TodayDashboardState {
  greeting: string;
  dateFormatted: string;
  supportiveMessage: string;
  weightMilestone: {
    startingKg: number;
    currentKg: number;
    firstMilestoneKg: number;
    remainingKg: number;
    trendLabel: string;
  };
  calories: MetricSummary;
  protein: MetricSummary;
  steps: MetricSummary;
  sleep: MetricSummary;
  workout: {
    isRestDay: boolean;
    name: string;
    exerciseCount: number;
    durationMinutes: number;
    status: "not_started" | "in_progress" | "completed";
  };
  priorities: DailyPriority[];
  recentMeals: FoodLogEntry[];
  weightTrend: { date: string; weightKg: number }[];
}

export interface DailyPriority {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: "workout" | "nutrition" | "activity" | "recovery";
}

export interface FoodItem {
  id: string;
  name: string;
  category: "protein" | "dairy" | "grains" | "lentils_legumes" | "fruits_vegetables" | "nuts_seeds" | "other";
  servingDescription: string;
  defaultServingGrams: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  isVerified: boolean;
  dietaryTags: string[];
  notes?: string;
}

export interface FoodLogEntry {
  id: string;
  foodId?: string;
  foodName: string;
  mealCategory: "breakfast" | "lunch" | "dinner" | "snacks";
  servingQuantity: number;
  servingUnit: string;
  quantityGrams: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  loggedDate: string; // YYYY-MM-DD
  timestamp: string;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  equipment: string;
  defaultSets: number;
  targetReps: string;
  guidanceNote?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  dayOfWeek: string;
  focus: string;
  exercises: Exercise[];
}

export interface WorkoutSetRecord {
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSetRecord[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  workoutName: string;
  date: string;
  startedAt: string;
  finishedAt?: string;
  status: "in_progress" | "completed" | "abandoned";
  durationMinutes: number;
  exercises: WorkoutExerciseLog[];
  overallNotes?: string;
}

export interface BodyCompositionLog {
  id: string;
  date: string;
  weightKg: number;
  waistCm?: number;
  hipCm?: number;
  bodyFatPercentage?: number;
  skeletalMusclePercentage?: number;
  visceralFatRating?: number;
  notes?: string;
}

export interface HabitItem {
  id: string;
  name: string;
  category: "training" | "nutrition" | "activity" | "sleep" | "wellness";
  frequencyPerWeek: number;
  currentStreak: number;
  isCompletedToday: boolean;
  active: boolean;
}

export interface WeeklyReviewSummary {
  weekStarting: string;
  weekEnding: string;
  startWeightKg: number;
  endWeightKg: number;
  weightDeltaKg: number;
  workoutsCompleted: number;
  workoutsPlanned: number;
  avgCalories: number;
  targetCalories: number;
  avgProteinG: number;
  targetProteinG: number;
  avgSteps: number;
  avgSleepHours: number;
  notes: string;
  recommendations: string[];
}
