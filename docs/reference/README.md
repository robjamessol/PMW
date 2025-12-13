# Reference Materials

## Original Program

The app is based on **Workout Program 2024.xlsm**, an Excel-based workout generator with VBA macros.

### Key Concepts from Excel

| Concept | Description |
|---------|-------------|
| **Unique Workouts** | Exercises randomly selected each session from enabled pool |
| **A/B/C Categories** | A=compound, B=secondary, C=accessory |
| **BEAT THIS** | Shows previous best weight + 5 lbs as target |
| **Rep Schemes** | Format like "8-8-8-8" meaning 4 sets of 8 reps |
| **History Format** | "DATE REPS WEIGHTS" stored per exercise |

### Excel Sheets (Original)

| Sheet | Purpose |
|-------|---------|
| Workout Choice | Main UI for generating workouts |
| Workout list | Current workout display |
| RS | Rep scheme configurations |
| Individual saves | Per-exercise history |
| DatabaseA | Exercise database |
| INFO sheets (x11) | One per muscle group |

---

## Tech Stack Documentation

### React Native + Expo

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- Version: Expo SDK 50, React Native 0.73

### Supabase

- [Supabase Documentation](https://supabase.com/docs)
- [JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### React Navigation

- [React Navigation Docs](https://reactnavigation.org/docs/getting-started)
- [Stack Navigator](https://reactnavigation.org/docs/stack-navigator)
- [Bottom Tabs](https://reactnavigation.org/docs/bottom-tab-navigator)

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

## Exercise Categories Explained

### Category A (Compound)

Primary exercises that work multiple joints/muscles.

Examples:
- Bench Press (Chest)
- Deadlift (Back)
- Squat (Legs)
- Overhead Press (Shoulders)

Characteristics:
- Heavy weight potential
- Longer rest periods (2-3 min)
- Usually done first in workout
- 2-3 per muscle group in database

### Category B (Secondary)

Supporting exercises, often single-joint.

Examples:
- Incline Dumbbell Press (Chest)
- Barbell Rows (Back)
- Leg Press (Legs)
- Lateral Raises (Shoulders)

Characteristics:
- Moderate weight
- Medium rest (60-90 sec)
- Done after compounds
- 5-7 per muscle group in database

### Category C (Accessory)

Isolation and finishing exercises.

Examples:
- Cable Flyes (Chest)
- Face Pulls (Back)
- Leg Extensions (Legs)
- Rear Delt Flyes (Shoulders)

Characteristics:
- Lighter weight, higher reps
- Shorter rest (30-60 sec)
- Done last
- 5-7 per muscle group in database

---

## Workout Types Reference

### 5x5 Strength

- **Focus**: Strength, power
- **Rep Scheme**: 5-5-5-5-5
- **Sets**: 5
- **Rest**: 180 seconds
- **Exercises**: A: 2, B: 1, C: 0
- **Best For**: Building raw strength

### 8-12 Regular (Hypertrophy)

- **Focus**: Muscle growth
- **Rep Schemes**: 8-8-8, 10-10-10, 12-12-12
- **Sets**: 4
- **Rest**: 90 seconds
- **Exercises**: A: 2, B: 2, C: 1
- **Best For**: Balanced muscle building

### Volume

- **Focus**: High volume hypertrophy
- **Rep Schemes**: 10-10-10-10-10, 12-12-12-12
- **Sets**: 5
- **Rest**: 60 seconds
- **Exercises**: A: 2, B: 2, C: 2
- **Best For**: Endurance, definition

### 2-6 Power

- **Focus**: Explosive power
- **Rep Schemes**: 3-3-3, 5-5-5, 6-6-6
- **Sets**: 4
- **Rest**: 180 seconds
- **Exercises**: A: 3, B: 1, C: 0
- **Best For**: Athletes, powerlifting

### Beginner 10-15

- **Focus**: Learning form, endurance
- **Rep Schemes**: 10-10-10, 12-12-12, 15-15-15
- **Sets**: 3
- **Rest**: 60 seconds
- **Exercises**: A: 1, B: 2, C: 1
- **Best For**: New lifters

### Light Finish

- **Focus**: Pump, deload
- **Rep Schemes**: 15-15-15, 20-20-20
- **Sets**: 3
- **Rest**: 45 seconds
- **Exercises**: A: 1, B: 1, C: 2
- **Best For**: Recovery days, finishers

---

## BEAT THIS Logic

### Current Implementation

```
target_weight = previous_best_weight + 5 lbs
```

Shows if `previous_best_weight > 0`

### Future Enhancement (AI)

Options to beat previous:
1. Same weight, +1-2 reps
2. +5 lbs, same reps
3. AI-calculated based on trend

---

## Muscle Groups

| ID | Name | Exercise Count |
|----|------|----------------|
| chest | Chest | 16 |
| back | Back | 19 |
| shoulders | Shoulders | 18 |
| biceps | Biceps | 15 |
| triceps | Triceps | 16 |
| legs | Legs | 17 |
| abs | Abs | 14 |
| quadriceps | Quadriceps | 16 |
| hamstrings | Hamstrings | 14 |
| calves | Calves | 12 |
| full_body | Full Body | 21 |

**Total: 178 exercises**

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| Dec 2024 | React Native + Expo | Cross-platform, good AI support |
| Dec 2024 | Supabase backend | All-in-one: auth, DB, realtime |
| Dec 2024 | TypeScript | Type safety, better tooling |
| Dec 2024 | Dark theme | Gym environment, modern look |
| Dec 2024 | Freemium model | Free base, AI features premium |
| Dec 2024 | App name "PMW" | Plan My Workout |

---

## Useful Commands

```bash
# Start development
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Type check
npm run type-check

# Lint
npm run lint
```

---

## File Locations Quick Reference

| Need | Location |
|------|----------|
| Exercise data | `docs/data/exercises.json` |
| Workout types | `docs/data/workout-types.json` |
| Database schema | `supabase/schema.sql` |
| Theme/colors | `app/constants/theme.ts` |
| Type definitions | `app/types/index.ts` |
| Workout logic | `app/services/workoutGenerator.ts` |
| AI strategy | `docs/AI_INTEGRATION_STRATEGY.md` |
