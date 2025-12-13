/**
 * Workout Generation Service
 *
 * Generates unique workouts based on:
 * - Selected muscle groups
 * - Workout type (rep scheme, volume)
 * - User's enabled exercises
 * - Historical performance (for "BEAT THIS" targets)
 */

import { supabase } from './supabase';
import {
  Exercise,
  WorkoutType,
  GeneratedExercise,
  WorkoutSession,
  SetData,
  WorkoutEntry,
} from '../types';

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Parses a rep scheme string into individual set targets
 * e.g., "8-8-8-8" -> [8, 8, 8, 8]
 */
function parseRepScheme(scheme: string): number[] {
  return scheme.split('-').map((r) => parseInt(r, 10));
}

/**
 * Gets enabled exercises for a user by muscle group
 */
async function getEnabledExercises(
  userId: string,
  muscleGroupId: string
): Promise<Exercise[]> {
  const { data, error } = await supabase
    .from('exercises')
    .select(`
      *,
      user_exercise_settings!left (enabled)
    `)
    .eq('muscle_group_id', muscleGroupId)
    .or(`user_exercise_settings.user_id.eq.${userId},user_exercise_settings.user_id.is.null`);

  if (error) throw error;

  // Filter to only enabled exercises (default is enabled if no user setting)
  return (data || [])
    .filter((e) => e.user_exercise_settings?.[0]?.enabled !== false)
    .map((e) => ({
      id: e.id,
      name: e.name,
      displayName: e.display_name,
      category: e.category,
      enabled: true,
      muscleGroup: e.muscle_group_id,
    }));
}

/**
 * Gets the user's previous best performance for an exercise + rep scheme
 */
async function getPreviousBest(
  userId: string,
  exerciseId: string,
  repScheme: string
): Promise<WorkoutEntry | null> {
  const { data, error } = await supabase.rpc('get_previous_best', {
    p_user_id: userId,
    p_exercise_id: exerciseId,
    p_rep_scheme: repScheme,
  });

  if (error || !data || data.length === 0) return null;

  return {
    id: data[0].session_id,
    oderId: '',
    userId,
    exerciseId,
    date: data[0].workout_date,
    repScheme,
    sets: [], // TODO: Fetch full set data if needed
    totalVolume: data[0].total_volume,
    notes: null,
  };
}

/**
 * Calculates target weights based on previous best
 * Options: +5 lbs per set OR same weight with +1-2 reps target
 */
function calculateTargetWeights(
  previousBest: WorkoutEntry | null,
  numSets: number
): number[] {
  if (!previousBest || previousBest.sets.length === 0) {
    // No previous data - return zeros (user will input)
    return Array(numSets).fill(0);
  }

  // Suggest +5 lbs from previous max weight
  const previousMaxWeight = Math.max(...previousBest.sets.map((s) => s.weight));
  const targetWeight = previousMaxWeight + 5;

  return Array(numSets).fill(targetWeight);
}

/**
 * Main workout generation function
 */
