# Workout Program 2024 - Deep Analysis & App Conversion Plan

## Executive Summary

This document captures my understanding of the Excel-based workout program and how it should translate to an iPhone app. The core concept is a **dynamic workout generator** that:
1. Generates unique workouts each session from selected muscle groups
2. Varies rep/set schemes to optimize progressive overload
3. Tracks historical performance to show "targets to beat"
4. Categorizes exercises by type (compound vs isolation) for proper workout structure

---

## Current Excel Program Structure

### Sheet Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        WORKOUT PROGRAM 2024.xlsm                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐    ┌──────────────┐    ┌─────────────────────────────┐  │
│  │  Workout Choice │───▶│      RS      │───▶│     Exercise INFO Sheets    │  │
│  │  (User Input)   │    │  (Settings)  │    │  (11 Muscle Group DBs)      │  │
│  └─────────────────┘    └──────────────┘    └─────────────────────────────┘  │
│         │                     │                        │                     │
│         ▼                     ▼                        ▼                     │
│  ┌─────────────────┐    ┌──────────────┐    ┌─────────────────────────────┐  │
│  │   Workout 3     │◀───│  Workout     │◀───│    Individual Saves         │  │
│  │ (Generated Out) │    │    List      │    │    (History Database)       │  │
│  └─────────────────┘    └──────────────┘    └─────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Muscle Group Database Structure (INFO Sheets)

Each muscle group has its own database with this structure:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              CHEST INFO (Example)                                                │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ DROP │ Enabled │ EXERCISE NAME                    │ Rep Schemes (with History)                  │
│ DOWN │ (T/F)   │                                  │ 2-2-2 │ 3-3-3 │ 4-4-4 │ 5-5-5 │ etc...     │
├──────┼─────────┼──────────────────────────────────┼───────┴───────┴───────┴───────┴─────────────┤
│  A   │  TRUE   │ Bench Press Flat Barbell         │ [history data for each rep scheme]          │
│  A   │  TRUE   │ Bench Press Incline Dumbbell     │                                              │
│  A   │  TRUE   │ Bench Press Decline Barbell      │                                              │
├──────┼─────────┼──────────────────────────────────┤                                              │
│  B   │  TRUE   │ Cable Fly's High                 │ ← Secondary/Isolation Exercises              │
│  B   │  TRUE   │ Pec Deck                         │                                              │
│  B   │  TRUE   │ Dips for Chest                   │                                              │
├──────┼─────────┼──────────────────────────────────┤                                              │
│  C   │  TRUE   │ Pullover Dumbbell                │ ← Accessory/Finisher Exercises               │
│  C   │  TRUE   │ Push Ups                         │                                              │
└──────┴─────────┴──────────────────────────────────┴──────────────────────────────────────────────┘

Exercise Categories:
  A = Primary Compound Movements (heavy, multi-joint)
  B = Secondary Movements (machine/isolation focus)
  C = Accessory/Finisher Movements
