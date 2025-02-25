import axios from 'axios';
import { AuthAPI } from './AuthAPI';

// Types
export type ShoeType = 'Man' | 'Woman' | 'Children';

export interface Shoe {
    code: string;
    loc: number;
    name: string;
    image: ArrayBuffer;
}

export interface ShoeDTO {
    code: string;
    name?: string;
    loc?: number;
}

// API Base URL
const BASE_URL = 'http://localhost:8080/main';

// API Endpoints
const ENDPOINTS = {
    getShoeByCode: (code: string) => `${BASE_URL}/getShoe/code/${code}`,
    getShoesByType: (type: ShoeType) => `${BASE_URL}/getShoe/type/${type}`,
    getShoesByLocation: (location: number) => `${BASE_URL}/getShoe/location/${location}`,
    deleteShoe: (code: string) => `${BASE_URL}/deleteShoe/${code}`,
    updateName: `${BASE_URL}/updateShoe/updateName`,
    updateLocation: `${BASE_URL}/updateShoe/updateLoc`,
    addShoe: `${BASE_URL}/updateShoe/addShoe`,
    getAllShoes: `${BASE_URL}/getAllShoes`,
};

// Error handling
const handleApiError = (error: any): never => {
    if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'An error occurred while fetching data');
    }
    throw error;
};

// API Class
export class ShoeAPI {
    // Get shoes by code
    static async getShoeByCode(code: string): Promise<Shoe[]> {
        try {
            const response = await axios.get(ENDPOINTS.getShoeByCode(code), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AuthAPI.getToken()}`
                }
            });

            // Based on the backend implementation, the response should be an array of shoes
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw handleApiError(error);
        }
    }

    // Get shoes by type
    static async getShoesByType(type: ShoeType): Promise<Shoe[]> {
        try {
            const token = AuthAPI.getToken();
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await axios.get(ENDPOINTS.getShoesByType(type), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Get shoes by type error:', error);
            throw handleApiError(error);
        }
    }

    // Get shoes by type
        static async getShoesByLocation(location: number): Promise<Shoe[]> {
            try {
                const token = AuthAPI.getToken();
                if (!token) {
                    throw new Error('No authentication token available');
                }

                const response = await axios.get(ENDPOINTS.getShoesByLocation(location), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                return response.data;
            } catch (error) {
                console.error('Get shoes by type error:', error);
                throw handleApiError(error);
            }
        }

    // Update shoe name
    static async updateShoeName(shoeData: ShoeDTO): Promise<boolean> {
        try {
            await axios.post(ENDPOINTS.updateName, shoeData);
            return true;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    // Update shoe location
    static async updateShoeLocation(shoeData: ShoeDTO): Promise<boolean> {
        try {
            await axios.post(ENDPOINTS.updateLocation, shoeData);
            return true;
        } catch (error) {
            throw handleApiError(error);
        }
    }

    // Add new shoe
    static async addShoe(shoeData: Shoe): Promise<boolean> {
        try {
            const token = AuthAPI.getToken();
            if (!token) {
                throw new Error('No authentication token available');
            }

            // Convert ArrayBuffer to base64 string more efficiently
            const base64String = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    // Remove the "data:*/*;base64," prefix
                    resolve(result.split(',')[1]);
                };
                reader.readAsDataURL(new Blob([shoeData.image]));
            });

            const payload = {
                code: shoeData.code,
                name: shoeData.name,
                loc: shoeData.loc,
                type: shoeData.type,
                image: base64String
            };

            await axios.post(ENDPOINTS.addShoe, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return true;
        } catch (error) {
            console.error('Add shoe error:', error);
            throw handleApiError(error);
        }
    }

    // Update shoe
    static async updateShoe(shoeData: ShoeDTO): Promise<void> {
        try {
            if (shoeData.name) {
                await this.updateShoeName({
                    code: shoeData.code,
                    name: shoeData.name
                });
            }

            if (shoeData.loc !== undefined) {
                await this.updateShoeLocation({
                    code: shoeData.code,
                    loc: shoeData.loc
                });
            }
        } catch (error) {
            throw handleApiError(error);
        }
    }

    // Utility method to get image URL from shoe's image data
    static getImageUrl(imageData: ArrayBuffer): string {
        const blob = new Blob([imageData], { type: 'image/jpeg' });
        return URL.createObjectURL(blob);
    }

    static async getAllShoes(): Promise<Shoe[]> {
        try {
            const token = AuthAPI.getToken();
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await axios.get(ENDPOINTS.getAllShoes, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Get all shoes error:', error);
            throw handleApiError(error);
        }
    }

    static async deleteShoe(code: string): Promise<boolean> {
        try {
            const token = AuthAPI.getToken();
            if (!token) {
                throw new Error('No authentication token available');
            }

            await axios.delete(ENDPOINTS.deleteShoe(code), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            return true;
        } catch (error) {
            console.error('Delete shoe error:', error);
            throw handleApiError(error);
        }
    }
}