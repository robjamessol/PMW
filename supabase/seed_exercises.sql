-- ============================================
-- EXERCISE SEED DATA
-- Run this AFTER schema.sql
-- ============================================

-- ABS exercises
INSERT INTO exercises (id, name, display_name, muscle_group_id, category) VALUES
('abs_1', 'ABS 1', '1', 'abs', 'A'),
('abs_2', 'sa', 'sa', 'abs', 'A'),
('abs_3', 'ABS LOWER 1', 'LOWER 1', 'abs', 'B'),
('abs_4', 'ABS UPPER 1', 'UPPER 1', 'abs', 'C');

-- BACK exercises
INSERT INTO exercises (id, name, display_name, muscle_group_id, category) VALUES
('back_1', 'BACK Bent over Dumbbell Rows', 'Bent over Dumbbell Rows', 'back', 'A'),
('back_2', 'BACK Cable Rows', 'Cable Rows', 'back', 'A'),
('back_3', 'BACK Deadlifts', 'Deadlifts', 'back', 'A'),
('back_4', 'BACK Lat Pulldown Close Grip', 'Lat Pulldown Close Grip', 'back', 'A'),
('back_5', 'BACK Lat Pulldown Reverse Grip', 'Lat Pulldown Reverse Grip', 'back', 'A'),
('back_6', 'BACK Lat Pulldown Wide Grip', 'Lat Pulldown Wide Grip', 'back', 'A'),
('back_7', 'BACK T Bar Row', 'T Bar Row', 'back', 'A'),
('back_8', 'BACK Rack Pulls', 'Rack Pulls', 'back', 'A'),
('back_9', 'BACK Bent over Barbell Rows', 'Bent over Barbell Rows', 'back', 'A'),
('back_10', 'BACK T Bar Row Machine', 'T Bar Row Machine', 'back', 'B'),
('back_11', 'BACK Bent over Dumbbell Row Single Arm', 'Bent over Dumbbell Row Single Arm', 'back', 'B'),
('back_12', 'BACK Machine Row', 'Machine Row', 'back', 'B'),
('back_13', 'BACK Cable Rows Wide Grip', 'Cable Rows Wide Grip', 'back', 'B'),
('back_14', 'BACK Chin Ups Weighted', 'Chin Ups Weighted', 'back', 'B'),
('back_15', 'BACK Inverted Row', 'Inverted Row', 'back', 'B'),
('back_16', 'BACK Lat Pulldowns Behind Head', 'Lat Pulldowns Behind Head', 'back', 'B'),
('back_17', 'BACK Pull-ups Weighted', 'Pull-ups Weighted', 'back', 'B'),
('back_18', 'BACK Row Smith Machine', 'Row Smith Machine', 'back', 'B'),
('back_19', 'BACK Cable Row Single Arm', 'Cable Row Single Arm', 'back', 'C'),
('back_20', 'BACK Machine Row Single Arm', 'Machine Row Single Arm', 'back', 'C'),
('back_21', 'BACK Row Single Arm Smith Machine', 'Row Single Arm Smith Machine', 'back', 'C'),
('back_22', 'BACK Good Mornings', 'Good Mornings', 'back', 'C'),
('back_23', 'BACK Lower Back Extensions', 'Lower Back Extensions', 'back', 'C'),
('back_24', 'BACK Single Lat Cable Pulldowns', 'Single Lat Cable Pulldowns', 'back', 'C');

