# Plan My Workout (PMW)

> The only workout app that generates fresh, optimized workouts every session while an AI coach helps you beat your personal records.

---

## Project Overview

**PMW** transforms a proven Excel-based workout system into a modern iOS app with AI-powered features. The app generates unique workouts each session, tracks progressive overload, and uses AI to help users continuously improve.

### Core Value Proposition
- **Never the same workout twice** - Dynamic exercise selection from your enabled pool
- **Beat your personal records** - Smart targets based on workout history
- **AI-powered optimization** - Intelligent recommendations, not just random selection

---

## Product Decisions

### Platform & Tech Stack
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | React Native + Expo | Cross-platform, faster development, easier for first app |
| Backend | Supabase | Auth, database, real-time sync, scales to thousands |
| AI Provider | TBD (Claude or GPT) | Both viable, decide during implementation |

### Monetization Model
```
┌─────────────────────────────────────────────────────────────────┐
│                     FREEMIUM MODEL                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  FREE TIER:                                                      │
│  ├── Workout generation (randomized)                            │
│  ├── Exercise logging                                           │
│  ├── Basic history tracking                                     │
│  ├── "BEAT THIS" targets (simple: previous best)               │
│  └── Limited workouts per month (?)                            │
│                                                                  │
│  PREMIUM TIER (AI-Powered):                                     │
│  ├── Smart workout generation (AI-optimized selection)         │
│  ├── Intelligent "BEAT THIS" (analyzes progression patterns)   │
│  ├── Natural language requests ("Give me a quick workout")     │
│  ├── AI Coach chat (future)                                    │
│  ├── Voice commands (future)                                   │
│  ├── Advanced analytics & insights (future)                    │
│  └── Unlimited workouts                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### User Accounts
- Required for all users
- Enables cloud sync and data backup
- Workout history persists across devices
- Foundation for future social features

---

## Feature Roadmap

### Version 1.0 (MVP)

**Core Features:**
- [x] User authentication (sign up, login, forgot password)
- [x] Exercise database (pre-loaded from Excel data)
- [x] Muscle group selection
- [x] Workout type selection (8-12 REG, 5x5, Volume, etc.)
- [x] Dynamic workout generation
- [x] Exercise logging (weight, reps per set)
- [x] Workout history
- [x] "BEAT THIS" targets (previous best display)
- [x] Rest timer with vibration alerts
- [x] Workout completion summary with stats

**Tier 1 AI Features (Premium):**
- [ ] Smart workout generation (AI considers recovery, frequency, plateaus)
- [ ] Intelligent "BEAT THIS" recommendations (+weight OR +reps based on user patterns)
- [ ] Natural language workout requests ("30 min chest workout, I'm tired")

### Version 2.0 (Tier 2 AI)
- [ ] AI Coach chat ("Why am I stuck on squats?")
- [ ] Voice commands during workout
- [ ] Post-workout AI insights
- [ ] Weekly/monthly progress reports
- [ ] Plateau detection and recommendations

### Version 3.0 (Tier 3 AI + Social)
- [ ] Camera-based form analysis
- [ ] Recovery prediction (Apple Health integration)
- [ ] Social features and challenges
- [ ] AI-matched workout partners

---

## Data Architecture

### Exercise Database Structure
```
Muscle Groups (11):
├── ABS
├── BACK
├── BICEPS
├── CHEST
├── LEGS
├── TRICEPS
├── SHOULDERS
├── QUADRICEPS
├── CALVES
├── HAMSTRINGS
└── FULL BODY

Exercise Categories:
├── A: Primary Compound (Bench Press, Squats, Deadlifts)
├── B: Secondary/Isolation (Cable Flys, Machine work)
└── C: Accessory/Finisher (Push-ups, Pullovers)
```

### Workout Generation Logic
1. User selects muscle groups + workout type
2. System filters enabled exercises by category (A, B, C)
3. AI (premium) or random (free) selects exercises
4. Rep scheme assigned based on workout type
5. Previous best looked up for "BEAT THIS" display
6. User completes workout, data saved to history

### History Data Format
```
WorkoutEntry:
├── date: "2024-01-24"
├── exercise: "Bench Press Flat Barbell"
├── repScheme: "8-8-8-8"
├── sets: [
│   { reps: 8, weight: 185 },
│   { reps: 8, weight: 185 },
│   { reps: 8, weight: 190 },
│   { reps: 7, weight: 190 }
│ ]
└── totalVolume: 5765
```

---

## Screen Flow

```
┌──────────────┐
│   SPLASH     │
│   SCREEN     │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│    LOGIN     │────▶│   SIGN UP    │
└──────┬───────┘     └──────────────┘
       │
       ▼
