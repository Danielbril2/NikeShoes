import axios from 'axios';

//const AUTH_BASE_URL = 'http://localhost:8080/auth';
const AUTH_BASE_URL = "https://nikewarehouseshoemanager.onrender.com/auth"

interface AuthResponse {
    token: string;
    expirationTime: number;
}

interface RegisterResponse {
    message: string;
    success?: boolean;
}

export class AuthAPI {
    private static token: string | null = null;

    static async login(workerCode: string, password: string): Promise<AuthResponse> {
        const response = await axios.post<AuthResponse>(`${AUTH_BASE_URL}/login`, {
            workerCode,
            password
        });

        this.token = response.data.token;

        // Set the token in axios defaults
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        
        // Store token in localStorage for auto-login
        localStorage.setItem('token', this.token);

        return response.data;
    }

    static async register(workerCode: string, password: string): Promise<RegisterResponse> {
        try {
            // Validate worker code format
            if (!workerCode.startsWith('52500')) {
                return {
                    message: 'קוד עובד חייב להתחיל ב-52500',
                    success: false
                };
            }

            const response = await axios.post<RegisterResponse>(`${AUTH_BASE_URL}/register`, {
                workerCode,
                password
            });

            return {
                ...response.data,
                success: true
            };
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // Handle specific error from server
                if (error.response.status === 409) {
                    return {
                        message: 'קוד עובד כבר קיים במערכת',
                        success: false
                    };
                }
                return {
                    message: error.response.data.message || 'אירעה שגיאה בהרשמה',
                    success: false
                };
            }
            return {
                message: 'אירעה שגיאה בהרשמה',
                success: false
            };
        }
    }

    static async verifyToken(token: string): Promise<boolean> {
        try {
            // Set the token to verify
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Make a request to a protected endpoint to verify the token
            await axios.get(`${AUTH_BASE_URL.replace('/auth', '/main')}/getAllShoes`);
            
            // If successful, set the token
            this.token = token;
            return true;
        } catch (error) {
            // Token is invalid
            return false;
        }
    }

    static getToken() {
        if (!this.token) {
            // Try to get from localStorage if not already set
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                this.token = storedToken;
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
            }
        }
        return this.token;
    }

    static logout() {
        this.token = null;
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    }
}