-- BICEPS exercises
INSERT INTO exercises (id, name, display_name, muscle_group_id, category) VALUES
('biceps_1', 'BICEPS 1', '1', 'biceps', 'A'),
('biceps_2', 'BICEPS Barbell Curls Close Grip', 'Barbell Curls Close Grip', 'biceps', 'B'),
('biceps_3', 'BICEPS Barbell Curls Wide Grip', 'Barbell Curls Wide Grip', 'biceps', 'B'),
('biceps_4', 'BICEPS Cable Curls Bar', 'Cable Curls Bar', 'biceps', 'B'),
('biceps_5', 'BICEPS Cable Curls Preacher', 'Cable Curls Preacher', 'biceps', 'B'),
('biceps_6', 'BICEPS Concentration Curls', 'Concentration Curls', 'biceps', 'B'),
('biceps_7', 'BICEPS Dumbbell Curls Decline', 'Dumbbell Curls Decline', 'biceps', 'B'),
('biceps_8', 'BICEPS Dumbbell Curls Incline', 'Dumbbell Curls Incline', 'biceps', 'B'),
('biceps_10', 'BICEPS Dumbbell Curls Standing', 'Dumbbell Curls Standing', 'biceps', 'B'),
('biceps_11', 'BICEPS Hammer Curls', 'Hammer Curls', 'biceps', 'B'),
('biceps_12', 'BICEPS Hammer Curls Cross Body', 'Hammer Curls Cross Body', 'biceps', 'B'),
('biceps_13', 'BICEPS Machine Curls', 'Machine Curls', 'biceps', 'B'),
('biceps_14', 'BICEPS Preacher Curls Ezy Bar', 'Preacher Curls Ezy Bar', 'biceps', 'B'),
('biceps_15', 'BICEPS Cable Curls from bottom', 'Cable Curls from bottom', 'biceps', 'B'),
('biceps_16', 'BICEPS Cable Curls Overhead', 'Cable Curls Overhead', 'biceps', 'C'),
('biceps_17', 'BICEPS Cable Curls Single Arm', 'Cable Curls Single Arm', 'biceps', 'C'),
('biceps_18', 'BICEPS Cable Curls Squatting', 'Cable Curls Squatting', 'biceps', 'C'),
('biceps_19', 'BICEPS Cable Hammer Curls Rope', 'Cable Hammer Curls Rope', 'biceps', 'C'),
('biceps_20', 'BICEPS Drag Curls', 'Drag Curls', 'biceps', 'C'),
('biceps_21', 'BICEPS Preacher Curls Dumbbell', 'Preacher Curls Dumbbell', 'biceps', 'C'),
('biceps_22', 'BICEPS Preacher Curls Hammer', 'Preacher Curls Hammer', 'biceps', 'C'),
('biceps_23', 'BICEPS Spider Curls', 'Spider Curls', 'biceps', 'C');

-- CHEST exercises
INSERT INTO exercises (id, name, display_name, muscle_group_id, category) VALUES
('chest_1', 'CHEST Bench Press Decline Dumbbell', 'Bench Press Decline Dumbbell', 'chest', 'A'),
('chest_2', 'CHEST Bench Press Flat Barbell', 'Bench Press Flat Barbell', 'chest', 'A'),
('chest_3', 'CHEST Bench Press Flat Dumbbell', 'Bench Press Flat Dumbbell', 'chest', 'A'),
('chest_4', 'CHEST Bench Press Incline Barbell', 'Bench Press Incline Barbell', 'chest', 'A'),
('chest_5', 'CHEST Bench Press Incline Dumbbell', 'Bench Press Incline Dumbbell', 'chest', 'A'),
('chest_6', 'CHEST Bench Press Incline Smith Machine', 'Bench Press Incline Smith Machine', 'chest', 'A'),
('chest_7', 'CHEST Bench Press Flat Smith Machine', 'Bench Press Flat Smith Machine', 'chest', 'A'),
('chest_8', 'CHEST Bench Press Decline Barbell', 'Bench Press Decline Barbell', 'chest', 'A'),
('chest_9', 'CHEST Bench Press Squeeze Dumbbell', 'Bench Press Squeeze Dumbbell', 'chest', 'B'),
('chest_10', 'CHEST Cable Flys High', 'Cable Flys High', 'chest', 'B'),
('chest_11', 'CHEST Cable Flys Low', 'Cable Flys Low', 'chest', 'B'),
('chest_12', 'CHEST Cable Flys Lying', 'Cable Flys Lying', 'chest', 'B'),
('chest_13', 'CHEST Cable Flys Mid', 'Cable Flys Mid', 'chest', 'B'),
('chest_14', 'CHEST Cable Flys Seated', 'Cable Flys Seated', 'chest', 'B'),
('chest_15', 'CHEST Chest Press Seated', 'Chest Press Seated', 'chest', 'B'),
('chest_16', 'CHEST Chest Press Seated Incline', 'Chest Press Seated Incline', 'chest', 'B'),
('chest_17', 'CHEST Dips for Chest', 'Dips for Chest', 'chest', 'B'),
('chest_18', 'CHEST Flys Incline Dumbbell', 'Flys Incline Dumbbell', 'chest', 'B'),
('chest_19', 'CHEST Flys Lying Dumbbell', 'Flys Lying Dumbbell', 'chest', 'B'),
('chest_20', 'CHEST Pec Deck', 'Pec Deck', 'chest', 'B'),
('chest_21', 'CHEST Guillotine Bench Press Smith Machine', 'Guillotine Bench Press Smith Machine', 'chest', 'C'),
('chest_22', 'CHEST Landmine Press', 'Landmine Press', 'chest', 'C'),
('chest_23', 'CHEST Pullover Dumbbell', 'Pullover Dumbbell', 'chest', 'C'),
('chest_24', 'CHEST Push Ups', 'Push Ups', 'chest', 'C');

