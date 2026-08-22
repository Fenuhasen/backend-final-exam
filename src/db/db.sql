CREATE TYPE user_role AS ENUM ('ADMIN', 'ETUDIANT');
CREATE TYPE user_status AS ENUM ('ACTIF', 'DESACTIVE');

CREATE TABLE users (
    id_user         SERIAL PRIMARY KEY,
    first_name      TEXT NOT NULL,
    last_name       TEXT NOT NULL,
    mail            TEXT NOT NULL UNIQUE,
    password        TEXT NOT NULL,
    role            user_role NOT NULL,
    status          user_status NOT NULL DEFAULT 'ACTIF',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE courses (
    id_course       SERIAL PRIMARY KEY,
    code            TEXT NOT NULL UNIQUE,
    name            TEXT NOT NULL,
    description     TEXT DEFAULT ''
);

CREATE TABLE exams (
    id_exam         SERIAL PRIMARY KEY,
    title           TEXT NOT NULL,
    description     TEXT DEFAULT '',
    id_course       INTEGER NOT NULL REFERENCES courses(id_course),
    start_date      TIMESTAMPTZ NOT NULL,
    end_date        TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
                    CONSTRAINT exam_window_valid CHECK (end_date > start_date)
);

CREATE TABLE questions (
    id_question     SERIAL PRIMARY KEY,
    id_exam         INTEGER NOT NULL REFERENCES exams(id_exam) ON DELETE CASCADE,
    statement       TEXT NOT NULL,
    points          INTEGER NOT NULL CHECK (points > 0),
    position        INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE choices (
    id_choice       SERIAL PRIMARY KEY,
    id_question     INTEGER NOT NULL REFERENCES questions(id_question) ON DELETE CASCADE,
    text            TEXT NOT NULL,
    is_correct      BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE submissions (
    id_submission   SERIAL PRIMARY KEY,
    id_exam         INTEGER NOT NULL REFERENCES exams(id_exam),
    id_student      INTEGER NOT NULL REFERENCES users(id_user),
    score           INTEGER NOT NULL DEFAULT 0,
    submitted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
                    CONSTRAINT submissions_exam_student_unique UNIQUE (id_exam, id_student)
);

CREATE TABLE submission_items (
    id_submission_item  SERIAL PRIMARY KEY,
    id_submission        INTEGER NOT NULL REFERENCES submissions(id_submission) ON DELETE CASCADE,
    id_question          INTEGER NOT NULL REFERENCES questions(id_question),
    id_choice            INTEGER REFERENCES choices(id_choice),
                         CONSTRAINT submission_items_unique UNIQUE (id_submission, id_question)
);

CREATE INDEX idx_exams_id_course ON exams(id_course);
CREATE INDEX idx_questions_id_exam ON questions(id_exam);
CREATE INDEX idx_choices_id_question ON choices(id_question);
CREATE INDEX idx_submissions_id_exam ON submissions(id_exam);
CREATE INDEX idx_submission_items_id_submission ON submission_items(id_submission);