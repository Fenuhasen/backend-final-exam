export enum UserRole {
    ADMIN = "ADMIN",
    ETUDIANT = "ETUDIANT"
}

export enum UserStatus {
    ACTIF = "ACTIF",
    DESACTIVE = "DESACTIVE"
}

export interface User {
    id_user: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: UserRole;
    status: UserStatus;
    created_at: Date;
}
