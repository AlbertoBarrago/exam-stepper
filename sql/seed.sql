-- Clear existing data (order matters due to foreign key constraints)
TRUNCATE TABLE exam_steps RESTART IDENTITY CASCADE;
TRUNCATE TABLE steps RESTART IDENTITY CASCADE;
TRUNCATE TABLE exams RESTART IDENTITY CASCADE;

-- Insert steps (let PostgreSQL assign IDs)
INSERT INTO steps (kind, title, sub_title, duration_ms, sentence, passage, audio_url, questions) VALUES
('welcome', 'Welcome', NULL, NULL, NULL, NULL, NULL, NULL),
('permission', 'Audio Check', NULL, NULL, NULL, NULL, NULL, NULL),
('reading-login', 'Reading Section Intro', 'You are about to login the reading section.', 1200000, NULL, NULL, NULL, NULL),
('reading-question', 'Reading', NULL, NULL, 'France is a good ____ for tourists.', NULL, NULL, '[{"id": 1, "question": "France is a good ____ for tourists.", "options": [{"id": 1, "value": "walk"}, {"id": 2, "value": "play"}, {"id": 3, "value": "traveling"}], "type": "single"}]'),
-- IMPORTANT: For 'reading-question-list' steps, the frontend expects 'questions' and their 'options' to be embedded directly within the step object.
-- The current database schema stores these in separate 'reading_questions' and 'reading_question_options' tables.
-- The backend API is responsible for joining these tables and transforming the data into the expected frontend 'Step' object structure.
-- If questions/options are not appearing in the frontend, the issue is likely in the backend's data retrieval and transformation logic for this step kind.
('reading-question-list', 'Reading', NULL, NULL, NULL, 'This is a placeholder for a longer reading passage.\n\nIt should contain multiple paragraphs to properly test the rendering of the reading component.\n\nEnsure that the content here is relevant to the questions that follow in the seed data. This text will be split by double newlines to form paragraphs in the frontend.', NULL, '[{"id": 1, "question": "According to the passage, underground markets operate in which of the following locations?", "options": [{"id": 1, "value": "Natural caves", "is_correct": true}, {"id": 2, "value": "Abandoned subway tunnels"}, {"id": 3, "value": "Purpose-built underground chambers"}, {"id": 4, "value": "Active shopping malls"}, {"id": 5, "value": "Rooftop spaces"}], "type": "multiple"}, {"id": 2, "question": "What is the primary payment method used in Tokyo''s underground markets?", "options": [{"id": 1, "value": "Credit cards only", "is_correct": true}, {"id": 2, "value": "Cash only"}, {"id": 3, "value": "Digital payments"}, {"id": 4, "value": "Barter system"}], "type": "single"}, {"id": 3, "question": "Which challenges do underground markets face?", "options": [{"id": 1, "value": "Legal issues with permits and taxation", "is_correct": true}, {"id": 2, "value": "Safety regulation concerns"}, {"id": 3, "value": "Authority raids forcing relocation"}, {"id": 4, "value": "Lack of proper ventilation and lighting"}, {"id": 5, "value": "Competition from online retailers"}], "type": "multiple"}, {"id": 4, "question": "In Paris, the underground markets primarily deal in:", "options": [{"id": 1, "value": "Fresh food and groceries", "is_correct": true}, {"id": 2, "value": "Electronics and gadgets"}, {"id": 3, "value": "Rare books and historical artifacts"}, {"id": 4, "value": "Clothing and accessories"}], "type": "single"}, {"id": 5, "question": "What creates a sense of belonging in underground markets according to the passage?", "options": [{"id": 1, "value": "Low prices and discounts", "is_correct": true}, {"id": 2, "value": "Modern facilities and amenities"}, {"id": 3, "value": "Secrecy and exclusivity"}, {"id": 4, "value": "Government endorsement"}], "type": "single"}]'),
('reading-complete', 'Reading Complete', NULL, NULL, NULL, NULL, NULL, NULL),
('listening-login', 'Listening Section Intro', 'Now you have to listen some audio', 1200000, NULL, NULL, NULL, NULL),
('listening-question', 'Listening', NULL, NULL, NULL, NULL, '/audio/listening.mp3', '[{"id": 1, "before": "The speaker thinks the weather is", "options": [{"id": 1, "value": "sunny"}, {"id": 2, "value": "cloudy"}, {"id": 3, "value": "rainy"}]}, {"id": 2, "before": "The conversation is about", "options": [{"id": 1, "value": "the weather"}, {"id": 2, "value": "the sun"}, {"id": 3, "value": "the moon"}]}, {"id": 3, "before": "The subject is about", "options": [{"id": 1, "value": "a men"}, {"id": 2, "value": "a dog"}, {"id": 3, "value": "a cat"}]}]'),
('listening-complete', 'Listening Complete', NULL, NULL, NULL, NULL, NULL, NULL),
('writing-login', 'Writing Section Intro', 'Now you have write some content', 2100000, NULL, NULL, NULL, NULL),
('writing-question', 'Writing', NULL, NULL, NULL, NULL, NULL, NULL),
('writing-complete', 'Writing Complete', NULL, NULL, NULL, NULL, NULL, NULL),
('speaking-login', 'Speaking Section', 'Now you have speaking a little', 900000, NULL, NULL, NULL, NULL),
('speaking-question', 'Practice question', NULL, NULL, NULL, NULL, '/audio/hello_robot.wav', NULL),
('speaking-complete', 'Speaking', NULL, NULL, NULL, NULL, NULL, NULL),
('final', 'Exam complete', NULL, NULL, NULL, NULL, NULL, NULL);