```

### Rep/Set History Data Format

Each exercise stores history in this format per rep scheme:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Format: "REPS WEIGHTS REPS WEIGHTS COUNTER"                                  │
│                                                                              │
│ Example: "3-3-3 0-0-0 3-3-3 315-315-315 0"                                  │
│           ├───┘ ├───┘ ├───┘ ├─────────┘ └── Session counter                 │
│           │     │     │     └── Weights per set (315 lbs each)              │
│           │     │     └── Achieved reps this session                        │
│           │     └── Previous session weights (0 = no data)                  │
│           └── Target reps per set                                           │
│                                                                              │
│ Historical Entry (Individual Saves):                                         │
│ "5/25/2018 3-3-3-3-3 275-275-275-275-275"                                   │
│  ├───────┘ ├───────┘ └────────────────┘                                     │
│  │         │         └── Weight per set                                     │
│  │         └── Reps achieved per set                                        │
│  └── Date performed                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Workout Generation Flow

### Step 1: User Selects Muscle Groups

```
┌────────────────────────────────────────┐
│         WORKOUT CHOICE SCREEN          │
├────────────────────────────────────────┤
│                                        │
│  Today's Workout: [Exercises: 5]       │
│                                        │
│  Select Muscle Groups:                 │
│  ┌──────────────────────────────────┐  │
│  │ [X] Abs        [ ] Quadriceps    │  │
│  │ [ ] Chest      [ ] Calves        │  │
│  │ [X] Back       [ ] Hamstrings    │  │
│  │ [ ] Biceps     [ ] Full Body     │  │
│  │ [ ] Legs                         │  │
│  │ [ ] Triceps                      │  │
│  │ [ ] Shoulders                    │  │
│  └──────────────────────────────────┘  │
│                                        │
│  Workout Type: [8-12 REG ▼]            │
│                                        │
│  [ GENERATE WORKOUT ]                  │
│                                        │
└────────────────────────────────────────┘
```

### Step 2: System Generates Workout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          GENERATION ALGORITHM                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  For each selected muscle group:                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 1. Get all ENABLED exercises (where Enabled = TRUE)                   │  │
│  │                                                                        │  │
│  │ 2. Filter by Category:                                                 │  │
│  │    Category A (compounds): Select 1-2 randomly                        │  │
│  │    Category B (secondary): Select 1-2 randomly                        │  │
│  │    Category C (accessory): Select 0-1 randomly                        │  │
│  │                                                                        │  │
│  │ 3. Assign Rep/Set Scheme based on Workout Type:                       │  │
│  │    ┌──────────────────────────────────────────────────────────────┐   │  │
│  │    │ Workout Type      │ Rep Schemes Used                         │   │  │
│  │    ├───────────────────┼──────────────────────────────────────────┤   │  │
│  │    │ 8-12 REG          │ 8-8-8, 10-10-10, 12-12-12               │   │  │
│  │    │ 5x5 STRENGTH      │ 5-5-5-5-5                               │   │  │
│  │    │ VOLUME            │ 8-8-8-8, 10-10-10-10, 12-12-12-12       │   │  │
│  │    │ BEGINNER          │ 10-10-10, 12-12-12, 15-15-15            │   │  │
│  │    │ 2-6 POWER         │ 2-2-2, 3-3-3, 4-4-4, 5-5-5, 6-6-6       │   │  │
│  │    └──────────────────────────────────────────────────────────────┘   │  │
│  │                                                                        │  │
│  │ 4. Look up historical performance for selected exercise + scheme      │  │
│  │                                                                        │  │
│  │ 5. Calculate "BEAT THIS" target (previous best + progression)         │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step 3: Generated Workout Output

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        TODAY'S WORKOUT                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  BACK (Selected)                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ 1. Lat Pulldown Wide Grip                                          │    │
│  │    Target: 10-10-10-10 @ beat: 165-180-180-180 lbs                │    │
│  │    ┌─────────────────────────────────────────────────────────┐     │    │
│  │    │ PREVIOUS BEST: 1/24/2023 | 8-8-8-15 @ 140-150-160 lbs   │     │    │
│  │    └─────────────────────────────────────────────────────────┘     │    │
│  │    [ Set 1: ___lbs x ___reps ]                                    │    │
│  │    [ Set 2: ___lbs x ___reps ]                                    │    │
│  │    [ Set 3: ___lbs x ___reps ]                                    │    │
│  │    [ Set 4: ___lbs x ___reps ]                                    │    │
│  ├────────────────────────────────────────────────────────────────────┤    │
│  │ 2. Cable Rows                                                      │    │
│  │    Target: 7-7-7-7-7 @ beat: 180-195-195-195-195 lbs             │    │
│  │    ┌─────────────────────────────────────────────────────────┐     │    │
│  │    │ PREVIOUS BEST: 6/3/2018 | 8-8-8-8-8 @ 180-180-180 lbs   │     │    │
│  │    └─────────────────────────────────────────────────────────┘     │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  BICEPS (Selected)                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ 3. Hammer Curls                                                    │    │
│  │    Target: 8-8-8-12 @ beat: 50-55-55-45 lbs                       │    │
│  │    ...                                                             │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Progressive Overload Logic

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     PROGRESSIVE OVERLOAD SYSTEM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  The system tracks progress and suggests targets to beat:                    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │   EXERCISE: Bench Press Flat Barbell                                │    │
│  │   REP SCHEME: 5-5-5-5 (4 sets of 5)                                 │    │
│  │                                                                      │    │
│  │   HISTORY:                                                          │    │
│  │   ┌──────────────┬─────────────┬─────────────────────────────────┐  │    │
│  │   │    DATE      │    REPS     │         WEIGHTS                 │  │    │
│  │   ├──────────────┼─────────────┼─────────────────────────────────┤  │    │
│  │   │  11/22/2020  │  8-8-8-8-8  │  0-0-0-0-0 (bodyweight)        │  │    │
│  │   │  12/28/2020  │  8-8-8-8-8  │  0-0-0-0-0                     │  │    │
│  │   │  7/3/2021    │  4-4-4-4-4  │  205-205-205-205-205           │  │    │
│  │   │  1/8/2023    │  6-6-6-6-7  │  185-195-195-195-195           │  │    │
│  │   │  1/24/2023   │  6-6-6-6-6  │  185-195-195-195-195           │  │    │
│  │   └──────────────┴─────────────┴─────────────────────────────────┘  │    │
│  │                                                                      │    │
│  │   TODAY'S TARGET TO BEAT:                                           │    │
│  │   ► Try to hit: 6-6-6-6-6 @ 190-200-200-200-200 lbs (+5 lbs)       │    │
│  │   ► OR hit more reps: 7-7-7-7-7 @ 185-195-195-195-195 lbs          │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## iPhone App Architecture

### Screen Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           APP NAVIGATION FLOW                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                        ┌──────────────────┐                                  │
│                        │    HOME SCREEN   │                                  │
│                        │                  │                                  │
│                        │ [New Workout]    │                                  │
│                        │ [History]        │                                  │
│                        │ [Settings]       │                                  │
│                        └────────┬─────────┘                                  │
│                                 │                                            │
│            ┌────────────────────┼────────────────────┐                       │
│            ▼                    ▼                    ▼                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │ MUSCLE SELECT   │  │    HISTORY      │  │   SETTINGS      │              │
│  │                 │  │                 │  │                 │              │
│  │ □ Abs           │  │ Jan 24, 2023    │  │ Workout Types   │              │
│  │ ■ Back          │  │ ├─ Back+Biceps  │  │ Exercise Pool   │              │
│  │ □ Chest         │  │ Jan 20, 2023    │  │ Rep Schemes     │              │
│  │ ■ Biceps        │  │ ├─ Legs+Calves  │  │ Notifications   │              │
│  │ □ Legs          │  │ ...             │  │                 │              │
│  │                 │  │                 │  │                 │              │
│  │ Type: [8-12▼]   │  │                 │  │                 │              │
│  │ [GENERATE]      │  │                 │  │                 │              │
│  └────────┬────────┘  └─────────────────┘  └─────────────────┘              │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐            │
│  │              ACTIVE WORKOUT SCREEN                           │            │
│  │                                                              │            │
│  │  Exercise 1 of 6: Lat Pulldown Wide Grip                    │            │
│  │  ┌──────────────────────────────────────────────────────┐   │            │
│  │  │ Target: 10-10-10-10                                   │   │            │
│  │  │ BEAT THIS: 165-180-180-180 lbs                       │   │            │
│  │  │                                                       │   │            │
│  │  │ Previous Best: 1/24/2023 - 8-8-8-15 @ 140-150-160   │   │            │
│  │  └──────────────────────────────────────────────────────┘   │            │
│  │                                                              │            │
│  │  SET 1:  [__] lbs  x  [__] reps   [✓ Complete]             │            │
│  │  SET 2:  [__] lbs  x  [__] reps   [✓ Complete]             │            │
│  │  SET 3:  [__] lbs  x  [__] reps   [ Start ]                │            │
│  │  SET 4:  [__] lbs  x  [__] reps   [ -- ]                   │            │
│  │                                                              │            │
│  │  Rest Timer: [1:45]                                         │            │
│  │                                                              │            │
│  │  [◀ Previous]              [Next Exercise ▶]                │            │
│  └──────────────────────────────────────────────────────────────┘            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Core Data Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA MODELS                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ MuscleGroup                                                          │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │ id: UUID                                                             │   │
│  │ name: String        // "CHEST", "BACK", "BICEPS", etc.              │   │
│  │ exercises: [Exercise]                                                │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ Exercise                                                             │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │ id: UUID                                                             │   │
│  │ name: String        // "Bench Press Flat Barbell"                   │   │
│  │ muscleGroup: MuscleGroup                                            │   │
│  │ category: Category  // .A (compound), .B (secondary), .C (accessory)│   │
│  │ isEnabled: Bool                                                      │   │
│  │ history: [WorkoutEntry]                                              │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ WorkoutEntry                                                         │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │ id: UUID                                                             │   │
│  │ exercise: Exercise                                                   │   │
│  │ date: Date                                                           │   │
│  │ repScheme: String   // "8-8-8-8"                                    │   │
│  │ sets: [SetData]                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ SetData                                                              │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │ setNumber: Int                                                       │   │
│  │ targetReps: Int                                                      │   │
│  │ achievedReps: Int                                                    │   │
│  │ weight: Double                                                       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ WorkoutSession                                                       │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │ id: UUID                                                             │   │
│  │ date: Date                                                           │   │
│  │ workoutType: WorkoutType  // .regular812, .strength5x5, .volume...  │   │
│  │ muscleGroups: [MuscleGroup]                                         │   │
│  │ exercises: [GeneratedExercise]                                      │   │
│  │ isCompleted: Bool                                                    │   │
│  │ totalVolume: Double       // calculated (reps × weight)             │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ GeneratedExercise (for current workout)                              │   │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │ exercise: Exercise                                                   │   │
│  │ assignedRepScheme: String     // "10-10-10-10"                      │   │
│  │ previousBest: WorkoutEntry?   // for "BEAT THIS" display            │   │
│  │ targetWeight: [Double]        // suggested weights to beat          │   │
│  │ currentSets: [SetData]        // user input during workout          │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Workout Generation Algorithm

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     WORKOUT GENERATION PSEUDOCODE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  func generateWorkout(                                                       │
│      muscleGroups: [MuscleGroup],                                           │
│      workoutType: WorkoutType                                               │
│  ) -> WorkoutSession {                                                       │
│                                                                              │
│      var selectedExercises: [GeneratedExercise] = []                        │
│                                                                              │
│      for muscle in muscleGroups {                                           │
│                                                                              │
│          // Get enabled exercises by category                               │
│          let categoryA = muscle.exercises.filter { $0.isEnabled && $0.category == .A }
│          let categoryB = muscle.exercises.filter { $0.isEnabled && $0.category == .B }
│          let categoryC = muscle.exercises.filter { $0.isEnabled && $0.category == .C }
│                                                                              │
│          // Randomly select based on workout type                           │
│          let exerciseCount = workoutType.exercisesPerMuscle                 │
│                                                                              │
│          // Primary compound (Category A): 1-2 exercises                    │
│          let aCount = min(2, categoryA.count)                               │
│          let selectedA = categoryA.shuffled().prefix(aCount)                │
│                                                                              │
│          // Secondary (Category B): 1-2 exercises                           │
│          let bCount = min(2, categoryB.count)                               │
│          let selectedB = categoryB.shuffled().prefix(bCount)                │
│                                                                              │
│          // Accessory (Category C): 0-1 exercises                           │
│          let selectedC = categoryC.shuffled().prefix(1)                     │
│                                                                              │
│          // For each selected exercise:                                     │
│          for exercise in (selectedA + selectedB + selectedC) {              │
│                                                                              │
│              // Pick a rep scheme from the workout type pool                │
│              let repScheme = workoutType.repSchemes.randomElement()         │
│                                                                              │
│              // Find previous best for this exercise + scheme               │
│              let previousBest = findBestEntry(                              │
│                  exercise: exercise,                                        │
│                  repScheme: repScheme                                       │
│              )                                                               │
│                                                                              │
│              // Calculate target to beat                                    │
│              let targetWeight = calculateTarget(previousBest)               │
│                                                                              │
│              selectedExercises.append(                                      │
│                  GeneratedExercise(                                         │
│                      exercise: exercise,                                    │
│                      assignedRepScheme: repScheme,                          │
│                      previousBest: previousBest,                            │
│                      targetWeight: targetWeight                             │
│                  )                                                           │
│              )                                                               │
│          }                                                                   │
│      }                                                                       │
│                                                                              │
│      return WorkoutSession(exercises: selectedExercises.shuffled())         │
│  }                                                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key App Features to Implement

### 1. Dynamic Workout Generation
- Random exercise selection from enabled pool
- Proper A/B/C category balance
- Variable rep/set schemes each session
- Never the exact same workout twice

### 2. Progressive Overload Tracking
- "BEAT THIS" targets based on history
- Show previous best performance
- Calculate suggested weight increases (+2.5-5 lbs)
- Track volume (sets × reps × weight)

### 3. Exercise Customization
- Enable/disable individual exercises
- Filter by equipment available
- Custom exercise categories
- Import from Excel data

### 4. Workout History
- Full session logging
- Per-exercise history view
- Progress charts over time
- Personal records (PRs) tracking

### 5. During Workout
- Rest timer between sets
- Quick weight/rep input
- Auto-advance to next set
- Session summary at completion

---

## Technology Recommendations (iOS)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TECH STACK RECOMMENDATION                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Framework: React Native + Expo (for cross-platform future)                 │
│                                                                              │
│  ├── UI: React Native Paper or NativeBase                                   │
│  ├── State: Redux Toolkit or Zustand                                        │
│  ├── Storage: AsyncStorage + SQLite (for offline-first)                    │
│  ├── Backend (optional): Supabase or Firebase                              │
│  └── Charts: Victory Native or react-native-chart-kit                      │
│                                                                              │
│  OR                                                                          │
│                                                                              │
│  Native iOS: SwiftUI                                                        │
│                                                                              │
│  ├── UI: SwiftUI native components                                         │
│  ├── State: @Observable / SwiftData                                        │
│  ├── Storage: SwiftData (Core Data replacement)                            │
│  ├── Backend (optional): CloudKit for sync                                 │
│  └── Charts: Swift Charts (native)                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Summary: What I Understand

1. **Core Concept**: A workout randomizer that picks exercises from your enabled pool, assigns varied rep/set schemes, and tracks your history to show targets to beat.

2. **Exercise Organization**: Exercises categorized by muscle group AND type (A=compound, B=secondary, C=accessory) to ensure balanced workout structure.

3. **Rep/Set Schemes**: Multiple schemes available (5x5, 8-12, volume, etc.) that get randomly assigned to exercises each session.

4. **Progressive Overload**: The "beat this" system shows your previous best and suggests targets (+5 lbs or +1-2 reps).

5. **History Tracking**: Every workout saved with date, exercise, reps achieved, and weights used.

6. **Customization**: Users can enable/disable exercises, choose workout types, and configure muscle group combinations.

---

*Document generated for review - Please confirm if this understanding is accurate before proceeding with implementation.*
