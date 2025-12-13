/**
 * Muscle Selection Screen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, WorkoutType } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/theme';
import { MAX_MUSCLE_GROUPS_PER_WORKOUT } from '../constants';
import { supabase } from '../services/supabase';
import { generateWorkout, createWorkoutSession } from '../services/workoutGenerator';

type MuscleSelectScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MuscleSelect'>;
};

interface MuscleGroup {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  exerciseCount?: number;
}

const MUSCLE_GROUPS: MuscleGroup[] = [
  { id: 'chest', name: 'Chest', icon: 'body', color: '#FF6B6B' },
  { id: 'back', name: 'Back', icon: 'body', color: '#4ECDC4' },
  { id: 'shoulders', name: 'Shoulders', icon: 'body', color: '#A8E6CF' },
  { id: 'biceps', name: 'Biceps', icon: 'body', color: '#DDA0DD' },
  { id: 'triceps', name: 'Triceps', icon: 'body', color: '#87CEEB' },
  { id: 'legs', name: 'Legs', icon: 'body', color: '#FFE66D' },
  { id: 'abs', name: 'Abs', icon: 'body', color: '#FFA07A' },
  { id: 'quadriceps', name: 'Quadriceps', icon: 'body', color: '#98D8C8' },
  { id: 'hamstrings', name: 'Hamstrings', icon: 'body', color: '#F7DC6F' },
  { id: 'calves', name: 'Calves', icon: 'body', color: '#BB8FCE' },
  { id: 'full_body', name: 'Full Body', icon: 'body', color: '#85C1E9' },
];

const WORKOUT_TYPES: WorkoutType[] = [
  {
    id: 'hypertrophy_8_12',
    name: '8-12 Regular',
    description: 'Standard hypertrophy',
    repSchemes: ['8-8-8', '10-10-10', '12-12-12'],
    setsPerExercise: 4,
    restSeconds: 90,
    exercisesPerMuscle: { categoryA: 2, categoryB: 2, categoryC: 1 },
    focus: 'hypertrophy',
  },
  {
    id: 'strength_5x5',
    name: '5x5 Strength',
    description: 'Heavy compounds',
    repSchemes: ['5-5-5-5-5'],
    setsPerExercise: 5,
    restSeconds: 180,
    exercisesPerMuscle: { categoryA: 2, categoryB: 1, categoryC: 0 },
    focus: 'strength',
  },
  {
    id: 'volume',
    name: 'Volume',
    description: 'High volume training',
    repSchemes: ['10-10-10-10-10', '12-12-12-12'],
    setsPerExercise: 5,
    restSeconds: 60,
    exercisesPerMuscle: { categoryA: 2, categoryB: 2, categoryC: 2 },
    focus: 'hypertrophy',
  },
  {
    id: 'power_2_6',
    name: '2-6 Power',
    description: 'Low rep power',
    repSchemes: ['3-3-3', '5-5-5', '6-6-6'],
    setsPerExercise: 4,
    restSeconds: 180,
    exercisesPerMuscle: { categoryA: 3, categoryB: 1, categoryC: 0 },
    focus: 'power',
  },
  {
    id: 'beginner_10_15',
    name: 'Beginner',
    description: '10-15 rep range',
    repSchemes: ['10-10-10', '12-12-12', '15-15-15'],
    setsPerExercise: 3,
    restSeconds: 60,
    exercisesPerMuscle: { categoryA: 1, categoryB: 2, categoryC: 1 },
    focus: 'endurance',
  },
];

export const MuscleSelectScreen: React.FC<MuscleSelectScreenProps> = ({
  navigation,
}) => {
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState<WorkoutType>(
    WORKOUT_TYPES[0]
  );
  const [loading, setLoading] = useState(false);

  const toggleMuscle = (muscleId: string) => {
    if (selectedMuscles.includes(muscleId)) {
      setSelectedMuscles(selectedMuscles.filter((id) => id !== muscleId));
    } else if (selectedMuscles.length < MAX_MUSCLE_GROUPS_PER_WORKOUT) {
      setSelectedMuscles([...selectedMuscles, muscleId]);
    } else {
      Alert.alert(
        'Maximum Reached',
        `You can select up to ${MAX_MUSCLE_GROUPS_PER_WORKOUT} muscle groups per workout`
      );
    }
  };

  const handleGenerate = async () => {
    if (selectedMuscles.length === 0) {
      Alert.alert('Select Muscles', 'Please select at least one muscle group');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Generate the workout
      const exercises = await generateWorkout(
        user.id,
        selectedMuscles,
        selectedWorkoutType
      );

      // Create session in database
      const sessionId = await createWorkoutSession(
        user.id,
        selectedMuscles,
        selectedWorkoutType,
        exercises
      );

      // Navigate to active workout
      navigation.replace('ActiveWorkout', { sessionId });
    } catch (error) {
      console.error('Error generating workout:', error);
      Alert.alert('Error', 'Failed to generate workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Muscle Groups */}
        <Text style={styles.sectionTitle}>Select Muscle Groups</Text>
        <Text style={styles.sectionSubtitle}>
          Choose up to {MAX_MUSCLE_GROUPS_PER_WORKOUT} muscle groups
        </Text>

        <View style={styles.muscleGrid}>
          {MUSCLE_GROUPS.map((muscle) => {
            const isSelected = selectedMuscles.includes(muscle.id);
            return (
              <TouchableOpacity
                key={muscle.id}
                style={[
                  styles.muscleCard,
                  isSelected && { borderColor: muscle.color, borderWidth: 2 },
                ]}
                onPress={() => toggleMuscle(muscle.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.muscleIconContainer,
                    { backgroundColor: isSelected ? muscle.color : Colors.backgroundCard },
                  ]}
                >
                  <Ionicons
                    name={muscle.icon}
                    size={24}
                    color={isSelected ? Colors.background : muscle.color}
                  />
                </View>
                <Text
                  style={[
                    styles.muscleName,
                    isSelected && { color: muscle.color },
                  ]}
                >
                  {muscle.name}
                </Text>
                {isSelected && (
                  <View style={[styles.checkmark, { backgroundColor: muscle.color }]}>
                    <Ionicons name="checkmark" size={12} color={Colors.background} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Workout Type */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>
          Workout Type
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.workoutTypeScroll}
        >
          {WORKOUT_TYPES.map((type) => {
            const isSelected = selectedWorkoutType.id === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.workoutTypeCard,
                  isSelected && styles.workoutTypeCardSelected,
                ]}
                onPress={() => setSelectedWorkoutType(type)}
              >
                <Text
                  style={[
                    styles.workoutTypeName,
                    isSelected && styles.workoutTypeNameSelected,
                  ]}
                >
                  {type.name}
                </Text>
                <Text style={styles.workoutTypeDesc}>{type.description}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Summary */}
        {selectedMuscles.length > 0 && (
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Workout Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Muscles:</Text>
              <Text style={styles.summaryValue}>
                {selectedMuscles
                  .map((id) => MUSCLE_GROUPS.find((m) => m.id === id)?.name)
                  .join(', ')}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Type:</Text>
              <Text style={styles.summaryValue}>{selectedWorkoutType.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Est. Exercises:</Text>
              <Text style={styles.summaryValue}>
                {selectedMuscles.length *
                  (selectedWorkoutType.exercisesPerMuscle.categoryA +
                    selectedWorkoutType.exercisesPerMuscle.categoryB +
                    selectedWorkoutType.exercisesPerMuscle.categoryC)}
              </Text>
            </View>
          </Card>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Generate Button */}
      <View style={styles.bottomBar}>
        <Button
          title={`Generate Workout${
            selectedMuscles.length > 0 ? ` (${selectedMuscles.length})` : ''
          }`}
          onPress={handleGenerate}
          disabled={selectedMuscles.length === 0}
          loading={loading}
          size="lg"
          style={styles.generateButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  muscleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  muscleCard: {
    width: '31%',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  muscleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  muscleName: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 20,
    height: 20,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutTypeScroll: {
    marginBottom: Spacing.lg,
  },
  workoutTypeCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 120,
  },
  workoutTypeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryDark,
  },
  workoutTypeName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  workoutTypeNameSelected: {
    color: Colors.text,
  },
  workoutTypeDesc: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  summaryCard: {
    marginTop: Spacing.md,
  },
  summaryTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  generateButton: {
    width: '100%',
  },
});
