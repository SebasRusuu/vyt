import api from './api';

interface RegisterData {
    user_name: string;
    email: string;
    password_hash: string;
}

export const registerUser = async (data: RegisterData): Promise<void> => {
    try {
        await api.post('/user/register', data); // Faz o registro
        console.log('Usuário registrado com sucesso');
    } catch (error: any) {
        throw new Error(error.response?.data || 'Erro durante o registro');
    }
};


interface LoginData {
    email: string;
    password_hash: string;
}

export const loginUser = async (data: LoginData): Promise<{ token: string }> => {
    try {
        const response = await api.post('/user/login', data);
        const token = response.data.token; // Token retornado pelo backend
        localStorage.setItem('authToken', token); // Armazena o token no LocalStorage
        console.log("Token armazenado com sucesso após login:", token);
        return { token }; // Retorna o token
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Erro durante o login');
    }
};
