import { NextFunction, Request, Response } from "express";

export function errorHandler(
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    if (res.headersSent) return;

    const message = error instanceof Error ? error.message : "Internal server error";
    let status = 500;

    if (["Invalid answers", "Answers must be an array", "Invalid choices", "Invalid correct choice", "End date must be after start date"].includes(message)) {
        status = 400;
    } else if (message === "Course already exists") {
        status = 409;
    } else if (message === "Exam already taken") {
        status = 409;
    } else if (message.endsWith("not found")) {
        status = 404;
    } else if (error instanceof SyntaxError) {
        status = 400;
    }

    res.status(status).json({ message });
}

export function notFoundHandler(_req: Request, res: Response): void {
    res.status(404).json({ message: "Route not found" });
}