-- LEGS exercises
INSERT INTO exercises (id, name, display_name, muscle_group_id, category) VALUES
('legs_1', 'LEGS Deadlift Romanian', 'Deadlift Romanian', 'legs', 'A'),
('legs_2', 'LEGS Deadlift Stiff Legged Dumbbells', 'Deadlift Stiff Legged Dumbbells', 'legs', 'A'),
('legs_3', 'LEGS Deadlift Sumo', 'Deadlift Sumo', 'legs', 'A'),
('legs_4', 'LEGS Deadlifts', 'Deadlifts', 'legs', 'A'),
('legs_5', 'LEGS Hang Clean Barbell', 'Hang Clean Barbell', 'legs', 'A'),
('legs_6', 'LEGS Leg Press 45 Deg', 'Leg Press 45 Deg', 'legs', 'A'),
('legs_7', 'LEGS Leg Press 45 Deg Narrow Stance', 'Leg Press 45 Deg Narrow Stance', 'legs', 'A'),
('legs_8', 'LEGS Leg Press 45 Deg Wide Stance', 'Leg Press 45 Deg Wide Stance', 'legs', 'A'),
('legs_9', 'LEGS Power Snatch', 'Power Snatch', 'legs', 'A'),
('legs_10', 'LEGS Smith Machine Squat', 'Smith Machine Squat', 'legs', 'A'),
('legs_11', 'LEGS Snatch Dumbbell', 'Snatch Dumbbell', 'legs', 'A'),
('legs_13', 'LEGS Squats Back', 'Squats Back', 'legs', 'A'),
('legs_14', 'LEGS Deadlift Stiff Legged', 'Deadlift Stiff Legged', 'legs', 'B'),
('legs_16', 'LEGS Leg Press 45 Deg One Legged', 'Leg Press 45 Deg One Legged', 'legs', 'B'),
('legs_17', 'LEGS Hack Squat Barbell', 'Hack Squat Barbell', 'legs', 'B'),
('legs_18', 'LEGS Hack Squat Machine', 'Hack Squat Machine', 'legs', 'B'),
('legs_19', 'LEGS Hack Squat Narrow Stance', 'Hack Squat Narrow Stance', 'legs', 'B'),
('legs_20', 'LEGS Hack Squat Wide Stance', 'Hack Squat Wide Stance', 'legs', 'B'),
('legs_21', 'LEGS Leg Press Machine', 'Leg Press Machine', 'legs', 'B'),
('legs_22', 'LEGS Lunges Barbell', 'Lunges Barbell', 'legs', 'B'),
('legs_23', 'LEGS Lunges Dumbbell', 'Lunges Dumbbell', 'legs', 'B'),
('legs_24', 'LEGS One Arm Overhead Squat Kettle Bell', 'One Arm Overhead Squat Kettle Bell', 'legs', 'B'),
('legs_25', 'LEGS One Legged Squat Dumbbell', 'One Legged Squat Dumbbell', 'legs', 'B'),
('legs_26', 'LEGS Overhead Squats Barbell', 'Overhead Squats Barbell', 'legs', 'B'),
('legs_27', 'LEGS Side Squat Barbell', 'Side Squat Barbell', 'legs', 'B'),
('legs_28', 'LEGS Side Squat Dumbbell', 'Side Squat Dumbbell', 'legs', 'B'),
('legs_29', 'LEGS One Legged Squat Barbell', 'One Legged Squat Barbell', 'legs', 'B'),
('legs_30', 'LEGS Smith Machine Lunges', 'Smith Machine Lunges', 'legs', 'B'),
('legs_31', 'LEGS Thrusters Dumbbells', 'Thrusters Dumbbells', 'legs', 'B'),
('legs_32', 'LEGS V Squat', 'V Squat', 'legs', 'B'),
('legs_34', 'LEGS Thrusters Barbell', 'Thrusters Barbell', 'legs', 'B'),
('legs_35', 'LEGS Leg Curl', 'Leg Curl', 'legs', 'B'),
('legs_36', 'LEGS Leg Extensions', 'Leg Extensions', 'legs', 'B'),
('legs_37', 'LEGS Single Leg Curls', 'Single Leg Curls', 'legs', 'B'),
('legs_38', 'LEGS Single Leg Kickbacks', 'Single Leg Kickbacks', 'legs', 'B'),
('legs_39', 'LEGS Reverse V Squats', 'Reverse V Squats', 'legs', 'B'),
('legs_40', 'LEGS Air Squats', 'Air Squats', 'legs', 'B'),
('legs_41', 'LEGS Wall Balls', 'Wall Balls', 'legs', 'B'),
('legs_42', 'LEGS Dumbbell Step Ups', 'Dumbbell Step Ups', 'legs', 'B'),
('legs_43', 'LEGS Burpee', 'Burpee', 'legs', 'B'),
('legs_44', 'LEGS Jumping Squats', 'Jumping Squats', 'legs', 'B'),
('legs_45', 'LEGS Calf Raises Seated', 'Calf Raises Seated', 'legs', 'C'),
('legs_46', 'LEGS Calf Raises Standing', 'Calf Raises Standing', 'legs', 'C'),
('legs_47', 'LEGS Leg Press 45 Deg Calf Press', 'Leg Press 45 Deg Calf Press', 'legs', 'C'),
('legs_48', 'LEGS Leg Press Single Leg Calf Extensions', 'Leg Press Single Leg Calf Extensions', 'legs', 'C'),
('legs_49', 'LEGS Calf Raises Seated 45 Deg', 'Calf Raises Seated 45 Deg', 'legs', 'C');

