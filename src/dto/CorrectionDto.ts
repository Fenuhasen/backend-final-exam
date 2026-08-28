export interface CorrectionItem {
    question_id: number,
    statement: string,
    points: number,
    student_choice_id: number | null,
    correct_choice_id: number,
    is_correct: boolean
}

export interface Correction {
    id_exam: number,
    id_student: number,
    answers: CorrectionItem[]
}