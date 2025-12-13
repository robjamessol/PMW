/**
 * Workout Complete Screen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/theme';
import { supabase } from '../services/supabase';

type WorkoutCompleteScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'WorkoutComplete'>;
  route: RouteProp<RootStackParamList, 'WorkoutComplete'>;
};

interface WorkoutSummary {
  duration: number;
  totalSets: number;
  completedSets: number;
  totalVolume: number;
  exerciseCount: number;
  muscleGroups: string[];
  personalRecords: number;
}

export const WorkoutCompleteScreen: React.FC<WorkoutCompleteScreenProps> = ({
  navigation,
  route,
}) => {
  const { sessionId } = route.params;
  const [summary, setSummary] = useState<WorkoutSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkoutSummary();
  }, []);

  const loadWorkoutSummary = async () => {
    try {
      const { data: session, error } = await supabase
        .from('workout_sessions')
        .select(`
          created_at,
          completed_at,
          muscle_groups,
          session_exercises (
            id,
            exercise_sets (
              id,
              completed,
              weight,
              achieved_reps
            )
          )
        `)
        .eq('id', sessionId)
        .single();

      if (error) throw error;

      let totalSets = 0;
      let completedSets = 0;
      let totalVolume = 0;

      session.session_exercises?.forEach((exercise: any) => {
        exercise.exercise_sets?.forEach((set: any) => {
          totalSets++;
          if (set.completed) {
            completedSets++;
            totalVolume += (set.weight || 0) * (set.achieved_reps || 0);
          }
        });
      });

      const startTime = new Date(session.created_at);
      const endTime = session.completed_at
        ? new Date(session.completed_at)
        : new Date();
      const durationMinutes = Math.floor(
        (endTime.getTime() - startTime.getTime()) / (1000 * 60)
      );

      // Check for personal records (simplified - would need more logic for actual PR detection)
      const { count: prCount } = await supabase
        .from('personal_records')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', sessionId);

      setSummary({
        duration: durationMinutes,
        totalSets,
        completedSets,
        totalVolume,
        exerciseCount: session.session_exercises?.length || 0,
        muscleGroups: session.muscle_groups,
        personalRecords: prCount || 0,
      });
    } catch (error) {
      console.error('Error loading summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}k`;
    }
    return volume.toString();
  };

  if (loading || !summary) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading summary...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const completionRate = Math.round(
    (summary.completedSets / summary.totalSets) * 100
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Header */}
        <View style={styles.header}>
          <View style={styles.checkmarkContainer}>
            <Ionicons name="checkmark-circle" size={80} color={Colors.success} />
          </View>
          <Text style={styles.title}>Workout Complete!</Text>
          <Text style={styles.subtitle}>Great job crushing it today</Text>
        </View>

        {/* Personal Records */}
        {summary.personalRecords > 0 && (
          <Card style={styles.prCard}>
            <View style={styles.prHeader}>
              <Ionicons name="trophy" size={24} color={Colors.warning} />
              <Text style={styles.prTitle}>
                {summary.personalRecords} New Personal Record
                {summary.personalRecords > 1 ? 's' : ''}!
              </Text>
            </View>
            <Text style={styles.prSubtext}>
              You beat your previous best on some exercises
            </Text>
          </Card>
        )}

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Ionicons name="time-outline" size={28} color={Colors.primary} />
            <Text style={styles.statValue}>
              {formatDuration(summary.duration)}
            </Text>
            <Text style={styles.statLabel}>Duration</Text>
          </Card>

          <Card style={styles.statCard}>
            <Ionicons name="barbell-outline" size={28} color={Colors.primary} />
            <Text style={styles.statValue}>{summary.exerciseCount}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </Card>

          <Card style={styles.statCard}>
            <Ionicons name="layers-outline" size={28} color={Colors.primary} />
            <Text style={styles.statValue}>
              {summary.completedSets}/{summary.totalSets}
            </Text>
            <Text style={styles.statLabel}>Sets Done</Text>
          </Card>

          <Card style={styles.statCard}>
            <Ionicons name="fitness-outline" size={28} color={Colors.primary} />
            <Text style={styles.statValue}>
              {formatVolume(summary.totalVolume)}
            </Text>
            <Text style={styles.statLabel}>Volume (lbs)</Text>
          </Card>
        </View>

        {/* Completion Rate */}
        <Card style={styles.completionCard}>
          <Text style={styles.completionLabel}>Completion Rate</Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${completionRate}%` }]}
            />
          </View>
          <Text style={styles.completionValue}>{completionRate}%</Text>
        </Card>

        {/* Muscles Worked */}
        <Card style={styles.musclesCard}>
          <Text style={styles.musclesLabel}>Muscles Worked</Text>
          <View style={styles.musclesList}>
            {summary.muscleGroups.map((muscle, index) => (
              <View key={index} style={styles.muscleTag}>
                <Text style={styles.muscleTagText}>
                  {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Motivational Message */}
        <View style={styles.motivationSection}>
          <Text style={styles.motivationText}>
            {completionRate >= 100
              ? 'Perfect workout! You completed every set.'
              : completionRate >= 80
              ? 'Excellent work! You pushed through most sets.'
              : completionRate >= 50
              ? 'Good effort! Keep building that consistency.'
              : 'Every rep counts. Come back stronger next time!'}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <Button
          title="Back to Home"
          onPress={() => navigation.replace('Home')}
          size="lg"
          style={styles.homeButton}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.lg,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  checkmarkContainer: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  prCard: {
    backgroundColor: Colors.warning + '20',
    borderColor: Colors.warning,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  prHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  prTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.warning,
  },
  prSubtext: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginLeft: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  completionCard: {
    marginBottom: Spacing.md,
  },
  completionLabel: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.full,
  },
  completionValue: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.success,
    textAlign: 'center',
  },
  musclesCard: {
    marginBottom: Spacing.md,
  },
  musclesLabel: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  musclesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  muscleTag: {
    backgroundColor: Colors.primary + '30',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  muscleTagText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '500',
  },
  motivationSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  motivationText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
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
  homeButton: {
    width: '100%',
  },
});
