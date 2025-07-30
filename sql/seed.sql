USE EXAM_STEPPER_DB;

-- Temporarily disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Clear existing data (order matters due to foreign key constraints)
TRUNCATE TABLE exam_steps;
TRUNCATE TABLE reading_question_options;
TRUNCATE TABLE reading_questions;
TRUNCATE TABLE reading_options;
TRUNCATE TABLE listening_question_options;
TRUNCATE TABLE listening_questions;
TRUNCATE TABLE steps;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Insert steps
INSERT INTO steps (id, kind, title, sub_title, duration_ms, sentence, passage, audio_url) VALUES
(1, 'welcome', 'Welcome', NULL, NULL, NULL, NULL, NULL),
(2, 'permission', 'Audio Check', NULL, NULL, NULL, NULL, NULL),
(3, 'reading-login', 'Reading Section Intro', 'You are about to login the reading section.', 1200000, NULL, NULL, NULL),
(4, 'reading-question', 'Reading', NULL, NULL, 'France is a good ____ for tourists.', NULL, NULL),
(5, 'reading-question-list', 'Reading', NULL, NULL, NULL, 'The Hidden World of Underground Markets...', NULL),
(6, 'reading-complete', 'Reading Complete', NULL, NULL, NULL, NULL, NULL),
(7, 'listening-login', 'Listening Section Intro', 'Now you have to listen some audio', 1200000, NULL, NULL, NULL),
(8, 'listening-question', 'Listening', NULL, NULL, NULL, NULL, '/audio/listening.mp3'),
(9, 'listening-complete', 'Listening Complete', NULL, NULL, NULL, NULL, NULL),
(10, 'writing-login', 'Writing Section Intro', 'Now you have write some content', 2100000, NULL, NULL, NULL),
(11, 'writing-question', 'Writing', NULL, NULL, NULL, NULL, NULL),
(12, 'writing-complete', 'Writing Complete', NULL, NULL, NULL, NULL, NULL),
(13, 'speaking-login', 'Speaking Section', 'Now you have speaking a little', 900000, NULL, NULL, NULL),
(14, 'speaking-question', 'Practice question', NULL, NULL, NULL, NULL, '/audio/hello_robot.wav'),
(15, 'speaking-complete', 'Speaking', NULL, NULL, NULL, NULL, NULL),
(16, 'final', 'Exam complete', NULL, NULL, NULL, NULL, NULL);

-- reading-question options for step 4
INSERT INTO reading_options (step_id, value) VALUES
(4, 'walk'),
(4, 'play'),
(4, 'traveling');

-- reading-question-list questions and options for step 5
-- Question 1
INSERT INTO reading_questions (step_id, question, type) VALUES (5, 'According to the passage, underground markets operate in which of the following locations?', 'multiple');
SET @last_question_id = LAST_INSERT_ID();
INSERT INTO reading_question_options (question_id, value) VALUES
(@last_question_id, 'Natural caves'),
(@last_question_id, 'Abandoned subway tunnels'),
(@last_question_id, 'Purpose-built underground chambers'),
(@last_question_id, 'Active shopping malls'),
(@last_question_id, 'Rooftop spaces');

-- Question 2
INSERT INTO reading_questions (step_id, question, type) VALUES (5, 'What is the primary payment method used in Tokyo''s underground markets?', 'single');
SET @last_question_id = LAST_INSERT_ID();
INSERT INTO reading_question_options (question_id, value) VALUES
(@last_question_id, 'Credit cards only'),
(@last_question_id, 'Cash only'),
(@last_question_id, 'Digital payments'),
(@last_question_id, 'Barter system');

-- Question 3
INSERT INTO reading_questions (step_id, question, type) VALUES (5, 'Which challenges do underground markets face?', 'multiple');
SET @last_question_id = LAST_INSERT_ID();
INSERT INTO reading_question_options (question_id, value) VALUES
(@last_question_id, 'Legal issues with permits and taxation'),
(@last_question_id, 'Safety regulation concerns'),
(@last_question_id, 'Authority raids forcing relocation'),
(@last_question_id, 'Lack of proper ventilation and lighting'),
(@last_question_id, 'Competition from online retailers');

-- Question 4
INSERT INTO reading_questions (step_id, question, type) VALUES (5, 'In Paris, the underground markets primarily deal in:', 'single');
SET @last_question_id = LAST_INSERT_ID();
INSERT INTO reading_question_options (question_id, value) VALUES
(@last_question_id, 'Fresh food and groceries'),
(@last_question_id, 'Electronics and gadgets'),
(@last_question_id, 'Rare books and historical artifacts'),
(@last_question_id, 'Clothing and accessories');

-- Question 5
INSERT INTO reading_questions (step_id, question, type) VALUES (5, 'What creates a sense of belonging in underground markets according to the passage?', 'single');
SET @last_question_id = LAST_INSERT_ID();
INSERT INTO reading_question_options (question_id, value) VALUES
(@last_question_id, 'Low prices and discounts'),
(@last_question_id, 'Modern facilities and amenities'),
(@last_question_id, 'Secrecy and exclusivity'),
(@last_question_id, 'Government endorsement');

-- listening-question questions and options for step 8
-- Question 1
INSERT INTO listening_questions (step_id, before_text, correct_answer_id) VALUES (8, 'The speaker thinks the weather is', 1);
SET @last_question_id = LAST_INSERT_ID();
INSERT INTO listening_question_options (question_id, value) VALUES
(@last_question_id, 'sunny'),
(@last_question_id, 'cloudy'),
(@last_question_id, 'rainy');

-- Question 2
INSERT INTO listening_questions (step_id, before_text, correct_answer_id) VALUES (8, 'The conversation is about', 2);
SET @last_question_id = LAST_INSERT_ID();
INSERT INTO listening_question_options (question_id, value) VALUES
(@last_question_id, 'the weather'),
(@last_question_id, 'the sun'),
(@last_question_id, 'the moon');

-- Question 3
INSERT INTO listening_questions (step_id, before_text, correct_answer_id) VALUES (8, 'The subject is about', 3);
SET @last_question_id = LAST_INSERT_ID();
INSERT INTO listening_question_options (question_id, value) VALUES
(@last_question_id, 'a men'),
(@last_question_id, 'a dog'),
(@last_question_id, 'a cat');

-- Insert a default user
INSERT INTO users (username, password, email, registration_date, last_login) VALUES ('testuser', 'password', 'test@example.com', NOW(), NOW());
