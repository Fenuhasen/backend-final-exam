export interface Result {
    exam: {
        id: number,
        title: string
    },
    total_points: number,
    average: number,
    attempt_count: number,
    results: Result_item[]
}

export interface Result_item {
    student_id: number,
    name: string,
    score: number,
    submitted_at: Date
}

export interface myResult {
    exam_id: number,
    title: string,
    course_code: string,
    score: number,
    total_points: number,
    submitted_at: Date
}