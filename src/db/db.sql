CREATE TABLE users (
    id_user     SERIAL PRIMARY KEY,
    first_name  TEXT,
    last_name   TEXT,
    mail        TEXT,
    password    TEXT,
    role        TEXT,
    status      TEXT,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE courses (
    id_course   SERIAL PRIMARY KEY,
    code        TEXT,
    name        TEXT,
    description TEXT
);

CREATE TABLE exams (
    id_exam     SERIAL PRIMARY KEY,
    title       TEXT,
    description TEXT,
    id_course   INTEGER REFERENCES courses(id_course),
    start_date  TIMESTAMPTZ,
    end_date    TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE questions (
    id_question SERIAL PRIMARY KEY,
    id_exam     INTEGER REFERENCES exams(id_exam) ON DELETE CASCADE,
    statement   TEXT,
    points      INTEGER,
    position    INTEGER
);

CREATE TABLE choices (
    id_choice   SERIAL PRIMARY KEY,
    id_question INTEGER REFERENCES questions(id_question) ON DELETE CASCADE,
    text        TEXT,
    is_correct  BOOLEAN
);

CREATE TABLE submissions (
    id_submission SERIAL PRIMARY KEY,
    id_exam       INTEGER REFERENCES exams(id_exam),
    id_student    INTEGER REFERENCES users(id_user),
    score         INTEGER,
    submitted_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE submission_items (
    id_submission_item SERIAL PRIMARY KEY,
    id_submission      INTEGER REFERENCES submissions(id_submission) ON DELETE CASCADE,
    id_question        INTEGER REFERENCES questions(id_question),
    id_choice          INTEGER REFERENCES choices(id_choice)
);
```