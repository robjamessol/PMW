/**
 * Active Workout Screen
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Vibration,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, GeneratedExercise, SetData } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/theme';
import { supabase } from '../services/supabase';
import { logSet, completeWorkoutSession } from '../services/workoutGenerator';

type ActiveWorkoutScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ActiveWorkout'>;
  route: RouteProp<RootStackParamList, 'ActiveWorkout'>;
};

export const ActiveWorkoutScreen: React.FC<ActiveWorkoutScreenProps> = ({
  navigation,
  route,
}) => {
  const { sessionId, localExercises } = route.params as any;
  const isDevMode = sessionId === 'dev-mode';
  const [exercises, setExercises] = useState<any[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isDevMode && localExercises) {
      // Dev mode - use local exercises
      const formattedExercises = localExercises.map((ex: any, index: number) => ({
        id: `local-${index}`,
        exercises: {
          id: ex.exercise.id,
          name: ex.exercise.name,
          display_name: ex.exercise.displayName,
        },
        assigned_rep_scheme: ex.assignedRepScheme,
        target_weights: ex.targetWeights,
        exercise_sets: ex.sets.map((set: any, setIndex: number) => ({
          id: `local-set-${index}-${setIndex}`,
          set_number: set.setNumber,
          target_reps: set.targetReps,
          achieved_reps: null,
          weight: null,
          completed: false,
        })),
      }));
      setExercises(formattedExercises);
      setLoading(false);
    } else {
      loadWorkoutSession();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isResting && restTimer > 0) {
      timerRef.current = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            Vibration.vibrate([0, 500, 200, 500]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isResting]);

  const loadWorkoutSession = async () => {
    try {
      const { data: sessionExercises, error } = await supabase
        .from('session_exercises')
        .select(`
          *,
          exercises (*),
          exercise_sets (*)
        `)
        .eq('session_id', sessionId)
        .order('exercise_order');

      if (error) throw error;

      setExercises(sessionExercises || []);
    } catch (error) {
      console.error('Error loading workout:', error);
      Alert.alert('Error', 'Failed to load workout');
    } finally {
      setLoading(false);
    }
  };

  const currentExercise = exercises[currentExerciseIndex];
  const currentSets = currentExercise?.exercise_sets || [];

  const handleLogSet = async (setId: string, setIndex: number) => {
    const set = currentSets[setIndex];
    if (!set.weight || !set.achieved_reps) {
      Alert.alert('Enter Values', 'Please enter weight and reps');
      return;
    }

    try {
      if (!isDevMode) {
        // Only call Supabase if not in dev mode
        await supabase
          .from('exercise_sets')
          .update({
            achieved_reps: parseInt(set.achieved_reps),
            weight: parseFloat(set.weight),
            completed: true,
            completed_at: new Date().toISOString(),
          })
          .eq('id', setId);
      }

      // Update local state
      const updatedExercises = [...exercises];
      updatedExercises[currentExerciseIndex].exercise_sets[setIndex].completed = true;
      updatedExercises[currentExerciseIndex].exercise_sets[setIndex].achieved_reps = parseInt(set.achieved_reps);
      updatedExercises[currentExerciseIndex].exercise_sets[setIndex].weight = parseFloat(set.weight);
      setExercises(updatedExercises);

      // Start rest timer
      setRestTimer(90);
      setIsResting(true);
    } catch (error) {
      console.error('Error logging set:', error);
      Alert.alert('Error', 'Failed to log set');
    }
  };

  const updateSetValue = (setIndex: number, field: 'weight' | 'achieved_reps', value: string) => {
    const updatedExercises = [...exercises];
    updatedExercises[currentExerciseIndex].exercise_sets[setIndex][field] = value;
    setExercises(updatedExercises);
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setIsResting(false);
      setRestTimer(0);
    }
  };

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setIsResting(false);
      setRestTimer(0);
    }
  };

  const handleFinishWorkout = async () => {
    Alert.alert(
      'Finish Workout?',
      'Are you sure you want to finish this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Finish',
          onPress: async () => {
            try {
              if (!isDevMode) {
                await completeWorkoutSession(sessionId);
              }
              // Navigate to completion screen (works in both modes)
              navigation.replace('WorkoutComplete', {
                sessionId,
                localExercises: isDevMode ? exercises : undefined,
              } as any);
            } catch (error) {
              console.error('Error completing workout:', error);
              Alert.alert('Error', 'Failed to complete workout');
            }
          },
        },
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading workout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentExercise) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No exercises found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const completedSets = currentSets.filter((s: any) => s.completed).length;
  const totalSets = currentSets.length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentExerciseIndex + 1) / exercises.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Exercise {currentExerciseIndex + 1} of {exercises.length}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Exercise Header */}
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseName}>
            {currentExercise.exercises?.display_name || currentExercise.exercises?.name}
          </Text>
          <Text style={styles.repScheme}>
            Target: {currentExercise.assigned_rep_scheme}
          </Text>
        </View>

        {/* Beat This Card */}
        {currentExercise.target_weights?.[0] > 0 && (
          <Card style={styles.beatThisCard}>
            <View style={styles.beatThisHeader}>
              <Ionicons name="trophy" size={20} color={Colors.warning} />
              <Text style={styles.beatThisTitle}>BEAT THIS</Text>
            </View>
            <Text style={styles.beatThisValue}>
              {currentExercise.target_weights[0]} lbs
            </Text>
            <Text style={styles.beatThisSubtext}>
              Previous best + 5 lbs
            </Text>
          </Card>
        )}

        {/* Sets */}
        <Text style={styles.setsTitle}>
          Sets ({completedSets}/{totalSets})
        </Text>

        {currentSets.map((set: any, index: number) => (
          <Card
            key={set.id}
            style={[
              styles.setCard,
              set.completed && styles.setCardCompleted,
            ]}
          >
            <View style={styles.setHeader}>
              <Text style={styles.setNumber}>Set {set.set_number}</Text>
              <Text style={styles.targetReps}>
                Target: {set.target_reps} reps
              </Text>
            </View>

            <View style={styles.setInputs}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Weight</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={set.weight?.toString() || ''}
                    onChangeText={(value) => updateSetValue(index, 'weight', value)}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={Colors.textMuted}
                    editable={!set.completed}
                  />
                  <Text style={styles.inputUnit}>lbs</Text>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Reps</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={set.achieved_reps?.toString() || ''}
                    onChangeText={(value) => updateSetValue(index, 'achieved_reps', value)}
                    keyboardType="numeric"
                    placeholder={set.target_reps.toString()}
                    placeholderTextColor={Colors.textMuted}
                    editable={!set.completed}
                  />
                </View>
              </View>

              {!set.completed ? (
                <TouchableOpacity
                  style={styles.logButton}
                  onPress={() => handleLogSet(set.id, index)}
                >
                  <Ionicons name="checkmark" size={24} color={Colors.text} />
                </TouchableOpacity>
              ) : (
                <View style={styles.completedIcon}>
                  <Ionicons name="checkmark-circle" size={32} color={Colors.success} />
                </View>
              )}
            </View>
          </Card>
        ))}

        <View style={{ height: 150 }} />
      </ScrollView>

      {/* Rest Timer */}
      {isResting && (
        <View style={styles.restTimerOverlay}>
          <Card style={styles.restTimerCard}>
            <Text style={styles.restTimerLabel}>Rest Timer</Text>
            <Text style={styles.restTimerValue}>{formatTime(restTimer)}</Text>
            <Button
              title="Skip"
              onPress={() => {
                setIsResting(false);
                setRestTimer(0);
              }}
              variant="outline"
              size="sm"
            />
          </Card>
        </View>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navButton, currentExerciseIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrevExercise}
          disabled={currentExerciseIndex === 0}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={currentExerciseIndex === 0 ? Colors.textMuted : Colors.text}
          />
          <Text
            style={[
              styles.navButtonText,
              currentExerciseIndex === 0 && styles.navButtonTextDisabled,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <Button
          title="Finish"
          onPress={handleFinishWorkout}
          variant="secondary"
          size="sm"
        />

        <TouchableOpacity
          style={[
            styles.navButton,
            currentExerciseIndex === exercises.length - 1 && styles.navButtonDisabled,
          ]}
          onPress={handleNextExercise}
          disabled={currentExerciseIndex === exercises.length - 1}
        >
          <Text
            style={[
              styles.navButtonText,
              currentExerciseIndex === exercises.length - 1 &&
                styles.navButtonTextDisabled,
            ]}
          >
            Next
          </Text>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={
              currentExerciseIndex === exercises.length - 1
                ? Colors.textMuted
                : Colors.text
            }
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.lg,
  },
  progressContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  progressText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    padding: Spacing.md,
  },
  exerciseHeader: {
    marginBottom: Spacing.md,
  },
  exerciseName: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  repScheme: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: '500',
  },
  beatThisCard: {
    backgroundColor: Colors.warning + '20',
    borderColor: Colors.warning,
    borderWidth: 1,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  beatThisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  beatThisTitle: {
    color: Colors.warning,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  beatThisValue: {
    color: Colors.text,
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
  },
  beatThisSubtext: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
  },
  setsTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  setCard: {
    marginBottom: Spacing.sm,
  },
  setCardCompleted: {
    opacity: 0.7,
    borderColor: Colors.success,
    borderWidth: 1,
  },
  setHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  setNumber: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
  },
  targetReps: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  setInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: FontSizes.lg,
    fontWeight: '600',
    paddingVertical: Spacing.sm,
    textAlign: 'center',
  },
  inputUnit: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  logButton: {
    backgroundColor: Colors.primary,
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedIcon: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restTimerOverlay: {
    position: 'absolute',
    bottom: 80,
    left: Spacing.md,
    right: Spacing.md,
  },
  restTimerCard: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
  },
  restTimerLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
  },
  restTimerValue: {
    color: Colors.text,
    fontSize: FontSizes.hero,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.sm,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    color: Colors.text,
    fontSize: FontSizes.md,
  },
  navButtonTextDisabled: {
    color: Colors.textMuted,
  },
});
