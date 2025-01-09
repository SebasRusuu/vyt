import React, { useEffect, useState, useContext } from "react";
import ContainerTaskCompleted from "../ContainerTaskCompleted";
import "../MainLayout/MainLayout.css";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../services/api";

interface Task {
    tarefaId: number;
    tarefaTitulo: string;
    tarefaDescricao: string;
    tarefaDataConclusao: string;
    tarefaPrioridade: number;
}

const setPrioridadeString = (Prioridade: number) => {
    if (Prioridade === 1 || Prioridade === 2) {
        return "Baixo";
    }
    if (Prioridade === 3) {
        return "Médio";
    }
    return "Alto";
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
                const response = await axiosInstance.get("/tarefa/completed", {
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
                            conclusionDate={task.tarefaDataConclusao}
                            Prioridade={task.tarefaPrioridade}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default MainLayoutCompleted;
