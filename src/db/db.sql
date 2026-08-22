CREATE TYPE user_role AS ENUM ('ADMIN', 'ETUDIANT');
CREATE TYPE user_status AS ENUM ('ACTIF', 'DESACTIVE');

CREATE TABLE users (
    id_user         SERIAL PRIMARY KEY,
    first_name      TEXT,
    last_name       TEXT,
    email           TEXT,
    password        TEXT,
    role            user_role,
    status          user_status,
    created_at      TIMESTAMP
);

CREATE TABLE courses (
    id_course       SERIAL PRIMARY KEY,
    code            TEXT,
    name            TEXT,
    description     TEXT
);

CREATE TABLE exams (
    id_exam         SERIAL PRIMARY KEY,
    title           TEXT,
    id_course       INTEGER REFERENCES courses(id_course),
    start_date      TIMESTAMP,
    end_date        TIMESTAMP
);

CREATE TABLE questions (
    id_question     SERIAL PRIMARY KEY,
    id_exam         INTEGER REFERENCES exams(id_exam),
    statement       TEXT,
    points          INTEGER
);

CREATE TABLE choices (
    id_choice       SERIAL PRIMARY KEY,
    id_question     INTEGER REFERENCES questions(id_question),
    text            TEXT,
    is_correct      BOOLEAN
);

CREATE TABLE submissions (
    id_submission   SERIAL PRIMARY KEY,
    id_exam         INTEGER REFERENCES exams(id_exam),
    id_student      INTEGER REFERENCES users(id_user),
    submitted_at    TIMESTAMP
);

CREATE TABLE submission_items (
    id_submission_item  SERIAL PRIMARY KEY,
    id_submission       INTEGER REFERENCES submissions(id_submission),
    id_question         INTEGER REFERENCES questions(id_question),
    id_choice           INTEGER REFERENCES choices(id_choice)
);