import React, { useEffect, useState } from "react";
import ContainerTaskCompleted from "../ContainerTaskCompleted";
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
