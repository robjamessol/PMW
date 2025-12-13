/**
 * Home Screen - Main dashboard
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/theme';
import { supabase } from '../services/supabase';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

interface QuickStat {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [stats, setStats] = useState<QuickStat[]>([
    { label: 'This Week', value: '0', icon: 'calendar', color: Colors.primary },
    { label: 'Total Volume', value: '0 lbs', icon: 'barbell', color: Colors.success },
    { label: 'Streak', value: '0 days', icon: 'flame', color: Colors.warning },
    { label: 'PRs', value: '0', icon: 'trophy', color: Colors.categoryA },
  ]);

  useEffect(() => {
    loadUserData();
    loadRecentWorkouts();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('display_name')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserName(profile.display_name || 'Athlete');
      }
    }
  };

  const loadRecentWorkouts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .order('completed_at', { ascending: false })
        .limit(3);

      if (data) {
        setRecentWorkouts(data);
      }
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{userName || 'Athlete'}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={styles.settingsButton}
          >
            <Ionicons name="settings-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Start Workout Card */}
        <Card style={styles.startWorkoutCard} variant="elevated">
          <View style={styles.startWorkoutContent}>
            <View style={styles.startWorkoutText}>
              <Text style={styles.startWorkoutTitle}>Ready to Train?</Text>
              <Text style={styles.startWorkoutSubtitle}>
                Generate a unique workout tailored to your goals
              </Text>
            </View>
            <Button
              title="Start Workout"
              onPress={() => navigation.navigate('MuscleSelect')}
              size="lg"
            />
          </View>
        </Card>

        {/* Quick Stats */}
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Card key={index} style={styles.statCard}>
              <Ionicons name={stat.icon} size={24} color={stat.color} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card>
          ))}
        </View>

        {/* Recent Workouts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentWorkouts.length > 0 ? (
          recentWorkouts.map((workout, index) => (
            <Card
              key={index}
              style={styles.workoutCard}
              onPress={() =>
                navigation.navigate('WorkoutDetail', { sessionId: workout.id })
              }
            >
              <View style={styles.workoutCardContent}>
                <View>
                  <Text style={styles.workoutDate}>
                    {new Date(workout.completed_at).toLocaleDateString()}
                  </Text>
                  <Text style={styles.workoutMuscles}>
                    {workout.muscle_groups?.join(' + ') || 'Workout'}
                  </Text>
                </View>
                <View style={styles.workoutStats}>
                  <Text style={styles.workoutVolume}>
                    {workout.total_volume?.toLocaleString() || 0} lbs
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={Colors.textSecondary}
                  />
                </View>
              </View>
            </Card>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Ionicons name="barbell-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No workouts yet</Text>
            <Text style={styles.emptySubtext}>
              Start your first workout to see your history
            </Text>
          </Card>
        )}

        {/* Bottom spacing */}
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  userName: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  settingsButton: {
    padding: Spacing.sm,
  },
  startWorkoutCard: {
    backgroundColor: Colors.primaryDark,
    marginBottom: Spacing.lg,
  },
  startWorkoutContent: {
    alignItems: 'center',
  },
  startWorkoutText: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  startWorkoutTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  startWorkoutSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  seeAllText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    padding: Spacing.md,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  workoutCard: {
    marginBottom: Spacing.sm,
  },
  workoutCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutDate: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  workoutMuscles: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  workoutStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  workoutVolume: {
    fontSize: FontSizes.md,
    color: Colors.success,
    fontWeight: '500',
  },
  emptyCard: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  emptySubtext: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
});
