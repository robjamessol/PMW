-- ============================================
-- PLAN MY WORKOUT (PMW) - DATABASE SCHEMA
-- Supabase PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMP WITH TIME ZONE,

  -- Settings stored as JSONB for flexibility
  settings JSONB DEFAULT '{
    "weightUnit": "lbs",
    "defaultRestTimer": 90,
    "enabledMuscleGroups": ["chest", "back", "legs", "shoulders", "biceps", "triceps", "abs"],
    "preferredWorkoutType": null
  }'::jsonb
);

-- ============================================
-- MUSCLE GROUPS TABLE
-- ============================================

CREATE TABLE muscle_groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- Insert default muscle groups
INSERT INTO muscle_groups (id, name, display_order) VALUES
  ('abs', 'ABS', 1),
  ('back', 'BACK', 2),
  ('biceps', 'BICEPS', 3),
  ('chest', 'CHEST', 4),
  ('legs', 'LEGS', 5),
  ('triceps', 'TRICEPS', 6),
  ('shoulders', 'SHOULDERS', 7),
  ('full_body', 'FULL BODY', 8),
  ('quadriceps', 'QUADRICEPS', 9),
  ('calves', 'CALVES', 10),
  ('hamstrings', 'HAMSTRINGS', 11);

-- ============================================
-- EXERCISES TABLE
-- ============================================

CREATE TABLE exercises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  muscle_group_id TEXT REFERENCES muscle_groups(id),
  category CHAR(1) CHECK (category IN ('A', 'B', 'C')),
  is_default BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_exercises_muscle_group ON exercises(muscle_group_id);
CREATE INDEX idx_exercises_category ON exercises(category);

-- ============================================
-- USER EXERCISE SETTINGS
-- (which exercises are enabled per user)
-- ============================================

CREATE TABLE user_exercise_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  exercise_id TEXT REFERENCES exercises(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT TRUE,

  UNIQUE(user_id, exercise_id)
);

CREATE INDEX idx_user_exercise_user ON user_exercise_settings(user_id);

-- ============================================
-- WORKOUT TYPES TABLE
-- ============================================

CREATE TABLE workout_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  rep_schemes TEXT[] NOT NULL,
  sets_per_exercise INTEGER DEFAULT 4,
  rest_seconds INTEGER DEFAULT 90,
  exercises_per_muscle JSONB NOT NULL,
  focus TEXT CHECK (focus IN ('strength', 'hypertrophy', 'power', 'endurance'))
);

-- Insert default workout types
INSERT INTO workout_types (id, name, description, rep_schemes, sets_per_exercise, rest_seconds, exercises_per_muscle, focus) VALUES
  ('strength_5x5', '5x5 Strength', 'Heavy compound movements with 5 sets of 5 reps',
   ARRAY['5-5-5-5-5'], 5, 180, '{"categoryA": 2, "categoryB": 1, "categoryC": 0}'::jsonb, 'strength'),

  ('hypertrophy_8_12', '8-12 Regular', 'Standard hypertrophy training with moderate weight',
   ARRAY['8-8-8', '8-8-8-8', '10-10-10', '10-10-10-10', '12-12-12'], 4, 90,
   '{"categoryA": 2, "categoryB": 2, "categoryC": 1}'::jsonb, 'hypertrophy'),

  ('volume', 'Volume', 'High volume training for maximum muscle stimulus',
   ARRAY['8-8-8-8-8', '10-10-10-10-10', '12-12-12-12'], 5, 60,
   '{"categoryA": 2, "categoryB": 2, "categoryC": 2}'::jsonb, 'hypertrophy'),

  ('power_2_6', '2-6 Power', 'Low rep explosive power training',
   ARRAY['2-2-2', '3-3-3', '4-4-4', '5-5-5', '6-6-6'], 4, 180,
   '{"categoryA": 3, "categoryB": 1, "categoryC": 0}'::jsonb, 'power'),

  ('beginner_10_15', 'Beginner 10-15', 'Higher reps with lighter weight for beginners',
   ARRAY['10-10-10', '12-12-12', '15-15-15'], 3, 60,
   '{"categoryA": 1, "categoryB": 2, "categoryC": 1}'::jsonb, 'endurance'),

  ('light_finish', '8-12 Light Finish', 'Hypertrophy with lighter finisher exercises',
   ARRAY['8-8-8-8', '10-10-10-10', '12-12-12-12'], 4, 75,
   '{"categoryA": 1, "categoryB": 2, "categoryC": 2}'::jsonb, 'hypertrophy');

-- ============================================
-- WORKOUT SESSIONS TABLE
-- ============================================

CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  workout_type_id TEXT REFERENCES workout_types(id),
  muscle_groups TEXT[] NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  total_volume DECIMAL(10, 2) DEFAULT 0,
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,

  -- AI-generated workout flag (for premium users)
  is_ai_generated BOOLEAN DEFAULT FALSE,
  ai_prompt TEXT
);

CREATE INDEX idx_sessions_user ON workout_sessions(user_id);
CREATE INDEX idx_sessions_date ON workout_sessions(created_at DESC);

-- ============================================
-- SESSION EXERCISES TABLE
-- (exercises assigned to a workout session)
-- ============================================

