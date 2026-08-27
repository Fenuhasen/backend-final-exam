import { createToken } from "../config/auth";
import { UserRepository } from "../repository/userRepository";

export const AuthService = {


    async login (email: string, password: string) {

        const user = await UserRepository.findUserForLogin(email);

        if (!user) {
            throw new Error("Email ou mot de passe incorrect");
        }

        const status = user.status.toString().toUpperCase();
        if (!(status === "ACTIF" || status === "ACTIVE") || user.password !== password) {
            throw new Error("Email ou mot de passe incorrect");
        }

        const role = user.role.toString().toUpperCase() === "ADMIN" ? "ADMIN" : "ETUDIANT";
        const token = createToken(user.id_user, role);

        return {
            token,
            user: {
                id: user.id_user,
                name: user.name,
                role: role === "ADMIN" ? "admin" : "student"
            }
        };
    }
}