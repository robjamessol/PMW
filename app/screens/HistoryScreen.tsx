/**
 * Workout History Screen
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { Card } from '../components/Card';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/theme';
import { supabase } from '../services/supabase';

type HistoryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'History'>;
};

interface WorkoutHistoryItem {
  id: string;
  created_at: string;
  completed_at: string | null;
  muscle_groups: string[];
  workout_type: string;
  status: 'completed' | 'abandoned' | 'in_progress';
  total_sets: number;
  completed_sets: number;
  total_volume: number;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const [workouts, setWorkouts] = useState<WorkoutHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: sessions, error } = await supabase
        .from('workout_sessions')
        .select(`
          id,
          created_at,
          completed_at,
          muscle_groups,
          workout_type,
          status,
          session_exercises (
            exercise_sets (
              id,
              completed,
              weight,
              achieved_reps
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedWorkouts: WorkoutHistoryItem[] = (sessions || []).map((session) => {
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

        return {
          id: session.id,
          created_at: session.created_at,
          completed_at: session.completed_at,
          muscle_groups: session.muscle_groups,
          workout_type: session.workout_type,
          status: session.status,
          total_sets: totalSets,
          completed_sets: completedSets,
          total_volume: totalVolume,
        };
      });

      setWorkouts(formattedWorkouts);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatDuration = (start: string, end: string | null) => {
    if (!end) return '--';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMinutes = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60)
    );
    return `${diffMinutes} min`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}k lbs`;
    }
    return `${volume} lbs`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return Colors.success;
      case 'abandoned':
        return Colors.error;
      default:
        return Colors.warning;
    }
  };

  const getStatusIcon = (status: string): keyof typeof Ionicons.glyphMap => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'abandoned':
        return 'close-circle';
      default:
        return 'time';
    }
  };

  const renderWorkoutItem = ({ item }: { item: WorkoutHistoryItem }) => (
    <Card style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <View style={styles.workoutDate}>
          <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
          <View style={styles.statusBadge}>
            <Ionicons
              name={getStatusIcon(item.status)}
              size={14}
              color={getStatusColor(item.status)}
            />
          </View>
        </View>
        <Text style={styles.workoutType}>{item.workout_type}</Text>
      </View>

      <View style={styles.muscleGroups}>
        {item.muscle_groups.map((muscle, index) => (
          <View key={index} style={styles.muscleTag}>
            <Text style={styles.muscleTagText}>
              {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.workoutStats}>
        <View style={styles.stat}>
          <Ionicons name="barbell" size={16} color={Colors.textSecondary} />
          <Text style={styles.statValue}>
            {item.completed_sets}/{item.total_sets}
          </Text>
          <Text style={styles.statLabel}>Sets</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.stat}>
          <Ionicons name="fitness" size={16} color={Colors.textSecondary} />
          <Text style={styles.statValue}>{formatVolume(item.total_volume)}</Text>
          <Text style={styles.statLabel}>Volume</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.stat}>
          <Ionicons name="time" size={16} color={Colors.textSecondary} />
          <Text style={styles.statValue}>
            {formatDuration(item.created_at, item.completed_at)}
          </Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="fitness-outline" size={64} color={Colors.textMuted} />
      <Text style={styles.emptyTitle}>No Workouts Yet</Text>
      <Text style={styles.emptySubtitle}>
        Complete your first workout to see it here
      </Text>
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('MuscleSelect')}
      >
        <Text style={styles.startButtonText}>Start Workout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workout History</Text>
        <Text style={styles.subtitle}>
          {workouts.length} workout{workouts.length !== 1 ? 's' : ''} logged
        </Text>
      </View>

      <FlatList
        data={workouts}
        renderItem={renderWorkoutItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={!loading ? renderEmptyState : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  list: {
    padding: Spacing.md,
    paddingTop: 0,
  },
  workoutCard: {
    marginBottom: Spacing.md,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  workoutDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dateText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
  },
  statusBadge: {
    marginLeft: Spacing.xs,
  },
  workoutType: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '500',
  },
  muscleGroups: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  muscleTag: {
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  muscleTagText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  workoutStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  startButtonText: {
    color: Colors.text,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
