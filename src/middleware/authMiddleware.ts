import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../config/auth";

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: number;
        role: string;
    };
}

export function authenticate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }

    try {
        const payload = verifyToken(token);
        if (typeof payload !== "object" || payload === null || !("userId" in payload) || !("role" in payload)) {
            res.status(401).json({ message: "Invalid or expired token" });
            return;
        }

        req.user = {
            userId: Number(payload.userId),
            role: String(payload.role).toUpperCase()
        };
        next();
    } catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}

export function requireRole(...roles: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        const role = req.user?.role;
        if (!role || !roles.map((item) => item.toUpperCase()).includes(role)) {
            res.status(403).json({ message: "Insufficient permissions" });
            return;
        }
        next();
    };
}
