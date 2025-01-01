import React, { useEffect, useState } from 'react';
import ContainerTask from '../ContainerTask';
import { fetchTasks } from '../../services/taskService';
import './MainLayout.css';
import Filters from "../Filters";

interface Task {
    title: string;
    description: string;
    createdAt: string;
    important: number;
}

const MainLayout: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const data = await fetchTasks();
                const formattedData = data.map((task: any) => ({
                    title: task.tarefaTitulo,
                    description: task.tarefaDescricao,
                    createdAt: task.tarefaCriacaoAt,
                    important: task.tarefaImportancia,
                }));
                setTasks(formattedData);
            } catch (err: any) {
                setError(err.message);
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
                            title={task.title}
                            description={task.description}
                            createdAt={task.createdAt}
                            important={task.important}
                        />
                    )))}
            </div>
        </div>
    );
};

export default MainLayout;
