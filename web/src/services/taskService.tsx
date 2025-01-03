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

export const createTask = async (taskData: {
    tarefaTitulo: string;
    tarefaDescricao: string;
    tarefaImportanciaPrioridade: string;
    tarefaPreferenciaTempo: string;
}) => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token JWT não encontrado!');
        }

        const response = await api.post('/tarefa/create', taskData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data; // Retorna a tarefa criada
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || 'Erro ao criar a tarefa'
        );
    }
};

export const deleteTask = async (taskId: number) => {
    try{
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token JWT não encontrado!');
        }

        const response = await api.delete(`/tarefa/delete/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
        // Retorna a tarefa eliminada
    }catch (error: any) {
        throw new Error(
            error.response?.data?.message || 'Erro ao eliminar a tarefa'
        );
    }
}


