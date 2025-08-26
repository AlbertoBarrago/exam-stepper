-- Clear existing data (order matters due to foreign key constraints)
TRUNCATE TABLE exam_steps RESTART IDENTITY CASCADE;
TRUNCATE TABLE steps RESTART IDENTITY CASCADE;
TRUNCATE TABLE exams RESTART IDENTITY CASCADE;

-- Insert a sample user into auth.users if it doesn't exist
-- In a real application, users would be managed by Supabase Auth.
-- This is just for seeding purposes.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000000') THEN
    INSERT INTO auth.users (id, email, encrypted_password) VALUES ('00000000-0000-0000-0000-000000000000', 'user@example.com', 'password');
  END IF;
END $$;

-- Create a sample exam
-- Note: The user_id '00000000-0000-0000-0000-000000000000' should exist in the auth.users table.
INSERT INTO exams (id, user_id, created_at, final_score, cefr_level)
VALUES (1, '00000000-0000-0000-0000-000000000000', NOW(), NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Reset the sequence for the exams table to avoid conflicts with manually inserted IDs.
SELECT setval('exams_id_seq', (SELECT MAX(id) FROM exams));

-- Insert steps (let PostgreSQL assign IDs)
INSERT INTO steps (kind, title, sub_title, duration_ms, sentence, passage, audio_url, questions) VALUES
('welcome', 'Welcome', NULL, NULL, NULL, NULL, NULL, NULL),
('permission', 'Audio Check', NULL, NULL, NULL, NULL, NULL, NULL),
('reading-login', 'Reading Section Intro', 'You are about to login the reading section.', 1200000, NULL, NULL, NULL, NULL),
('reading-question', 'Reading', NULL, NULL, 'France is a good ____ for tourists.', NULL, NULL, '[{"id": 1, "question": "France is a good ____ for tourists.", "options": [{"id": 1, "value": "walk"}, {"id": 2, "value": "play"}, {"id": 3, "value": "traveling", "is_correct": true}], "type": "single"}]'),
('reading-question-list', 'Reading', NULL, NULL, NULL, 'This is a placeholder for a longer reading passage.\n\nIt should contain multiple paragraphs to properly test the rendering of the reading component.\n\nEnsure that the content here is relevant to the questions that follow in the seed data. This text will be split by double newlines to form paragraphs in the frontend.', NULL, '[{"id": 1, "question": "According to the passage, underground markets operate in which of the following locations?", "options": [{"id": 1, "value": "Natural caves", "is_correct": true}, {"id": 2, "value": "Abandoned subway tunnels"}, {"id": 3, "value": "Purpose-built underground chambers"}, {"id": 4, "value": "Active shopping malls"}, {"id": 5, "value": "Rooftop spaces"}], "type": "multiple"}, {"id": 2, "question": "What is the primary payment method used in Tokyo''s underground markets?", "options": [{"id": 1, "value": "Credit cards only", "is_correct": true}, {"id": 2, "value": "Cash only"}, {"id": 3, "value": "Digital payments"}, {"id": 4, "value": "Barter system"}], "type": "single"}, {"id": 3, "question": "Which challenges do underground markets face?", "options": [{"id": 1, "value": "Legal issues with permits and taxation", "is_correct": true}, {"id": 2, "value": "Safety regulation concerns"}, {"id": 3, "value": "Authority raids forcing relocation"}, {"id": 4, "value": "Lack of proper ventilation and lighting"}, {"id": 5, "value": "Competition from online retailers"}], "type": "multiple"}, {"id": 4, "question": "In Paris, the underground markets primarily deal in:", "options": [{"id": 1, "value": "Fresh food and groceries", "is_correct": true}, {"id": 2, "value": "Electronics and gadgets"}, {"id": 3, "value": "Rare books and historical artifacts"}, {"id": 4, "value": "Clothing and accessories"}], "type": "single"}, {"id": 5, "question": "What creates a sense of belonging in underground markets according to the passage?", "options": [{"id": 1, "value": "Low prices and discounts"}, {"id": 2, "value": "Shared cultural interests"}, {"id": 3, "value": "Exclusive access for members"}, {"id": 4, "value": "A strong sense of community"}, {"id": 5, "value": "Regular social events"}], "type": "multiple"}]'),
('reading-complete', 'Reading Complete', NULL, NULL, NULL, NULL, NULL, NULL),
('listening-login', 'Listening Section Intro', 'Now you have to listen some audio', 1200000, NULL, NULL, NULL, NULL),
('listening-question', 'Listening', NULL, NULL, NULL, NULL, '/audio/listening.mp3', '('[{"id": 1, "before": "The speaker thinks the weather is", "options": [{"id": 1, "value": "sunny"}, {"id": 2, "value": "cloudy"}, {"id": 3, "value": "rainy", "is_correct": true}]}, {"id": 2, "before": "The conversation is about", "options": [{"id": 1, "value": "the weather", "is_correct": true}, {"id": 2, "value": "the sun"}, {"id": 3, "value": "the moon"}]}, {"id": 3, "before": "The subject is about", "options": [{"id": 1, "value": "a men"}, {"id": 2, "value": "a dog"}, {"id": 3, "value": "a cat", "is_correct": true}]}]')'),
('listening-complete', 'Listening Complete', NULL, NULL, NULL, NULL, NULL, NULL),
('writing-login', 'Writing Section Intro', 'Now you have write some content', 2100000, NULL, NULL, NULL, NULL),
('writing-question', 'Writing', NULL, NULL, NULL, NULL, NULL, NULL),
('writing-complete', 'Writing Complete', NULL, NULL, NULL, NULL, NULL, NULL),
('speaking-login', 'Speaking Section', 'Now you have speaking a little', 900000, NULL, NULL, NULL, NULL),
('speaking-question', 'Practice question', NULL, NULL, NULL, NULL, '/audio/hello_robot.wav', NULL),
('speaking-complete', 'Speaking', NULL, NULL, NULL, NULL, NULL, NULL),
('final', 'Exam complete', NULL, NULL, NULL, NULL, NULL, NULL);

-- Link steps to a sample exam (exam_id = 1)
INSERT INTO exam_steps (exam_id, step_id, step_order, raw_score, max_score)
SELECT
    1,
    id,
    ROW_NUMBER() OVER (ORDER BY id),
    CASE
        WHEN kind LIKE 'reading-question%' THEN 15
        WHEN kind LIKE 'listening-question%' THEN 12
        WHEN kind LIKE 'speaking-question%' THEN 80
        WHEN kind LIKE 'writing-question%' THEN 35
        ELSE NULL
    END,
    CASE
        WHEN kind LIKE 'reading-question%' THEN 20
        WHEN kind LIKE 'listening-question%' THEN 15
        WHEN kind LIKE 'speaking-question%' THEN 100
        WHEN kind LIKE 'writing-question%' THEN 40
        ELSE NULL
    END
FROM steps;