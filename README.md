# Plan My Workout (PMW)

AI-powered workout generator that creates unique workouts each session and tracks your progress with "BEAT THIS" targets.

## App Overview

- **Name**: Plan My Workout (PMW)
- **Platform**: iOS (React Native + Expo)
- **Backend**: Supabase (Auth, PostgreSQL, Real-time)
- **Monetization**: Freemium (AI features as premium)

## Key Features

| Feature | Description |
|---------|-------------|
| **Unique Workouts** | Never the same workout twice - exercises randomly selected from your enabled pool |
| **BEAT THIS** | Shows previous best + target to beat (either +5 lbs OR +1-2 reps) |
| **11 Muscle Groups** | Chest, Back, Shoulders, Biceps, Triceps, Legs, Abs, Quads, Hamstrings, Calves, Full Body |
| **Exercise Categories** | A (compound), B (secondary), C (accessory) - mixed per workout type |
| **Workout Types** | 5x5 Strength, 8-12 Hypertrophy, Volume, Power, Beginner |
| **Rest Timer** | Configurable with vibration alerts |
| **History Tracking** | Volume, duration, completion rate, personal records |

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React Native + Expo** | Cross-platform mobile framework |
| **TypeScript** | Type-safe development |
| **Supabase** | Auth, PostgreSQL database, real-time sync |
| **React Navigation** | Stack + bottom tab navigation |

## Project Structure

```
PMW/
├── App.tsx                    # Main entry with auth flow
├── app.json                   # Expo configuration
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
│
├── app/
│   ├── components/            # Reusable UI components
│   │   ├── Button.tsx         # Primary/secondary/outline variants
│   │   ├── Card.tsx           # Container with variants
│   │   └── Input.tsx          # Form input with icons
│   │
│   ├── constants/
│   │   ├── theme.ts           # Colors, spacing, fonts
│   │   └── index.ts           # App constants
│   │
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   ├── ForgotPasswordScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── MuscleSelectScreen.tsx
│   │   ├── ActiveWorkoutScreen.tsx
│   │   ├── WorkoutCompleteScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   └── SettingsScreen.tsx
│   │
│   ├── services/
│   │   ├── supabase.ts        # Supabase client
│   │   └── workoutGenerator.ts # Core workout generation logic
│   │
│   └── types/
│       └── index.ts           # TypeScript interfaces
│
├── supabase/
│   └── schema.sql             # Database schema with RLS
│
└── docs/
    ├── data/
    │   ├── exercises.json     # 178 exercises from Excel
    │   └── workout-types.json # 6 workout configurations
    ├── program/
    │   └── Workout Program 2024.xlsm  # Original Excel program
    ├── AI_INTEGRATION_STRATEGY.md
    └── WORKOUT_APP_ANALYSIS.md
```

## Development Status

See [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md) for detailed progress.

### Completed
- Project structure and configuration
- Database schema with Row Level Security
- Exercise data extraction (178 exercises)
- All UI screens (9 screens)
- Reusable components (Button, Card, Input)
- Auth flow with Supabase
- Workout generation logic
- Rest timer with vibration

### Next Steps
1. Set up Supabase project and run schema.sql
2. Add environment variables (.env)
3. Test auth flow
4. Seed exercises to database
5. Test workout generation end-to-end
6. Add AI integration (Tier 1)

## Getting Started

```bash
# Install dependencies
npm install

# Start Expo development server
npm start

# Run on iOS simulator
npm run ios
```

### Environment Setup

Create `.env` file:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## AI Integration (V1 - Tier 1)

| Feature | Description |
|---------|-------------|
| Smart Generation | AI considers fatigue, recent muscles, suggest variations |
| BEAT THIS+ | Intelligent targets based on trends, not just +5 lbs |
| Natural Language | "Give me a quick chest workout" parsing |

See [AI_INTEGRATION_STRATEGY.md](./docs/AI_INTEGRATION_STRATEGY.md) for full roadmap.

## Database

PostgreSQL via Supabase with tables:
- `users` - Profile and preferences
- `exercises` - 178 exercises with categories
- `workout_sessions` - Session metadata
- `session_exercises` - Exercises in a session
- `exercise_sets` - Individual sets with weight/reps
- `personal_records` - PR tracking per exercise

Row Level Security ensures users only see their own data.