-- TRICEPS exercises
INSERT INTO exercises (id, name, display_name, muscle_group_id, category) VALUES
('triceps_1', 'TRICEPS 1', '1', 'triceps', 'A'),
('triceps_2', 'TRICEPS Bench Press Close Grip', 'Bench Press Close Grip', 'triceps', 'B'),
('triceps_3', 'TRICEPS Dips Seated', 'Dips Seated', 'triceps', 'B'),
('triceps_4', 'TRICEPS Dips Upright', 'Dips Upright', 'triceps', 'B'),
('triceps_5', 'TRICEPS Skull Crushers', 'Skull Crushers', 'triceps', 'B'),
('triceps_6', 'TRICEPS Triceps Bar Pushdowns', 'Triceps Bar Pushdowns', 'triceps', 'B'),
('triceps_7', 'TRICEPS Triceps Extensions Lying Dumbbell', 'Triceps Extensions Lying Dumbbell', 'triceps', 'B'),
('triceps_8', 'TRICEPS Triceps Extensions Machine', 'Triceps Extensions Machine', 'triceps', 'B'),
('triceps_9', 'TRICEPS Triceps Extensions Overhead Barbell', 'Triceps Extensions Overhead Barbell', 'triceps', 'B'),
('triceps_10', 'TRICEPS Triceps Extensions Overhead Cable', 'Triceps Extensions Overhead Cable', 'triceps', 'B'),
('triceps_11', 'TRICEPS Triceps Extensions Two Arm Dumbbell', 'Triceps Extensions Two Arm Dumbbell', 'triceps', 'B'),
('triceps_12', 'TRICEPS Triceps Pushdowns V-bar', 'Triceps Pushdowns V-bar', 'triceps', 'B'),
('triceps_13', 'TRICEPS Triceps Rope Pushdowns', 'Triceps Rope Pushdowns', 'triceps', 'B'),
('triceps_14', 'TRICEPS One Arm Cable Reverse', 'One Arm Cable Reverse', 'triceps', 'C'),
('triceps_15', 'TRICEPS Pushups Diamond', 'Pushups Diamond', 'triceps', 'C'),
('triceps_16', 'TRICEPS Reverse Bar Triceps Extensions', 'Reverse Bar Triceps Extensions', 'triceps', 'C'),
('triceps_17', 'TRICEPS Triceps Extensions One Arm Dumbbell', 'Triceps Extensions One Arm Dumbbell', 'triceps', 'C'),
('triceps_18', 'TRICEPS Triceps Kickbacks Cable', 'Triceps Kickbacks Cable', 'triceps', 'C'),
('triceps_19', 'TRICEPS Triceps Kickbacks Dumbbell', 'Triceps Kickbacks Dumbbell', 'triceps', 'C');

