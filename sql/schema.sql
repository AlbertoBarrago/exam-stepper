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
    audio_url VARCHAR(255),
    questions JSONB -- New column to store questions and options as JSONB
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