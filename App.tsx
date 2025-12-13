/**
 * Plan My Workout (PMW)
 * Main App Entry Point
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Types
import { RootStackParamList } from './app/types';

// Screens (to be implemented)
// import LoginScreen from './app/screens/LoginScreen';
// import HomeScreen from './app/screens/HomeScreen';
// import MuscleSelectScreen from './app/screens/MuscleSelectScreen';
// import ActiveWorkoutScreen from './app/screens/ActiveWorkoutScreen';
// import HistoryScreen from './app/screens/HistoryScreen';
// import SettingsScreen from './app/screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // TODO: Add auth state management
  const isAuthenticated = false;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1a1a2e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          {!isAuthenticated ? (
            // Auth Stack
            <>
              {/* <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} /> */}
              {/* <Stack.Screen name="SignUp" component={SignUpScreen} /> */}
            </>
          ) : (
            // Main App Stack
            <>
              {/* <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Plan My Workout' }} /> */}
              {/* <Stack.Screen name="MuscleSelect" component={MuscleSelectScreen} options={{ title: 'Select Muscles' }} /> */}
              {/* <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} options={{ title: 'Workout' }} /> */}
              {/* <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'History' }} /> */}
              {/* <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} /> */}
            </>
          )}
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
