import api from './api';

interface RegisterData {
    user_name: string;
    email: string;
    password_hash: string;
}

export const registerUser = async (data: RegisterData): Promise<{ token: string }> => {
    try {
        const response = await api.post('/user/register', data);
        return response.data; // Token retornado pela API
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error during registration');
    }
};

interface LoginData {
    email: string;
    password_hash: string;
}

export const loginUser = async (data: LoginData): Promise<{ token: string }> => {
    try {
        const response = await api.post('/user/login', data);
        return response.data; // Token retornado pelo backend
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error during login');
    }
};
