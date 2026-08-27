import { Request, Response } from "express";
import { AuthService } from "../service/authService";


export async function login(req: Request, res: Response) {

    try {

        const { email, password } = req.body;

        const result = await AuthService.login(email, password);

        res.status(200).json({
            token: result.token,
            user: result.user
        });

    } catch (error) {

        res.status(401).json({
            message: "Email ou mot de passe incorrect"
        });

    }
}