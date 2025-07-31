-- Clear existing data (order matters due to foreign key constraints)
TRUNCATE TABLE exam_steps RESTART IDENTITY CASCADE;
TRUNCATE TABLE reading_question_options RESTART IDENTITY CASCADE;
TRUNCATE TABLE reading_questions RESTART IDENTITY CASCADE;
TRUNCATE TABLE reading_options RESTART IDENTITY CASCADE;
TRUNCATE TABLE listening_question_options RESTART IDENTITY CASCADE;
TRUNCATE TABLE listening_questions RESTART IDENTITY CASCADE;
TRUNCATE TABLE steps RESTART IDENTITY CASCADE;
TRUNCATE TABLE exams RESTART IDENTITY CASCADE;

-- Insert steps (let PostgreSQL assign IDs)
INSERT INTO steps (kind, title, sub_title, duration_ms, sentence, passage, audio_url) VALUES
('welcome', 'Welcome', NULL, NULL, NULL, NULL, NULL),
('permission', 'Audio Check', NULL, NULL, NULL, NULL, NULL),
('reading-login', 'Reading Section Intro', 'You are about to login the reading section.', 1200000, NULL, NULL, NULL),
('reading-question', 'Reading', NULL, NULL, 'France is a good ____ for tourists.', NULL, NULL),
('reading-question-list', 'Reading', NULL, NULL, NULL, 'The Hidden World of Underground Markets...', NULL),
('reading-complete', 'Reading Complete', NULL, NULL, NULL, NULL, NULL),
('listening-login', 'Listening Section Intro', 'Now you have to listen some audio', 1200000, NULL, NULL, NULL),
('listening-question', 'Listening', NULL, NULL, NULL, NULL, '/audio/listening.mp3'),
('listening-complete', 'Listening Complete', NULL, NULL, NULL, NULL, NULL),
('writing-login', 'Writing Section Intro', 'Now you have write some content', 2100000, NULL, NULL, NULL),
('writing-question', 'Writing', NULL, NULL, NULL, NULL, NULL),
('writing-complete', 'Writing Complete', NULL, NULL, NULL, NULL, NULL),
('speaking-login', 'Speaking Section', 'Now you have speaking a little', 900000, NULL, NULL, NULL),
('speaking-question', 'Practice question', NULL, NULL, NULL, NULL, '/audio/hello_robot.wav'),
('speaking-complete', 'Speaking', NULL, NULL, NULL, NULL, NULL),
('final', 'Exam complete', NULL, NULL, NULL, NULL, NULL);

-- reading-question options for step 4 (assuming step 4 is still the reading-question step)
INSERT INTO reading_options (step_id, value) VALUES
((SELECT id FROM steps WHERE kind = 'reading-question' AND sentence = 'France is a good ____ for tourists.'), 'walk'),
((SELECT id FROM steps WHERE kind = 'reading-question' AND sentence = 'France is a good ____ for tourists.'), 'play'),
((SELECT id FROM steps WHERE kind = 'reading-question' AND sentence = 'France is a good ____ for tourists.'), 'traveling');

-- reading-question-list questions and options for step 5
-- Question 1
INSERT INTO reading_questions (step_id, question, type) VALUES (
    (SELECT id FROM steps WHERE kind = 'reading-question-list' AND passage LIKE 'The Hidden World of Underground Markets...'),
    'According to the passage, underground markets operate in which of the following locations?',
    'multiple'
);
INSERT INTO reading_question_options (question_id, value) VALUES
((SELECT id FROM reading_questions WHERE question = 'According to the passage, underground markets operate in which of the following locations?'), 'Natural caves'),
((SELECT id FROM reading_questions WHERE question = 'According to the passage, underground markets operate in which of the following locations?'), 'Abandoned subway tunnels'),
((SELECT id FROM reading_questions WHERE question = 'According to the passage, underground markets operate in which of the following locations?'), 'Purpose-built underground chambers'),
((SELECT id FROM reading_questions WHERE question = 'According to the passage, underground markets operate in which of the following locations?'), 'Active shopping malls'),
((SELECT id FROM reading_questions WHERE question = 'According to the passage, underground markets operate in which of the following locations?'), 'Rooftop spaces');

-- Question 2
INSERT INTO reading_questions (step_id, question, type) VALUES (
    (SELECT id FROM steps WHERE kind = 'reading-question-list' AND passage LIKE 'The Hidden World of Underground Markets...'),
    'What is the primary payment method used in Tokyo''s underground markets?',
    'single'
);
INSERT INTO reading_question_options (question_id, value) VALUES
((SELECT id FROM reading_questions WHERE question = 'What is the primary payment method used in Tokyo''s underground markets?'), 'Credit cards only'),
((SELECT id FROM reading_questions WHERE question = 'What is the primary payment method used in Tokyo''s underground markets?'), 'Cash only'),
((SELECT id FROM reading_questions WHERE question = 'What is the primary payment method used in Tokyo''s underground markets?'), 'Digital payments'),
((SELECT id FROM reading_questions WHERE question = 'What is the primary payment method used in Tokyo''s underground markets?'), 'Barter system');