export async function generateWorkout(
  userId: string,
  muscleGroupIds: string[],
  workoutType: WorkoutType
): Promise<GeneratedExercise[]> {
  const generatedExercises: GeneratedExercise[] = [];

  for (const muscleGroupId of muscleGroupIds) {
    // Get all enabled exercises for this muscle group
    const exercises = await getEnabledExercises(userId, muscleGroupId);

    // Separate by category
    const categoryA = exercises.filter((e) => e.category === 'A');
    const categoryB = exercises.filter((e) => e.category === 'B');
    const categoryC = exercises.filter((e) => e.category === 'C');

    // Randomly select exercises based on workout type config
    const selectedA = shuffleArray(categoryA).slice(
      0,
      workoutType.exercisesPerMuscle.categoryA
    );
    const selectedB = shuffleArray(categoryB).slice(
      0,
      workoutType.exercisesPerMuscle.categoryB
    );
    const selectedC = shuffleArray(categoryC).slice(
      0,
      workoutType.exercisesPerMuscle.categoryC
    );

    const selectedExercises = [...selectedA, ...selectedB, ...selectedC];

    // For each selected exercise, assign rep scheme and get previous best
    for (const exercise of selectedExercises) {
      // Pick a random rep scheme from the workout type
      const repScheme =
        workoutType.repSchemes[
          Math.floor(Math.random() * workoutType.repSchemes.length)
        ];

      const repsPerSet = parseRepScheme(repScheme);

      // Get previous best for "BEAT THIS" display
      const previousBest = await getPreviousBest(userId, exercise.id, repScheme);

      // Calculate target weights
      const targetWeights = calculateTargetWeights(previousBest, repsPerSet.length);

      // Create set data structure
      const sets: SetData[] = repsPerSet.map((targetReps, index) => ({
        setNumber: index + 1,
        targetReps,
        achievedReps: null,
        weight: null,
        completed: false,
      }));

      generatedExercises.push({
        exercise,
        assignedRepScheme: repScheme,
        sets,
        previousBest,
        targetWeights,
      });
    }
  }

  // Shuffle final order for variety (compounds will still tend to be first due to selection order)
  return shuffleArray(generatedExercises);
}

/**
 * Creates a new workout session in the database
 */
export async function createWorkoutSession(
  userId: string,
  muscleGroupIds: string[],
  workoutType: WorkoutType,
  exercises: GeneratedExercise[],
  isAiGenerated: boolean = false,
  aiPrompt?: string
): Promise<string> {
  // Create session
  const { data: session, error: sessionError } = await supabase
    .from('workout_sessions')
    .insert({
      user_id: userId,
      workout_type_id: workoutType.id,
      muscle_groups: muscleGroupIds,
      is_ai_generated: isAiGenerated,
      ai_prompt: aiPrompt,
    })
    .select()
    .single();

  if (sessionError) throw sessionError;

  // Create session exercises
  for (let i = 0; i < exercises.length; i++) {
    const genExercise = exercises[i];

    const { data: sessionExercise, error: exerciseError } = await supabase
      .from('session_exercises')
      .insert({
        session_id: session.id,
        exercise_id: genExercise.exercise.id,
        exercise_order: i + 1,
        assigned_rep_scheme: genExercise.assignedRepScheme,
        previous_best_id: genExercise.previousBest?.id,
        target_weights: genExercise.targetWeights,
      })
      .select()
      .single();

    if (exerciseError) throw exerciseError;

    // Create sets for this exercise
    const setsToInsert = genExercise.sets.map((set) => ({
      session_exercise_id: sessionExercise.id,
      set_number: set.setNumber,
      target_reps: set.targetReps,
    }));

    const { error: setsError } = await supabase
      .from('exercise_sets')
      .insert(setsToInsert);

    if (setsError) throw setsError;
  }

  return session.id;
}

/**
 * Logs a completed set
 */
export async function logSet(
  setId: string,
  achievedReps: number,
  weight: number
): Promise<void> {
  const { error } = await supabase
    .from('exercise_sets')
    .update({
      achieved_reps: achievedReps,
      weight,
      completed: true,
      completed_at: new Date().toISOString(),
    })
    .eq('id', setId);

  if (error) throw error;
}

/**
 * Completes a workout session
 */
export async function completeWorkoutSession(
  sessionId: string
): Promise<void> {
  // Calculate total volume
  const { data: sets } = await supabase
    .from('exercise_sets')
    .select(`
      achieved_reps,
      weight,
      session_exercises!inner (session_id)
    `)
    .eq('session_exercises.session_id', sessionId)
    .eq('completed', true);

  const totalVolume = (sets || []).reduce(
    (sum, set) => sum + (set.achieved_reps || 0) * (set.weight || 0),
    0
  );

  // Update session
  const { error } = await supabase
    .from('workout_sessions')
    .update({
      is_completed: true,
      total_volume: totalVolume,
      completed_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  if (error) throw error;
}
