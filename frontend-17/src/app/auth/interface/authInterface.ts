export interface AuthResponse {
    ok: boolean;
    _id?: string;
    username?: string;
    email?: string;
    role?: string;
    token?: string;
    msg?: string;
    photo?: string;
    birthDate?: Date;  // Add this if birthDate is expected in the response
    sex?: string;      // Add this if sex is expected in the response
}

export interface User {
    _id: string;
    email: string;
    role: string;
    username: string;
    photo: string;
    birthDate?: Date;  // Hacer opcional si puede ser undefined
    sex?: string;
}