/**
 * Plan My Workout (PMW) - Type Definitions
 */

// ============================================
// MUSCLE GROUPS & EXERCISES
// ============================================

export type ExerciseCategory = 'A' | 'B' | 'C';

export interface Exercise {
  id: string;
  name: string;
  displayName: string;
  category: ExerciseCategory;
  enabled: boolean;
  muscleGroup: string;
}

export interface MuscleGroup {
  id: string;
  name: string;
  exercises: Exercise[];
}

// ============================================
// WORKOUT TYPES & CONFIGURATION
// ============================================

export type WorkoutFocus = 'strength' | 'hypertrophy' | 'power' | 'endurance';

export interface WorkoutType {
  id: string;
  name: string;
  description: string;
  repSchemes: string[];
  setsPerExercise: number;
  restSeconds: number;
  exercisesPerMuscle: {
    categoryA: number;
    categoryB: number;
    categoryC: number;
  };
  focus: WorkoutFocus;
}

// ============================================
// WORKOUT SESSION & LOGGING
// ============================================

export interface SetData {
  setNumber: number;
  targetReps: number;
  achievedReps: number | null;
  weight: number | null;
  completed: boolean;
}

export interface GeneratedExercise {
  exercise: Exercise;
  assignedRepScheme: string;
  sets: SetData[];
  previousBest: WorkoutEntry | null;
  targetWeights: number[];
}

export interface WorkoutSession {
  id: string;
  userId: string;
  date: string;
  workoutType: WorkoutType;
  muscleGroups: string[];
  exercises: GeneratedExercise[];
  isCompleted: boolean;
  totalVolume: number;
  duration: number | null; // in seconds
  createdAt: string;
  completedAt: string | null;
}

// ============================================
// WORKOUT HISTORY
// ============================================

export interface WorkoutEntry {
  id: string;
  oderId: string;
  userId: string;
  exerciseId: string;
  date: string;
  repScheme: string;
  sets: {
    reps: number;
    weight: number;
  }[];
  totalVolume: number;
  notes: string | null;
}

// ============================================
// USER & AUTHENTICATION
// ============================================

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  createdAt: string;
  isPremium: boolean;
  settings: UserSettings;
}

export interface UserSettings {
  weightUnit: 'lbs' | 'kg';
  defaultRestTimer: number;
  enabledMuscleGroups: string[];
  preferredWorkoutType: string | null;
}

// ============================================
// AI FEATURES (Premium)
// ============================================

export interface AIWorkoutRequest {
  userId: string;
  prompt: string; // Natural language request
  muscleGroups?: string[];
  duration?: number; // minutes
  intensity?: 'light' | 'moderate' | 'heavy';
}

export interface AIRecommendation {
  type: 'weight_increase' | 'rep_increase' | 'deload' | 'variation';
  message: string;
  suggestedValue?: number;
  confidence: number; // 0-1
}

export interface BeatThisTarget {
  exerciseId: string;
  previousBest: WorkoutEntry;
  recommendations: AIRecommendation[];
  primaryTarget: {
    type: 'weight' | 'reps';
    value: number;
    description: string;
  };
  alternativeTarget: {
    type: 'weight' | 'reps';
    value: number;
    description: string;
  };
}

// ============================================
// NAVIGATION
// ============================================

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  MuscleSelect: undefined;
  ActiveWorkout: { sessionId: string };
  WorkoutComplete: { sessionId: string };
  History: undefined;
  WorkoutDetail: { sessionId: string };
  Settings: undefined;
  ExerciseSettings: undefined;
  Premium: undefined;
};
