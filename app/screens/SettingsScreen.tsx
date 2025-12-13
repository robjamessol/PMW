/**
 * Settings Screen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { Card } from '../components/Card';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/theme';
import { supabase } from '../services/supabase';

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

interface UserProfile {
  display_name: string;
  email: string;
  preferred_unit: 'lbs' | 'kg';
  notifications_enabled: boolean;
}

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  destructive?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
  destructive,
}) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    disabled={!onPress && !rightElement}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <View style={styles.settingLeft}>
      <View
        style={[
          styles.iconContainer,
          destructive && styles.iconContainerDestructive,
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={destructive ? Colors.error : Colors.primary}
        />
      </View>
      <View style={styles.settingText}>
        <Text
          style={[styles.settingTitle, destructive && styles.settingTitleDestructive]}
        >
          {title}
        </Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {rightElement || (onPress && (
      <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
    ))}
  </TouchableOpacity>
);

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData, error } = await supabase
        .from('users')
        .select('display_name, preferred_unit, notifications_enabled')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      setProfile({
        display_name: userData?.display_name || user.user_metadata?.display_name || 'User',
        email: user.email || '',
        preferred_unit: userData?.preferred_unit || 'lbs',
        notifications_enabled: userData?.notifications_enabled ?? true,
      });

      setNotificationsEnabled(userData?.notifications_enabled ?? true);
      setWeightUnit(userData?.preferred_unit || 'lbs');
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (field: string, value: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('users')
        .update({ [field]: value })
        .eq('id', user.id);
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  const handleToggleNotifications = (value: boolean) => {
    setNotificationsEnabled(value);
    updateSetting('notifications_enabled', value);
  };

  const handleToggleWeightUnit = () => {
    const newUnit = weightUnit === 'lbs' ? 'kg' : 'lbs';
    setWeightUnit(newUnit);
    updateSetting('preferred_unit', newUnit);
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all workout data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirm Deletion',
              'Type DELETE to confirm account deletion',
              [{ text: 'Cancel', style: 'cancel' }]
            );
            // In production, would implement actual account deletion
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.display_name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.displayName}>{profile?.display_name}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
        </View>

        {/* Account Settings */}
        <Text style={styles.sectionTitle}>Account</Text>
        <Card style={styles.settingsCard}>
          <SettingItem
            icon="person"
            title="Edit Profile"
            subtitle="Update your name and details"
            onPress={() => {
              // Would navigate to edit profile screen
              Alert.alert('Coming Soon', 'Profile editing will be available soon');
            }}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="key"
            title="Change Password"
            onPress={() => {
              Alert.alert('Coming Soon', 'Password change will be available soon');
            }}
          />
        </Card>

        {/* Workout Settings */}
        <Text style={styles.sectionTitle}>Workout</Text>
        <Card style={styles.settingsCard}>
          <SettingItem
            icon="barbell"
            title="Weight Unit"
            subtitle={weightUnit === 'lbs' ? 'Pounds' : 'Kilograms'}
            onPress={handleToggleWeightUnit}
            rightElement={
              <View style={styles.unitToggle}>
                <Text style={[styles.unitText, weightUnit === 'lbs' && styles.unitTextActive]}>
                  lbs
                </Text>
                <Text style={styles.unitDivider}>/</Text>
                <Text style={[styles.unitText, weightUnit === 'kg' && styles.unitTextActive]}>
                  kg
                </Text>
              </View>
            }
          />
          <View style={styles.divider} />
          <SettingItem
            icon="timer"
            title="Rest Timer"
            subtitle="Configure default rest periods"
            onPress={() => {
              Alert.alert('Coming Soon', 'Rest timer settings coming soon');
            }}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="list"
            title="Exercise Library"
            subtitle="Manage your exercises"
            onPress={() => {
              Alert.alert('Coming Soon', 'Exercise library coming soon');
            }}
          />
        </Card>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Card style={styles.settingsCard}>
          <SettingItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Workout reminders and updates"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: Colors.backgroundLight, true: Colors.primary }}
                thumbColor={Colors.text}
              />
            }
          />
        </Card>

        {/* Premium */}
        <Text style={styles.sectionTitle}>Premium</Text>
        <Card style={styles.premiumCard}>
          <View style={styles.premiumHeader}>
            <Ionicons name="star" size={24} color={Colors.warning} />
            <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
          </View>
          <Text style={styles.premiumSubtitle}>
            Unlock AI-powered workout recommendations, smart coaching, and more
          </Text>
          <TouchableOpacity style={styles.premiumButton}>
            <Text style={styles.premiumButtonText}>Learn More</Text>
          </TouchableOpacity>
        </Card>

        {/* Support */}
        <Text style={styles.sectionTitle}>Support</Text>
        <Card style={styles.settingsCard}>
          <SettingItem
            icon="help-circle"
            title="Help & FAQ"
            onPress={() => {
              Alert.alert('Help', 'Visit our help center at help.planmyworkout.app');
            }}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="chatbubble"
            title="Contact Us"
            onPress={() => {
              Alert.alert('Contact', 'Email us at support@planmyworkout.app');
            }}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="document-text"
            title="Privacy Policy"
            onPress={() => {
              // Would open privacy policy
            }}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="document"
            title="Terms of Service"
            onPress={() => {
              // Would open terms
            }}
          />
        </Card>

        {/* Danger Zone */}
        <Text style={styles.sectionTitle}>Account Actions</Text>
        <Card style={styles.settingsCard}>
          <SettingItem
            icon="log-out"
            title="Log Out"
            onPress={handleLogout}
            destructive
          />
          <View style={styles.divider} />
          <SettingItem
            icon="trash"
            title="Delete Account"
            subtitle="Permanently delete all data"
            onPress={handleDeleteAccount}
            destructive
          />
        </Card>

        {/* Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Plan My Workout v1.0.0</Text>
        </View>
      </ScrollView>
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
  profileSection: {
    alignItems: 'center',
    padding: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  displayName: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  email: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: Spacing.md,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsCard: {
    marginHorizontal: Spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  iconContainerDestructive: {
    backgroundColor: Colors.error + '20',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FontSizes.md,
    color: Colors.text,
    fontWeight: '500',
  },
  settingTitleDestructive: {
    color: Colors.error,
  },
  settingSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 60,
  },
  unitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitText: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  unitTextActive: {
    color: Colors.primary,
  },
  unitDivider: {
    color: Colors.textMuted,
    marginHorizontal: Spacing.xs,
  },
  premiumCard: {
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.primary + '10',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  premiumTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  premiumSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  premiumButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  premiumButtonText: {
    color: Colors.text,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  versionSection: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  versionText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
});
