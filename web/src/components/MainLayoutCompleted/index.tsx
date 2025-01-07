import React, { useEffect, useState, useContext } from "react";
import ContainerTaskCompleted from "../ContainerTaskCompleted";
import "../MainLayout/MainLayout.css";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

interface Task {
    tarefaId: number;
    tarefaTitulo: string;
    tarefaDescricao: string;
    tarefaCriacaoAt: string;
    tarefaImportanciaPrioridade: string;
}

const MainLayoutCompleted: React.FC = () => {
    const { token } = useContext(AuthContext);
    const [tasks, setTasks] = useState<Task[]>([]);
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
                const response = await api.get("/tarefa/completed", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = response.data;
                if (data.length === 0) {
                    setTasks([]);
                } else {
                    setTasks(data);
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
                            taskId={task.tarefaId}
                            title={task.tarefaTitulo}
                            description={task.tarefaDescricao}
                            createdAt={task.tarefaCriacaoAt}
                            importanciaPrioridade={task.tarefaImportanciaPrioridade}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default MainLayoutCompleted;
