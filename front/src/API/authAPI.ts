import axios from 'axios';

const AUTH_BASE_URL = 'http://localhost:8080/auth';

interface AuthResponse {
    token: string;
    expirationTime: number;
}

export class AuthAPI {
    private static token: string | null = null;

    static async login() {
        const response = await axios.post<AuthResponse>(`${AUTH_BASE_URL}/login`, {
            workerCode: "52500219",
            password: "52500219"
        });

        this.token = response.data.token;

        // Set the token in axios defaults
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        return response.data;
    }

    static getToken() {
        return this.token;
    }
}