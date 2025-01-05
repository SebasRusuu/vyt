import React, { useEffect, useState } from "react";
import ContainerTaskCompleted from "../ContainerTaskCompleted";
import { fetchCompletedTasks } from "../../services/taskService";
import "../MainLayout/MainLayout.css";

interface Task {
    taskId: number;
    title: string;
    description: string;
    createdAt: string;
    importanciaPrioridade: string;
}

const MainLayoutCompleted: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCompletedTasks = async () => {
            try {
                const data = await fetchCompletedTasks();
                const formattedData = data.map((task: any) => ({
                    taskId: task.tarefaId,
                    title: task.tarefaTitulo,
                    description: task.tarefaDescricao,
                    createdAt: task.tarefaCriacaoAt,
                    importanciaPrioridade: task.tarefaImportanciaPrioridade,
                }));
                setTasks(formattedData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadCompletedTasks();
    }, []);

    return (
        <div className="main-layout">
            <div className="header-section">
                <h1 className="title">Tarefas Completadas</h1>
            </div>
            <div className="tasks-content">
                {loading ? (
                    <p>Carregando tarefas completadas...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : tasks.length === 0 ? (
                    <p>Nenhuma tarefa completada.</p>
                ) : (
                    tasks.map((task, index) => (
                        <ContainerTaskCompleted
                            key={index}
                            taskId={task.taskId}
                            title={task.title}
                            description={task.description}
                            createdAt={task.createdAt}
                            importanciaPrioridade={task.importanciaPrioridade}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default MainLayoutCompleted;
