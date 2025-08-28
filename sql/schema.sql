-- Create the exam table
CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    final_score DECIMAL(5, 2),
    cefr_level JSONB,
    step_scores JSONB,
    FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Add or alter cefr_level column in exams table to JSONB
ALTER TABLE exams ALTER COLUMN cefr_level TYPE JSONB USING cefr_level::jsonb;

-- Add step_scores column to exams table if it doesn't exist
ALTER TABLE exams ADD COLUMN step_scores JSONB;

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
    audio_url VARCHAR(255),
    questions JSONB -- New column to store questions and options as JSONB
);

-- Create a table to store the relationship between exams and steps
CREATE TABLE exam_steps (
    id SERIAL PRIMARY KEY,
    exam_id INT NOT NULL,
    step_id INT NOT NULL,
    step_order INT NOT NULL,
    raw_score numeric,
    max_score numeric,
    cefr_level text,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);