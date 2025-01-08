import React, { useEffect, useState, useContext } from "react";
import ContainerTask from "../ContainerTask";
import "./MainLayout.css";
import Filters from "../Filters";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../services/api";

interface Task {
    tarefaId: number;
    tarefaTitulo: string;
    tarefaDescricao: string;
    tarefaDataConclusao: string;
    tarefaImportanciaPrioridade: string;
}

const MainLayout: React.FC = () => {
    const { token, user } = useContext(AuthContext); // Usa o AuthContext para autenticação
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTasks = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // Substituição de axios por api
                const response = await axiosInstance.get("/tarefa/incomplete", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = response.data;
                if (data.length === 0) {
                    setTasks([]);
                    setFilteredTasks([]);
                } else {
                    setTasks(data);
                    setFilteredTasks(data);
                }
            } catch (err: any) {
                console.error("Erro ao carregar tarefas:", err.message);
                setError("Erro ao carregar tarefas. Tente novamente.");
            } finally {
                setLoading(false);
            }
        };

        loadTasks();
    }, [token]);

    const handleFilterChange = (filter: string) => {
        if (filter === "Todos") {
            setFilteredTasks(tasks);
        } else {
            setFilteredTasks(
                tasks.filter((task) => task.tarefaImportanciaPrioridade === filter)
            );
        }
    };

    return (
        <div className="main-layout">
            <div className="header-section">
                <h1 className="title">Tarefas</h1>
                {user && <Filters onFilterChange={handleFilterChange} />}
            </div>
            <div className="tasks-content">
                {loading ? (
                    <p>Carregando tarefas...</p>
                ) : !user ? (
                    <p>Faça Login para ver as suas Tarefas.</p>
                ) : tasks.length === 0 ? (
                    <p>Crie uma Tarefa nova.</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    filteredTasks.map((task, index) => (
                        <ContainerTask
                            key={index}
                            taskId={task.tarefaId}
                            title={task.tarefaTitulo}
                            description={task.tarefaDescricao}
                            conclusionDate={task.tarefaDataConclusao} // Atualizado para usar a nova coluna
                            importanciaPrioridade={task.tarefaImportanciaPrioridade}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default MainLayout;