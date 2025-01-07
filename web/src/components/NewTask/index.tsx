import React, { useState } from "react";
import axios from "axios";
import "./NewTask.css";

interface NewTaskProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewTask: React.FC<NewTaskProps> = ({ isOpen, onClose }) => {
    const [taskData, setTaskData] = useState({
        tarefaTitulo: "",
        tarefaDescricao: "",
        tarefaImportancia: "Pouco Importante", // Valor padrão
        tarefaPrioridade: "Não Urgente", // Valor padrão
        tarefaPreferenciaTempo: "00:30:00", // Valor padrão
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setTaskData({
            ...taskData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            // Determinar a combinação de Importância & Prioridade
            let importanciaPrioridade = "Baixo";
            if (
                taskData.tarefaImportancia === "Importante" &&
                taskData.tarefaPrioridade === "Urgente"
            ) {
                importanciaPrioridade = "Alto";
            } else if (
                taskData.tarefaImportancia === "Importante" ||
                taskData.tarefaPrioridade === "Urgente"
            ) {
                importanciaPrioridade = "Médio";
            }

            // Realizar o pedido POST para criar a tarefa
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token não encontrado. Por favor, faça login novamente.");
            }

            await axios.post(
                "http://localhost:8080/api/tarefa/create",
                {
                    tarefaTitulo: taskData.tarefaTitulo,
                    tarefaDescricao: taskData.tarefaDescricao,
                    tarefaImportanciaPrioridade: importanciaPrioridade,
                    tarefaPreferenciaTempo: taskData.tarefaPreferenciaTempo,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            onClose(); // Fecha o modal
            window.location.reload(); // Recarrega a página para atualizar a lista de tarefas
        } catch (err: any) {
            console.error("Erro ao criar tarefa:", err);
            setError(err.response?.data?.message || "Erro ao criar tarefa.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup">
                <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={onClose}
                    style={{ float: "right" }}
                ></button>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="tarefaTitulo" className="form-label">
                            Título
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="tarefaTitulo"
                            name="tarefaTitulo"
                            value={taskData.tarefaTitulo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tarefaDescricao" className="form-label">
                            Descrição
                        </label>
                        <textarea
                            className="form-control"
                            id="tarefaDescricao"
                            name="tarefaDescricao"
                            rows={3}
                            value={taskData.tarefaDescricao}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tarefaImportancia" className="form-label">
                            Importância
                        </label>
                        <select
                            className="form-select"
                            id="tarefaImportancia"
                            name="tarefaImportancia"
                            value={taskData.tarefaImportancia}
                            onChange={handleChange}
                        >
                            <option value="Pouco Importante">Pouco Importante</option>
                            <option value="Importante">Importante</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tarefaPrioridade" className="form-label">
                            Prioridade
                        </label>
                        <select
                            className="form-select"
                            id="tarefaPrioridade"
                            name="tarefaPrioridade"
                            value={taskData.tarefaPrioridade}
                            onChange={handleChange}
                        >
                            <option value="Não Urgente">Não Urgente</option>
                            <option value="Urgente">Urgente</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tarefaPreferenciaTempo" className="form-label">
                            Duração
                        </label>
                        <select
                            className="form-select"
                            id="tarefaPreferenciaTempo"
                            name="tarefaPreferenciaTempo"
                            value={taskData.tarefaPreferenciaTempo}
                            onChange={handleChange}
                        >
                            <option value="00:30:00">30 minutos</option>
                            <option value="01:00:00">1 hora</option>
                            <option value="01:30:00">1h 30min</option>
                            <option value="02:00:00">2 horas</option>
                        </select>
                    </div>
                    <button type="submit" className="submit-button">
                        Criar Tarefa
                    </button>
                </form>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        </div>
    );
};

export default NewTask;
