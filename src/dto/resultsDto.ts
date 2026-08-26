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
    submitted_at:Date
}