┌──────────────┐
│    HOME      │
│              │
│ [New Workout]│──────────────────────────┐
│ [History]    │───────┐                  │
│ [Settings]   │──┐    │                  │
└──────────────┘  │    │                  │
                  │    │                  ▼
                  │    │         ┌──────────────────┐
                  │    │         │  MUSCLE SELECT   │
                  │    │         │                  │
                  │    │         │  □ Abs  □ Chest  │
                  │    │         │  ■ Back □ Legs   │
                  │    │         │                  │
                  │    │         │  Type: [8-12 ▼]  │
                  │    │         │                  │
                  │    │         │  [GENERATE]      │
                  │    │         └────────┬─────────┘
                  │    │                  │
                  │    │                  ▼
                  │    │         ┌──────────────────┐
                  │    │         │  ACTIVE WORKOUT  │
                  │    │         │                  │
                  │    │         │  Exercise 1/6    │
                  │    │         │  Lat Pulldown    │
                  │    │         │                  │
                  │    │         │  BEAT: 180 lbs   │
                  │    │         │                  │
                  │    │         │  Set 1: [  ] lbs │
                  │    │         │         [  ] reps│
                  │    │         │                  │
                  │    │         │  [Next Exercise] │
                  │    │         └────────┬─────────┘
                  │    │                  │
                  │    ▼                  ▼
                  │  ┌──────────────────────────────┐
                  │  │          HISTORY             │
                  │  │                              │
                  │  │  Jan 24 - Back + Biceps     │
                  │  │  Jan 22 - Chest + Triceps   │
                  │  │  Jan 20 - Legs              │
                  │  │                              │
                  │  └──────────────────────────────┘
                  │
                  ▼
         ┌──────────────┐
         │   SETTINGS   │
         │              │
         │ • Profile    │
         │ • Exercises  │
         │ • Premium    │
         │ • About      │
         └──────────────┘
```

---

## Project Structure

```
PMW/
├── app/                          # React Native app code
│   ├── components/               # Reusable UI components
│   ├── screens/                  # Screen components
│   ├── services/                 # API and business logic
│   │   ├── supabase.ts          # Supabase client config
│   │   └── workoutGenerator.ts  # Workout generation logic
│   ├── hooks/                    # Custom React hooks
│   ├── utils/                    # Utility functions
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts             # All app types
│   ├── constants/                # App constants
│   └── assets/                   # Images, fonts, etc.
├── docs/                         # Documentation
│   ├── README.md                # This file
│   ├── WORKOUT_APP_ANALYSIS.md  # Excel program analysis
│   ├── AI_INTEGRATION_STRATEGY.md # AI features plan
│   ├── data/                    # Extracted data
│   │   ├── exercises.json       # 178 exercises from Excel
│   │   └── workout-types.json   # Workout type configurations
│   └── program/                 # Original Excel file
├── supabase/                    # Database
│   └── schema.sql              # Complete database schema
├── App.tsx                      # App entry point
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
└── tsconfig.json               # TypeScript configuration
```

---

## Documents & Data

| File | Description |
|------|-------------|
| [WORKOUT_APP_ANALYSIS.md](./WORKOUT_APP_ANALYSIS.md) | Deep analysis of Excel program structure |
| [AI_INTEGRATION_STRATEGY.md](./AI_INTEGRATION_STRATEGY.md) | AI features and technical architecture |
| [data/exercises.json](./data/exercises.json) | **178 exercises** extracted from Excel |
| [data/workout-types.json](./data/workout-types.json) | 6 workout types with rep schemes |
| [supabase/schema.sql](../supabase/schema.sql) | Complete PostgreSQL database schema |

---

## Development Progress

### Completed ✅
1. ~~Extract exercise database from Excel into JSON~~ → `docs/data/exercises.json` (178 exercises)
2. ~~Set up project structure (React Native + Expo)~~ → `app/` folder
3. ~~Configure Supabase schema~~ → `supabase/schema.sql`
4. ~~Define TypeScript types~~ → `app/types/index.ts`
5. ~~Create workout generation service~~ → `app/services/workoutGenerator.ts`
6. ~~Build all UI screens~~ → 9 screens complete
   - LoginScreen, SignUpScreen, ForgotPasswordScreen
   - HomeScreen, MuscleSelectScreen, ActiveWorkoutScreen
   - WorkoutCompleteScreen, HistoryScreen, SettingsScreen
7. ~~Create reusable components~~ → Button, Card, Input
8. ~~Set up navigation~~ → Auth flow + Tab navigation + Stack navigation
9. ~~Implement theme system~~ → Colors, typography, spacing
10. ~~Add rest timer with vibration~~ → 90-second default, skip option

### Next Steps 🔜
1. **Set up Supabase project** (create account, run schema.sql)
2. **Add environment variables** (.env with Supabase credentials)
3. **Seed exercise database** (load exercises.json into Supabase)
4. **Test complete workout flow** (generate → log sets → complete)
5. **Add AI integration** (Tier 1 premium features)
6. **Testing & Polish**
7. **App Store submission**

---

## Contact

Project Owner: [robjamessol](https://github.com/robjamessol)

---

*Last updated: December 2024*
