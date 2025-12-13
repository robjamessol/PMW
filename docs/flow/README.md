# App Flow

## Navigation Structure

```
App
├── Auth Stack (when not logged in)
│   ├── Login Screen
│   ├── Sign Up Screen
│   └── Forgot Password Screen
│
└── Main Stack (when logged in)
    ├── Tab Navigator
    │   ├── Home Tab → HomeScreen
    │   ├── History Tab → HistoryScreen
    │   └── Settings Tab → SettingsScreen
    │
    ├── MuscleSelect Screen (modal)
    ├── ActiveWorkout Screen (no back gesture)
    └── WorkoutComplete Screen (no back gesture)
```

---

## User Flows

### 1. First Time User

```
App Launch
    ↓
Login Screen
    ↓
Tap "Sign Up"
    ↓
Sign Up Screen
    ├── Enter display name
    ├── Enter email
    ├── Enter password
    └── Confirm password
    ↓
Tap "Create Account"
    ↓
[Account created in Supabase]
    ↓
Auto-login → Home Screen
```

### 2. Returning User

```
App Launch
    ↓
[Check Supabase session]
    ↓
Session exists? ──No──→ Login Screen
    │
   Yes
    ↓
Home Screen
```

### 3. Forgot Password

```
Login Screen
    ↓
Tap "Forgot Password?"
    ↓
Forgot Password Screen
    ├── Enter email
    └── Tap "Send Reset Link"
    ↓
Success State
    ├── "Check Your Email" message
    ├── Back to Login button
    └── Resend option
```

### 4. Start Workout Flow (Core)

```
Home Screen
    ↓
Tap "Start Workout" or "New Workout"
    ↓
Muscle Select Screen (modal)
    ├── Select 1-4 muscle groups (grid)
    ├── Select workout type (horizontal scroll)
    └── View summary card
    ↓
Tap "Generate Workout"
    ↓
[generateWorkout() runs]
    ├── Fetch enabled exercises for muscles
    ├── Shuffle and select by A/B/C category
    ├── Calculate target weights from history
    └── Create session in database
    ↓
Active Workout Screen
    ├── Progress bar (exercise X of Y)
    ├── Exercise name + rep scheme
    ├── BEAT THIS card (if previous best exists)
    ├── Set cards with weight/reps inputs
    ├── Rest timer (after logging set)
    └── Previous/Next navigation
    ↓
Tap "Finish"
    ↓
Confirm dialog
    ↓
[completeWorkoutSession() runs]
    ↓
Workout Complete Screen
    ├── Stats: duration, sets, volume
    ├── Personal records (if any)
    ├── Completion rate
    └── "Back to Home" button
    ↓
Home Screen (replace, not push)
```

### 5. Log a Set (During Workout)

```
Active Workout Screen
    ↓
Enter weight in input
    ↓
Enter reps in input
    ↓
Tap checkmark button
    ↓
[Validate: weight and reps required]
    ↓
[Update database: exercise_sets]
    ↓
[Update local state: mark completed]
    ↓
Start rest timer (90 seconds default)
    ↓
Timer counts down
    ↓
Timer reaches 0
    ├── Vibration alert
    └── Timer hides
    ↓
Ready for next set
```

### 6. View History

```
Home Screen
    ↓
Tap History tab (or recent workout)
    ↓
History Screen
    ├── List of past workouts
    ├── Pull-to-refresh
    └── Each card shows:
        ├── Date
        ├── Status (completed/abandoned)
        ├── Muscle groups (tags)
        ├── Sets completed
        ├── Total volume
        └── Duration
```

### 7. Settings Flow

```
Home Screen
    ↓
Tap Settings tab
    ↓
Settings Screen
    ├── Profile section (avatar, name, email)
    ├── Account settings
    │   ├── Edit Profile → (future)
    │   └── Change Password → (future)
    ├── Workout settings
    │   ├── Weight unit toggle (lbs/kg)
    │   ├── Rest timer config → (future)
    │   └── Exercise library → (future)
    ├── Notifications toggle
    ├── Premium upsell card
    ├── Support links
    └── Account actions
        ├── Log Out → Confirm → Auth Stack
        └── Delete Account → Double confirm
```

---

## Screen States

### Loading States

| Screen | Loading Behavior |
|--------|-----------------|
| App Launch | Full screen spinner |
| Home | Stats show "--" until loaded |
| Muscle Select | Generate button shows spinner |
| Active Workout | "Loading workout..." text |
| History | Pull-to-refresh indicator |
| Workout Complete | "Loading summary..." text |

### Empty States

| Screen | Empty State |
|--------|-------------|
| Home (no workouts) | Welcome message + Start button |
| History | Icon + "No Workouts Yet" + Start button |

### Error States

| Error | Handling |
|-------|----------|
| Login failed | Alert with message |
| Sign up failed | Alert with message |
| Network error | Alert + retry option |
| Workout generation failed | Alert + stay on screen |
| Set logging failed | Alert + can retry |

---

## Gesture Handling

| Screen | Gestures |
|--------|----------|
| Most screens | Swipe back enabled |
| Active Workout | Swipe back **disabled** (prevent accidental exit) |
| Workout Complete | Swipe back **disabled** |
| Muscle Select | Modal dismiss swipe down |

---

## Data Flow

### Workout Generation

```
User selects muscles + type
         ↓
generateWorkout(userId, muscles, workoutType)
         ↓
┌────────────────────────────────────────┐
│ For each muscle:                       │
│   1. Fetch enabled exercises           │
│   2. Filter by category A, B, C        │
│   3. Shuffle each category             │
│   4. Select N per category (from type) │
│   5. Get previous best for each        │
│   6. Calculate target weights          │
└────────────────────────────────────────┘
         ↓
createWorkoutSession(userId, muscles, type, exercises)
         ↓
┌────────────────────────────────────────┐
│ 1. Insert workout_sessions row         │
│ 2. Insert session_exercises rows       │
│ 3. Insert exercise_sets rows           │
│ 4. Return session ID                   │
└────────────────────────────────────────┘
         ↓
Navigate to ActiveWorkout with sessionId
```

### Set Logging

```
User enters weight + reps, taps checkmark
         ↓
handleLogSet(setId, index)
         ↓
┌────────────────────────────────────────┐
│ 1. Validate inputs                     │
│ 2. Update exercise_sets in DB          │
│    - achieved_reps                     │
│    - weight                            │
│    - completed = true                  │
│    - completed_at = now                │
│ 3. Update local state                  │
│ 4. Start rest timer                    │
└────────────────────────────────────────┘
```

### Session Completion

```
User taps Finish → Confirms
         ↓
completeWorkoutSession(sessionId)
         ↓
┌────────────────────────────────────────┐
│ 1. Update workout_sessions             │
│    - status = 'completed'              │
│    - completed_at = now                │
│ 2. Check for personal records          │
│ 3. Insert personal_records if PRs      │
└────────────────────────────────────────┘
         ↓
Navigate to WorkoutComplete
```

---

## Deep Links (Future)

| Link | Action |
|------|--------|
| `planmyworkout://reset-password` | Open password reset |
| `planmyworkout://workout/:id` | Open specific workout |
| `planmyworkout://start` | Go to muscle select |
