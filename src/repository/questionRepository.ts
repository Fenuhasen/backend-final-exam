import pool from "../config/db";
import { Choice, CreateQuestionInput, Question } from "../dto/examDto";

function mapQuestion(row: any): Question {
    return {
        id: row.id_question,
        exam_id: row.id_exam,
        statement: row.statement,
        points: row.points,
        position: row.position,
        choices: []
    };
}

function mapChoice(row: any): Choice {
    return {
        id: row.id_choice,
        text: row.text,
        is_correct: row.is_correct
    };
}

export const questionRepository = {

    async findByExamWithChoices(
        examId: number
    ): Promise<Question[]> {

        const questionsResult = await pool.query(
            `
            SELECT *
            FROM questions
            WHERE id_exam = $1
            ORDER BY position ASC
            `,
            [examId]
        );

        const questions = questionsResult.rows.map(mapQuestion);

        if (questions.length === 0) {
            return [];
        }

        const questionIds = questions.map(q => q.id);

        const choicesResult = await pool.query(
            `
            SELECT *
            FROM choices
            WHERE id_question = ANY($1::int[])
            `,
            [questionIds]
        );

        const choices = choicesResult.rows.map(row => ({
            questionId: row.id_question,
            choice: mapChoice(row)
        }));

        return questions.map(question => ({
            ...question,

            choices: choices
                .filter(c => c.questionId === question.id)
                .map(c => c.choice)
        }));
    },


    async findByExam(examId: number): Promise<Question[]> {
        const result = await pool.query(
            `SELECT * FROM questions WHERE id_exam = $1 ORDER BY position ASC`,
            [examId]
        );
        return result.rows.map(mapQuestion);
    },

    async findById(questionId: number): Promise<Question | null> {
        const result = await pool.query(`SELECT * FROM questions WHERE id_question = $1`, [questionId]);
        return result.rows[0] ? mapQuestion(result.rows[0]) : null;
    },

    async createWithChoices(
        examId: number,
        data: CreateQuestionInput,
        position: number
    ): Promise<Question> {

        const questionResult = await pool.query(
            `
        INSERT INTO questions (id_exam, statement, points, position)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
            [examId, data.statement, data.points, position]
        );

        const question = mapQuestion(questionResult.rows[0]);

        const choices: Choice[] = [];

        for (const c of data.choices) {

            const choiceResult = await pool.query(
                `
            INSERT INTO choices (id_question, text, is_correct)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
                [question.id, c.text, c.is_correct]
            );

            choices.push(mapChoice(choiceResult.rows[0]));
        }

        return {
            ...question,
            choices
        };
    },
    async delete(questionId: number): Promise<void> {
        await pool.query(`DELETE FROM questions WHERE id_question = $1`, [questionId]);
    },

    async countByExam(examId: number): Promise<number> {
        const result = await pool.query(
            `SELECT id_question FROM questions WHERE id_exam = $1`,
            [examId]
        );
        return result.rows.length;
    },
};