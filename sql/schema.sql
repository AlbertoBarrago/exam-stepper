CREATE DATABASE IF NOT EXISTS EXAM_STEPPER_DB;
USE EXAM_STEPPER_DB;

-- Create the user's table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the exam table
CREATE TABLE exams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create the step table
CREATE TABLE steps (
    id INT AUTO_INCREMENT PRIMARY KEY,
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
    id INT AUTO_INCREMENT PRIMARY KEY,
    step_id INT NOT NULL,
    value VARCHAR(255) NOT NULL,
    FOREIGN KEY (step_id) REFERENCES steps(id)
);

-- Create the questions table for reading question lists
CREATE TABLE reading_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    step_id INT NOT NULL,
    question TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    FOREIGN KEY (step_id) REFERENCES steps(id)
);

-- Create the options for reading question list questions
CREATE TABLE reading_question_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    value VARCHAR(255) NOT NULL,
    FOREIGN KEY (question_id) REFERENCES reading_questions(id)
);

-- Create the question table for listening questions
CREATE TABLE listening_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    step_id INT NOT NULL,
    before_text TEXT,
    correct_answer_id INT,
    FOREIGN KEY (step_id) REFERENCES steps(id)
);

-- Create the options for listening to questions
CREATE TABLE listening_question_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    value VARCHAR(255) NOT NULL,
    FOREIGN KEY (question_id) REFERENCES listening_questions(id)
);

-- Create a table to store the relationship between exams and steps
CREATE TABLE exam_steps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL,
    step_id INT NOT NULL,
    step_order INT NOT NULL,
    FOREIGN KEY (exam_id) REFERENCES exams(id),
    FOREIGN KEY (step_id) REFERENCES steps(id)
);