-- SHOULDERS exercises
INSERT INTO exercises (id, name, display_name, muscle_group_id, category) VALUES
('shoulders_1', 'SHOULDERS Dumbbell Press Neutral Grip', 'Dumbbell Press Neutral Grip', 'shoulders', 'A'),
('shoulders_2', 'SHOULDERS Overhead Press Barbell', 'Overhead Press Barbell', 'shoulders', 'A'),
('shoulders_3', 'SHOULDERS Shoulder Press Machine', 'Shoulder Press Machine', 'shoulders', 'A'),
('shoulders_4', 'SHOULDERS Shoulder Press Smith Machine', 'Shoulder Press Smith Machine', 'shoulders', 'A'),
('shoulders_5', 'SHOULDERS Shoulder Press Arnolds', 'Shoulder Press Arnolds', 'shoulders', 'A'),
('shoulders_6', 'SHOULDERS Military Dumbbell Press', 'Military Dumbbell Press', 'shoulders', 'A'),
('shoulders_7', 'SHOULDERS Bus Drivers', 'Bus Drivers', 'shoulders', 'B'),
('shoulders_8', 'SHOULDERS Cable Raises Front', 'Cable Raises Front', 'shoulders', 'B'),
('shoulders_9', 'SHOULDERS Cable Raises Side', 'Cable Raises Side', 'shoulders', 'B'),
('shoulders_10', 'SHOULDERS Cable Rear-delt Fly', 'Cable Rear-delt Fly', 'shoulders', 'B'),
('shoulders_11', 'SHOULDERS Dumbbell Lateral Raises Bent over', 'Dumbbell Lateral Raises Bent over', 'shoulders', 'B'),
('shoulders_12', 'SHOULDERS Dumbbell Raises Front', 'Dumbbell Raises Front', 'shoulders', 'B'),
('shoulders_13', 'SHOULDERS Dumbbell Raises Side', 'Dumbbell Raises Side', 'shoulders', 'B'),
('shoulders_14', 'SHOULDERS Front Raises Barbell', 'Front Raises Barbell', 'shoulders', 'B'),
('shoulders_15', 'SHOULDERS Rear Delt Reverse Fly Machine', 'Rear Delt Reverse Fly Machine', 'shoulders', 'B'),
('shoulders_16', 'SHOULDERS Shoulder Press Dumbbell One Arm', 'Shoulder Press Dumbbell One Arm', 'shoulders', 'B'),
('shoulders_17', 'SHOULDERS Upright Row Barbell', 'Upright Row Barbell', 'shoulders', 'B'),
('shoulders_18', 'SHOULDERS Upright Row Cable', 'Upright Row Cable', 'shoulders', 'B'),
('shoulders_19', 'SHOULDERS Upright Row Smith Machine', 'Upright Row Smith Machine', 'shoulders', 'B'),
('shoulders_20', 'SHOULDERS Shoulder Press Behind Head SM', 'Shoulder Press Behind Head SM', 'shoulders', 'B'),
('shoulders_21', 'SHOULDERS Face Pulls', 'Face Pulls', 'shoulders', 'C'),
('shoulders_22', 'SHOULDERS Shrugs Barbell', 'Shrugs Barbell', 'shoulders', 'C'),
('shoulders_23', 'SHOULDERS Shrugs Dumbbells', 'Shrugs Dumbbells', 'shoulders', 'C');

-- FULL BODY exercises
INSERT INTO exercises (id, name, display_name, muscle_group_id, category) VALUES
('full_body_1', 'FULL 1', 'FULL 1', 'full_body', 'A'),
('full_body_2', 'FULL 11', 'FULL 11', 'full_body', 'B'),
('full_body_3', 'FULL 19', 'FULL 19', 'full_body', 'C');

-- QUADRICEPS exercises
INSERT INTO exercises (id, name, display_name, muscle_group_id, category) VALUES
('quadriceps_1', 'QUADRICEPS 1', '1', 'quadriceps', 'A'),
('quadriceps_2', 'QUADRICEPS 12', '12', 'quadriceps', 'B'),
('quadriceps_3', 'QUADRICEPS 20', '20', 'quadriceps', 'C');

-- CALVES exercises
INSERT INTO exercises (id, name, display_name, muscle_group_id, category) VALUES
('calves_1', 'CALVES 1', '1', 'calves', 'A'),
('calves_2', 'CALVES 12', '12', 'calves', 'B'),
('calves_3', 'CALVES 20', '20', 'calves', 'C');

-- HAMSTRINGS exercises
INSERT INTO exercises (id, name, display_name, muscle_group_id, category) VALUES
('hamstrings_1', 'HAMSTRINGS 1', '1', 'hamstrings', 'A'),
('hamstrings_2', 'saads', 'saads', 'hamstrings', 'A'),
('hamstrings_3', 'HAMSTRINGS 12', '12', 'hamstrings', 'B'),
('hamstrings_5', 'HAMSTRINGS 20', '20', 'hamstrings', 'C');
