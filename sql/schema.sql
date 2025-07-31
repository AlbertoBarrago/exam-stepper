-- Create the exam table
CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    final_score DECIMAL(5, 2),
    cefr_level VARCHAR(2),
    FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Create the step table
CREATE TABLE steps (
    id SERIAL PRIMARY KEY,
    kind VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    sub_title VARCHAR(255),
    duration_ms INT,
    record_ms INT,
    sentence TEXT,
    passage TEXT,
    audio_url VARCHAR(255)
);

-- Create the options table for reading questions
CREATE TABLE reading_options (
    id SERIAL PRIMARY KEY,
    step_id INT NOT NULL,
    value VARCHAR(255) NOT NULL,
    FOREIGN KEY (step_id) REFERENCES steps(id)
);

-- Create the questions table for reading question lists
CREATE TABLE reading_questions (
    id SERIAL PRIMARY KEY,
    step_id INT NOT NULL,
    question TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    FOREIGN KEY (step_id) REFERENCES steps(id)
);

-- Create the options for reading question list questions
CREATE TABLE reading_question_options (
    id SERIAL PRIMARY KEY,
    question_id INT NOT NULL,
    value VARCHAR(255) NOT NULL,
    FOREIGN KEY (question_id) REFERENCES reading_questions(id)
);

-- Create the question table for listening questions
CREATE TABLE listening_questions (
    id SERIAL PRIMARY KEY,
    step_id INT NOT NULL,
    before_text TEXT,
    correct_answer_id INT,
    FOREIGN KEY (step_id) REFERENCES steps(id)
);

-- Create the options for listening to questions
CREATE TABLE listening_question_options (
    id SERIAL PRIMARY KEY,
    question_id INT NOT NULL,
    value VARCHAR(255) NOT NULL,
    FOREIGN KEY (question_id) REFERENCES listening_questions(id)
);

-- Create a table to store the relationship between exams and steps
CREATE TABLE exam_steps (
    id SERIAL PRIMARY KEY,
    exam_id INT NOT NULL,
    step_id INT NOT NULL,
    step_order INT NOT NULL,
    raw_score INT,
    max_score INT,
    normalized_score DECIMAL(5, 2),
    FOREIGN KEY (exam_id) REFERENCES exams(id),
    FOREIGN KEY (step_id) REFERENCES steps(id)
);