-- Question 3
INSERT INTO reading_questions (step_id, question, type) VALUES (
    (SELECT id FROM steps WHERE kind = 'reading-question-list' AND passage LIKE 'The Hidden World of Underground Markets...'),
    'Which challenges do underground markets face?',
    'multiple'
);
INSERT INTO reading_question_options (question_id, value) VALUES
((SELECT id FROM reading_questions WHERE question = 'Which challenges do underground markets face?'), 'Legal issues with permits and taxation'),
((SELECT id FROM reading_questions WHERE question = 'Which challenges do underground markets face?'), 'Safety regulation concerns'),
((SELECT id FROM reading_questions WHERE question = 'Which challenges do underground markets face?'), 'Authority raids forcing relocation'),
((SELECT id FROM reading_questions WHERE question = 'Which challenges do underground markets face?'), 'Lack of proper ventilation and lighting'),
((SELECT id FROM reading_questions WHERE question = 'Which challenges do underground markets face?'), 'Competition from online retailers');

-- Question 4
INSERT INTO reading_questions (step_id, question, type) VALUES (
    (SELECT id FROM steps WHERE kind = 'reading-question-list' AND passage LIKE 'The Hidden World of Underground Markets...'),
    'In Paris, the underground markets primarily deal in:',
    'single'
);
INSERT INTO reading_question_options (question_id, value) VALUES
((SELECT id FROM reading_questions WHERE question = 'In Paris, the underground markets primarily deal in:'), 'Fresh food and groceries'),
((SELECT id FROM reading_questions WHERE question = 'In Paris, the underground markets primarily deal in:'), 'Electronics and gadgets'),
((SELECT id FROM reading_questions WHERE question = 'In Paris, the underground markets primarily deal in:'), 'Rare books and historical artifacts'),
((SELECT id FROM reading_questions WHERE question = 'In Paris, the underground markets primarily deal in:'), 'Clothing and accessories');

-- Question 5
INSERT INTO reading_questions (step_id, question, type) VALUES (
    (SELECT id FROM steps WHERE kind = 'reading-question-list' AND passage LIKE 'The Hidden World of Underground Markets...'),
    'What creates a sense of belonging in underground markets according to the passage?',
    'single'
);
INSERT INTO reading_question_options (question_id, value) VALUES
((SELECT id FROM reading_questions WHERE question = 'What creates a sense of belonging in underground markets according to the passage?'), 'Low prices and discounts'),
((SELECT id FROM reading_questions WHERE question = 'What creates a sense of belonging in underground markets according to the passage?'), 'Modern facilities and amenities'),
((SELECT id FROM reading_questions WHERE question = 'What creates a sense of belonging in underground markets according to the passage?'), 'Secrecy and exclusivity'),
((SELECT id FROM reading_questions WHERE question = 'What creates a sense of belonging in underground markets according to the passage?'), 'Government endorsement');

-- listening-question questions and options for step 8
-- Question 1
INSERT INTO listening_questions (step_id, before_text, correct_answer_id) VALUES (
    (SELECT id FROM steps WHERE kind = 'listening-question' AND audio_url = '/audio/listening.mp3'),
    'The speaker thinks the weather is',
    (SELECT id FROM listening_question_options WHERE value = 'sunny')
);
INSERT INTO listening_question_options (question_id, value) VALUES
((SELECT id FROM listening_questions WHERE before_text = 'The speaker thinks the weather is'), 'sunny'),
((SELECT id FROM listening_questions WHERE before_text = 'The speaker thinks the weather is'), 'cloudy'),
((SELECT id FROM listening_questions WHERE before_text = 'The speaker thinks the weather is'), 'rainy');

-- Question 2
INSERT INTO listening_questions (step_id, before_text, correct_answer_id) VALUES (
    (SELECT id FROM steps WHERE kind = 'listening-question' AND audio_url = '/audio/listening.mp3'),
    'The conversation is about',
    (SELECT id FROM listening_question_options WHERE value = 'the sun')
);
INSERT INTO listening_question_options (question_id, value) VALUES
((SELECT id FROM listening_questions WHERE before_text = 'The conversation is about'), 'the weather'),
((SELECT id FROM listening_questions WHERE before_text = 'The conversation is about'), 'the sun'),
((SELECT id FROM listening_questions WHERE before_text = 'The conversation is about'), 'the moon');

-- Question 3
INSERT INTO listening_questions (step_id, before_text, correct_answer_id) VALUES (
    (SELECT id FROM steps WHERE kind = 'listening-question' AND audio_url = '/audio/listening.mp3'),
    'The subject is about',
    (SELECT id FROM listening_question_options WHERE value = 'a cat')
);
INSERT INTO listening_question_options (question_id, value) VALUES
((SELECT id FROM listening_questions WHERE before_text = 'The subject is about'), 'a men'),
((SELECT id FROM listening_questions WHERE before_text = 'The subject is about'), 'a dog'),
((SELECT id FROM listening_questions WHERE before_text = 'The subject is about'), 'a cat');
