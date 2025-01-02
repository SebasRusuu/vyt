import React, { useEffect, useState } from "react";
import ContainerTask from "../ContainerTask";
import { fetchTasks } from "../../services/taskService";
import "./MainLayout.css";
import Filters from "../Filters";

interface Task {
    title: string;
    description: string;
    createdAt: string;
    importanciaPrioridade: string; // Campo ajustado para refletir a nova estrutura
}

const MainLayout: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]); // Tarefas filtradas
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
                    importanciaPrioridade: task.tarefaImportanciaPrioridade,
                }));
                setTasks(formattedData);
                setFilteredTasks(formattedData); // Inicializa com todas as tarefas
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadTasks();
    }, []);

    const handleFilterChange = (filter: string) => {
        if (filter === "Todos") {
            setFilteredTasks(tasks); // Mostra todas as tarefas
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
                <Filters onFilterChange={handleFilterChange} />
            </div>
            <div className="tasks-content">
                {loading ? (
                    <p>Carregando tarefas...</p>
                ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                ) : filteredTasks.length === 0 ? (
                    <p>Nenhuma tarefa encontrada.</p>
                ) : (
                    filteredTasks.map((task, index) => (
                        <ContainerTask
                            key={index}
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
