import React, { useEffect, useState } from 'react';
import ContainerTask from '../ContainerTask';
import { fetchTasks } from '../../services/taskService';
import './MainLayout.css';
import Filters from "../Filters";

interface Task {
    tarefa_titulo: string;
    tarefa_descricao: string;
    tarefa_criacao_at: string;
    tarefa_prioridade: string;
}

const MainLayout: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const data = await fetchTasks(); // Chama a função do serviço
                setTasks(data);
            } catch (err: any) {
                setError(err.message);
                console.error('Erro ao carregar tarefas:', err);
            } finally {
                setLoading(false);
            }
        };

        loadTasks();
    }, []);

    return (
        <div className="main-layout">
            <div className="header-section">
                <h1 className="title">All Tasks</h1>
                <Filters/>
            </div>
            <div className="tasks-content">
                {loading ? (
                    <p>Carregando tarefas...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : tasks.length === 0 ? (
                    <p>Nenhuma tarefa encontrada.</p>
                ) : (
                    tasks.map((task, index) => (
                        <ContainerTask
                            key={index}
                            title={task.tarefa_titulo}
                            description={task.tarefa_descricao}
                            createdAt={task.tarefa_criacao_at}
                            priority={task.tarefa_prioridade}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default MainLayout;
