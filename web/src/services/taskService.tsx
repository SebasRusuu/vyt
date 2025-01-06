import api from './api';

export const fetchCompletedTasks = async (): Promise<any[]> => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token JWT não encontrado!');
        }

        const userId = JSON.parse(atob(token.split('.')[1])).user_id;
        const response = await api.get(`/tarefa/completed/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            return [];
        }
        throw new Error(
            error.response?.data?.message || 'Erro ao buscar tarefas completadas'
        );
    }
};


export const fetchIncompletedTasks = async (): Promise<any[]> => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token JWT não encontrado!');
        }

        const userId = JSON.parse(atob(token.split('.')[1])).user_id; // Decodificar o token para obter o ID do utilizador
        const response = await api.get(`/tarefa/incomplete/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data; // Retorna os dados das tarefas
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || 'Erro ao buscar tarefas'
        );
    }
};

export const markTaskAsCompleted = async (taskId: number): Promise<void> => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token JWT não encontrado!');
        }

        await api.put(`/tarefa/complete/${taskId}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || 'Erro ao marcar a tarefa como completada'
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


export const getTaskById = async (taskId: number): Promise<any> => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token JWT não encontrado!');
        }

        const response = await api.get(`/tarefa/id/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data; // Retorna os dados da tarefa
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || 'Erro ao buscar a tarefa'
        );
    }
};

export const updateTask = async (taskId: number, updatedTask: any): Promise<any> => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token JWT não encontrado!');
        }

        const response = await api.put('/tarefa/update', updatedTask, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data; // Retorna a tarefa atualizada
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || 'Erro ao atualizar a tarefa'
        );
    }
};


