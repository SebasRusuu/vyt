import api from './api';

export const fetchTasks = async (): Promise<any[]> => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token JWT não encontrado!');
        }

        const userId = JSON.parse(atob(token.split('.')[1])).user_id; // Decodificar o token para obter o ID do utilizador
        const response = await api.get(`/tarefa/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data; // Retorna os dados das tarefas
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || 'Erro ao buscar tarefas'
        );
    }
};
