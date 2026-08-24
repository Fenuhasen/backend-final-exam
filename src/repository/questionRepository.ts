import { PoolClient } from "pg";
import pool from "../config/db"
import {
    Question,
    Choice,
    QuestionWithChoice
} from "../model/exam";
import { CreateQuestionInput} from "../dto/examDto";

function mapQuestion(row: any): Question {
    return {
        questionId: row.id_question,
        examId: row.id_exam,
        statement: row.statement,
        points: row.points,
        position: row.position,
    };
}

function mapChoice(row: any): Choice {
    return {
        choiceId: row.id_choice,
        questionId: row.id_question,
        text: row.text,
        isCorrect: row.is_correct,
    };
}

export const questionRepositorie = {
    async findByExamWithChoices(examId: number): Promise<QuestionWithChoice[]> {
        const questionsResult = await pool.query(
            `SELECT * FROM questions WHERE id_exam = $1 ORDER BY position ASC`,
            [examId]
        );
        const questions = questionsResult.rows.map(mapQuestion);
        if (questions.length === 0) return [];

        const choicesResult = await pool.query(
            `SELECT * FROM choices WHERE id_question = ANY($1::int[])`,
            [questions.map((q) => q.questionId)]
        );
        const choices = choicesResult.rows.map(mapChoice);

        return questions.map((q) => ({
            ...q,
            choice: choices.filter((c) => c.questionId === q.questionId),
        }));
    },

    async findById(questionId: number): Promise<Question | null> {
        const result = await pool.query(`SELECT * FROM questions WHERE id_question = $1`, [questionId]);
        return result.rows[0] ? mapQuestion(result.rows[0]) : null;
    },

    async createWithChoices(
        examId: number,
        data: CreateQuestionInput,
        position: number
    ): Promise<QuestionWithChoice> {
        const client: PoolClient = await pool.connect();
        try {
            await client.query("BEGIN");

            const questionResult = await client.query(
                `INSERT INTO questions (id_exam, statement, points, position)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [examId, data.statement, data.points, position]
            );
            const question = mapQuestion(questionResult.rows[0]);

            const choice: Choice[] = [];
            for (const c of data.choices) {
                const choiceResult = await client.query(
                    `INSERT INTO choices (id_question, text, is_correct)
                     VALUES ($1, $2, $3)
                     RETURNING *`,
                    [question.questionId, c.text, c.isCorrect]
                );
                choice.push(mapChoice(choiceResult.rows[0]));
            }

            await client.query("COMMIT");
            return { ...question, choice };
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    },

    async updateWithChoices(
        questionId: number,
        data: CreateQuestionInput
    ): Promise<QuestionWithChoice | null> {
        const client: PoolClient = await pool.connect();
        try {
            await client.query("BEGIN");

            const questionResult = await client.query(
                `UPDATE questions SET statement = $2, points = $3 WHERE id_question = $1 RETURNING *`,
                [questionId, data.statement, data.points]
            );
            if (questionResult.rows.length === 0) {
                await client.query("ROLLBACK");
                return null;
            }
            const question = mapQuestion(questionResult.rows[0]);

            await client.query(`DELETE FROM choices WHERE id_question = $1`, [questionId]);

            const choice: Choice[] = [];
            for (const c of data.choices) {
                const choiceResult = await client.query(
                    `INSERT INTO choices (id_question, text, is_correct)
                     VALUES ($1, $2, $3)
                     RETURNING *`,
                    [questionId, c.text, c.isCorrect]
                );
                choice.push(mapChoice(choiceResult.rows[0]));
            }

            await client.query("COMMIT");
            return { ...question, choice };
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
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