CREATE TABLE session_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id TEXT REFERENCES exercises(id),
  exercise_order INTEGER NOT NULL,
  assigned_rep_scheme TEXT NOT NULL,

  -- Previous best data for "BEAT THIS" display
  previous_best_id UUID,
  target_weights DECIMAL(6, 2)[]
);

CREATE INDEX idx_session_exercises_session ON session_exercises(session_id);

-- ============================================
-- EXERCISE SETS TABLE
-- (individual sets within a session exercise)
-- ============================================

CREATE TABLE exercise_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_exercise_id UUID REFERENCES session_exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  target_reps INTEGER NOT NULL,
  achieved_reps INTEGER,
  weight DECIMAL(6, 2),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_sets_session_exercise ON exercise_sets(session_exercise_id);

-- ============================================
-- WORKOUT HISTORY VIEW
-- (for easy querying of past performance)
-- ============================================

CREATE VIEW workout_history AS
SELECT
  es.id as set_id,
  ws.id as session_id,
  ws.user_id,
  ws.created_at as workout_date,
  se.exercise_id,
  e.name as exercise_name,
  e.muscle_group_id,
  se.assigned_rep_scheme,
  es.set_number,
  es.achieved_reps,
  es.weight,
  (es.achieved_reps * es.weight) as set_volume
FROM exercise_sets es
JOIN session_exercises se ON es.session_exercise_id = se.id
JOIN workout_sessions ws ON se.session_id = ws.id
JOIN exercises e ON se.exercise_id = e.id
WHERE es.completed = TRUE;

-- ============================================
-- PERSONAL RECORDS TABLE
-- (tracks PRs for each exercise)
-- ============================================

CREATE TABLE personal_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  exercise_id TEXT REFERENCES exercises(id),
  record_type TEXT CHECK (record_type IN ('max_weight', 'max_reps', 'max_volume')),
  value DECIMAL(10, 2) NOT NULL,
  rep_scheme TEXT,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id UUID REFERENCES workout_sessions(id),

  UNIQUE(user_id, exercise_id, record_type)
);

CREATE INDEX idx_pr_user_exercise ON personal_records(user_id, exercise_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all user-related tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exercise_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own exercise settings" ON user_exercise_settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sessions" ON workout_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own session exercises" ON session_exercises
  FOR ALL USING (
    session_id IN (SELECT id FROM workout_sessions WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can view own sets" ON exercise_sets
  FOR ALL USING (
    session_exercise_id IN (
      SELECT se.id FROM session_exercises se
      JOIN workout_sessions ws ON se.session_id = ws.id
      WHERE ws.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own PRs" ON personal_records
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to get previous best for an exercise
CREATE OR REPLACE FUNCTION get_previous_best(
  p_user_id UUID,
  p_exercise_id TEXT,
  p_rep_scheme TEXT
)
RETURNS TABLE (
  session_id UUID,
  workout_date TIMESTAMP WITH TIME ZONE,
  total_reps INTEGER,
  max_weight DECIMAL,
  total_volume DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ws.id as session_id,
    ws.created_at as workout_date,
    SUM(es.achieved_reps)::INTEGER as total_reps,
    MAX(es.weight) as max_weight,
    SUM(es.achieved_reps * es.weight) as total_volume
  FROM workout_sessions ws
  JOIN session_exercises se ON ws.id = se.session_id
  JOIN exercise_sets es ON se.id = es.session_exercise_id
  WHERE ws.user_id = p_user_id
    AND se.exercise_id = p_exercise_id
    AND se.assigned_rep_scheme = p_rep_scheme
    AND es.completed = TRUE
  GROUP BY ws.id, ws.created_at
  ORDER BY total_volume DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to update personal records after workout
CREATE OR REPLACE FUNCTION update_personal_records()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_exercise_id TEXT;
  v_session_id UUID;
  v_max_weight DECIMAL;
  v_max_reps INTEGER;
  v_max_volume DECIMAL;
BEGIN
  -- Get session info
  SELECT ws.user_id, se.exercise_id, ws.id
  INTO v_user_id, v_exercise_id, v_session_id
  FROM session_exercises se
  JOIN workout_sessions ws ON se.session_id = ws.id
  WHERE se.id = NEW.session_exercise_id;

  -- Check and update max weight PR
  IF NEW.weight > COALESCE((
    SELECT value FROM personal_records
    WHERE user_id = v_user_id AND exercise_id = v_exercise_id AND record_type = 'max_weight'
  ), 0) THEN
    INSERT INTO personal_records (user_id, exercise_id, record_type, value, session_id)
    VALUES (v_user_id, v_exercise_id, 'max_weight', NEW.weight, v_session_id)
    ON CONFLICT (user_id, exercise_id, record_type)
    DO UPDATE SET value = NEW.weight, achieved_at = NOW(), session_id = v_session_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update PRs when sets are completed
CREATE TRIGGER trigger_update_prs
AFTER UPDATE OF completed ON exercise_sets
FOR EACH ROW
WHEN (NEW.completed = TRUE AND OLD.completed = FALSE)
EXECUTE FUNCTION update_personal_records();
