import React, { useEffect, useState } from "react";
import ContainerTask from "../ContainerTask";
import "./MainLayout.css";
import Filters from "../Filters";

interface Task {
    taskId: number;
    title: string;
    description: string;
    createdAt: string;
    importanciaPrioridade: string;
}

const MainLayout: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);



    const handleFilterChange = (filter: string) => {
        if (filter === "Todos") {
            setFilteredTasks(tasks);
        } else {
            setFilteredTasks(
                tasks.filter((task) => task.importanciaPrioridade === filter)
            );
        }
    };

    return (
        <div className="main-layout">
            <div className="header-section">
                <h1 className="title">Tarefas</h1>
                {isAuthenticated && <Filters onFilterChange={handleFilterChange} />}
            </div>
            <div className="tasks-content">
                {loading ? (
                    <p>Carregando tarefas...</p>
                ) : !isAuthenticated ? (
                    <p>Faça Login para ver as suas Tarefas.</p>
                ) : tasks.length === 0 ? (
                    <p>Crie uma Tarefa nova.</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    filteredTasks.map((task, index) => (
                        <ContainerTask
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

export default MainLayout;
