/**
 * Plan My Workout (PMW) - Theme Constants
 */

export const Colors = {
  // Primary brand colors
  primary: '#6C63FF',
  primaryDark: '#5A52D5',
  primaryLight: '#8B85FF',

  // Background colors
  background: '#1A1A2E',
  backgroundLight: '#16213E',
  backgroundCard: '#1F1F3D',

  // Text colors
  text: '#FFFFFF',
  textSecondary: '#A0A0B0',
  textMuted: '#6B6B7B',

  // Status colors
  success: '#4CAF50',
  successLight: '#81C784',
  warning: '#FFC107',
  warningLight: '#FFD54F',
  error: '#F44336',
  errorLight: '#E57373',

  // Category colors (A, B, C)
  categoryA: '#FF6B6B', // Red - Primary compounds
  categoryB: '#4ECDC4', // Teal - Secondary
  categoryC: '#FFE66D', // Yellow - Accessories

  // Muscle group colors
  muscleColors: {
    chest: '#FF6B6B',
    back: '#4ECDC4',
    legs: '#FFE66D',
    shoulders: '#A8E6CF',
    biceps: '#DDA0DD',
    triceps: '#87CEEB',
    abs: '#FFA07A',
    quadriceps: '#98D8C8',
    hamstrings: '#F7DC6F',
    calves: '#BB8FCE',
    full_body: '#85C1E9',
  },

  // UI elements
  border: '#2D2D4A',
  divider: '#2D2D4A',
  overlay: 'rgba(0, 0, 0, 0.7)',

  // Button states
  buttonDisabled: '#4A4A5A',
  buttonDisabledText: '#8A8A9A',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  hero: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};
