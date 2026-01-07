/**
 * Login Screen
 */

import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Colors, Spacing, FontSizes } from '../constants/theme';
import { supabase } from '../services/supabase';
import { DevModeContext } from '../../App';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { setDevMode } = useContext(DevModeContext);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert('Login Failed', error.message);
      }
      // Navigation will be handled by auth state listener in App.tsx
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>PMW</Text>
          <Text style={styles.title}>Plan My Workout</Text>
          <Text style={styles.subtitle}>
            Generate unique workouts & beat your records
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail"
            error={errors.email}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon="lock-closed"
            error={errors.password}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title="Log In"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpText}> Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Dev Mode Button */}
        <TouchableOpacity
          style={styles.devButton}
          onPress={() => setDevMode(true)}
        >
          <Text style={styles.devButtonText}>Skip Login (Dev Mode)</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logo: {
    fontSize: FontSizes.hero,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: Spacing.xl,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
  },
  loginButton: {
    marginTop: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
  },
  signUpText: {
    color: Colors.primary,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  devButton: {
    marginTop: Spacing.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.warning,
    borderRadius: 8,
    alignItems: 'center',
  },
  devButtonText: {
    color: Colors.warning,
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
});
