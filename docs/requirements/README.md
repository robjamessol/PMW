# Requirements

## MVP Scope (V1)

### Core Features

| Feature | Priority | Status |
|---------|----------|--------|
| User authentication (email/password) | P0 | Built |
| Muscle group selection (1-4 groups) | P0 | Built |
| Workout type selection | P0 | Built |
| Random workout generation | P0 | Built |
| Exercise display with BEAT THIS | P0 | Built |
| Set logging (weight + reps) | P0 | Built |
| Rest timer with vibration | P0 | Built |
| Workout completion summary | P0 | Built |
| Workout history view | P0 | Built |
| Basic settings (logout, units) | P1 | Built |

### Deferred to V2

| Feature | Notes |
|---------|-------|
| AI-powered workout suggestions | Tier 1 AI integration |
| Natural language workout requests | "Give me a quick chest workout" |
| Exercise video demonstrations | Would need video hosting |
| Social features | Share workouts, leaderboards |
| Apple Watch companion | Requires separate app |
| Workout scheduling/reminders | Push notifications |
| Exercise customization | Enable/disable, custom exercises |

---

## User Stories

### Authentication

```
As a new user
I want to create an account with my email
So that my workout data is saved and synced

Acceptance Criteria:
- Can enter display name, email, password
- Password requires confirmation
- Validation errors shown inline
- Successful signup logs me in automatically
```

```
As a returning user
I want to stay logged in
So that I don't have to enter credentials each time

Acceptance Criteria:
- Session persists across app restarts
- Secure token storage (SecureStore)
```

```
As a user who forgot my password
I want to reset it via email
So that I can regain access to my account

Acceptance Criteria:
- Enter email to receive reset link
- Success state shows email was sent
- Can resend if not received
```

### Workout Generation

```
As a gym-goer
I want to select which muscles to train
So that I can target specific body parts

Acceptance Criteria:
- See all 11 muscle groups in a grid
- Can select 1-4 groups
- Visual feedback on selection (color, checkmark)
- Cannot exceed maximum (shows alert)
```

```
As a gym-goer
I want to choose my workout type
So that my workout matches my goals

Acceptance Criteria:
- See workout types with names and descriptions
- Single selection (radio behavior)
- Default pre-selected (8-12 Regular)
```

```
As a gym-goer
I want unique workouts each time
So that I don't get bored doing the same routine

Acceptance Criteria:
- Exercises randomly selected from enabled pool
- Different order each session
- Mix of A, B, C category exercises
```

### Active Workout

```
As a gym-goer
I want to see my target weight to beat
So that I know what to aim for

Acceptance Criteria:
- BEAT THIS card shows previous best + 5 lbs
- Only shows if previous data exists
- Clearly visible and motivating
```

```
As a gym-goer
I want to log each set with weight and reps
So that my progress is tracked

Acceptance Criteria:
- Numeric inputs for weight and reps
- Checkmark button to confirm
- Visual feedback when set completed
- Cannot edit completed sets
```

```
As a gym-goer
I want a rest timer after each set
So that I take consistent rest periods

Acceptance Criteria:
- Timer starts automatically after logging set
- Shows countdown in large text
- Vibrates when timer ends
- Can skip timer if ready early
```

```
As a gym-goer
I want to navigate between exercises
So that I can do them in any order

Acceptance Criteria:
- Previous/Next buttons visible
- Progress bar shows current position
- Can finish workout at any time
```

### Workout History

```
As a gym-goer
I want to see my past workouts
So that I can track my consistency

Acceptance Criteria:
- List sorted by most recent
- Shows date, muscles, workout type
- Shows completion rate, volume, duration
- Pull-to-refresh to update
```

### Settings

```
As a user
I want to switch between lbs and kg
So that I can use my preferred unit

Acceptance Criteria:
- Toggle in settings
- Preference saved to database
- Applied throughout app
```

```
As a user
I want to log out
So that I can switch accounts or secure my data

Acceptance Criteria:
- Confirmation dialog before logout
- Clears session and navigates to login
```

---

## Technical Requirements

### Performance

| Metric | Target |
|--------|--------|
| App launch to interactive | < 3 seconds |
| Workout generation | < 2 seconds |
| Set logging | < 500ms |
| Screen transitions | 60fps |

### Offline Support (Future)

| Feature | Behavior |
|---------|----------|
| View history | Cached data available |
| Active workout | Queue writes, sync later |
| Generate workout | Requires connection |

### Security

| Requirement | Implementation |
|-------------|----------------|
| Secure token storage | expo-secure-store |
| Data isolation | Row Level Security in Supabase |
| Password requirements | Minimum 6 characters |
| Session management | Supabase auth with refresh |

### Data Validation

| Field | Rules |
|-------|-------|
| Email | Valid email format |
| Password | Min 6 characters |
| Display name | 1-50 characters |
| Weight | Positive number |
| Reps | Positive integer |
| Muscle selection | 1-4 groups |

---

## Database Requirements

### Tables

| Table | Purpose | Rows (Est.) |
|-------|---------|-------------|
| users | User profiles | 1 per user |
| exercises | Exercise library | 178 |
| workout_sessions | Workout metadata | ~100/user/year |
| session_exercises | Exercises per session | ~500/user/year |
| exercise_sets | Sets per exercise | ~2000/user/year |
| personal_records | PR history | ~50/user/year |

### Queries (Frequent)

1. **Get enabled exercises by muscle** - workout generation
2. **Get previous best for exercise** - BEAT THIS calculation
3. **Get recent workouts** - home screen, history
4. **Get session with exercises and sets** - active workout load
5. **Update set** - logging during workout

### Indexes Needed

- `exercises(muscle_group, category)` - generation queries
- `workout_sessions(user_id, created_at)` - history
- `exercise_sets(session_exercise_id)` - workout loading
- `personal_records(user_id, exercise_id)` - PR lookup

---

## API Requirements (Future AI)

### Endpoints Needed

| Endpoint | Purpose |
|----------|---------|
| POST /ai/generate | Smart workout generation |
| POST /ai/recommend | Exercise recommendations |
| POST /ai/parse | Natural language parsing |

### AI Context Data

- User's workout history (last 30 days)
- Muscle group frequency
- Exercise PRs and trends
- Time since last workout
- Preferred workout duration
