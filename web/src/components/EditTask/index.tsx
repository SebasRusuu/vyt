import React, { useState, useEffect } from "react";
import "./EditTask.css"; // Estilos específicos do componente
import { getTaskById, editTask } from "../../services/taskService"; // Serviços para buscar e editar tarefas

interface EditTaskProps {
    taskId: number; // ID da tarefa a ser editada
    onClose: () => void; // Função para fechar o pop-up
}

const EditTask: React.FC<EditTaskProps> = ({ taskId, onClose }) => {
    const [formData, setFormData] = useState({
        tarefaTitulo: "",
        tarefaDescricao: "",
        tarefaImportancia: "Pouco Importante",
        tarefaPrioridade: "Não Urgente",
        tarefaPreferenciaTempo: "00:30:00",
    });
    const [error, setError] = useState<string | null>(null);

    // Carrega os dados da tarefa ao abrir o pop-up
    useEffect(() => {
        const fetchTask = async () => {
            try {
                const data = await getTaskById(taskId); // Busca os dados da tarefa pelo ID
                setFormData({
                    tarefaTitulo: data.tarefaTitulo || "",
                    tarefaDescricao: data.tarefaDescricao || "",
                    tarefaImportancia: data.tarefaImportanciaPrioridade.includes("Importante")
                        ? "Importante"
                        : "Pouco Importante",
                    tarefaPrioridade: data.tarefaImportanciaPrioridade.includes("Urgente")
                        ? "Urgente"
                        : "Não Urgente",
                    tarefaPreferenciaTempo: data.tarefaPreferenciaTempo || "00:30:00",
                });
            } catch (error) {
                setError("Erro ao carregar a tarefa.");
            }
        };

        fetchTask();
    }, [taskId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            let importanciaPrioridade = "Baixo";
            if (
                formData.tarefaImportancia === "Importante" &&
                formData.tarefaPrioridade === "Urgente"
            ) {
                importanciaPrioridade = "Alto";
            } else if (
                formData.tarefaImportancia === "Importante" ||
                formData.tarefaPrioridade === "Urgente"
            ) {
                importanciaPrioridade = "Médio";
            }

            await editTask(taskId, {
                tarefaTitulo: formData.tarefaTitulo,
                tarefaDescricao: formData.tarefaDescricao,
                tarefaImportanciaPrioridade: importanciaPrioridade,
                tarefaPreferenciaTempo: formData.tarefaPreferenciaTempo,
            });

            onClose(); // Fecha o pop-up
        } catch (err: any) {
            setError("Erro ao atualizar a tarefa.");
        }
    };

    return (
        <div className="edit-task-overlay">
            <div className="edit-task-popup">
                <button className="edit-task-close-btn" onClick={onClose}>
                    &times;
                </button>
                <form onSubmit={handleSubmit}>
                    <h2>Editar Tarefa</h2>
                    {error && <p className="edit-task-error">{error}</p>}
                    <div className="edit-task-field">
                        <label htmlFor="tarefaTitulo">Título</label>
                        <input
                            type="text"
                            id="tarefaTitulo"
                            name="tarefaTitulo"
                            value={formData.tarefaTitulo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="edit-task-field">
                        <label htmlFor="tarefaDescricao">Descrição</label>
                        <textarea
                            id="tarefaDescricao"
                            name="tarefaDescricao"
                            rows={3}
                            value={formData.tarefaDescricao}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <div className="edit-task-field">
                        <label htmlFor="tarefaImportancia">Importância</label>
                        <select
                            id="tarefaImportancia"
                            name="tarefaImportancia"
                            value={formData.tarefaImportancia}
                            onChange={handleChange}
                        >
                            <option value="Pouco Importante">Pouco Importante</option>
                            <option value="Importante">Importante</option>
                        </select>
                    </div>
                    <div className="edit-task-field">
                        <label htmlFor="tarefaPrioridade">Prioridade</label>
                        <select
                            id="tarefaPrioridade"
                            name="tarefaPrioridade"
                            value={formData.tarefaPrioridade}
                            onChange={handleChange}
                        >
                            <option value="Não Urgente">Não Urgente</option>
                            <option value="Urgente">Urgente</option>
                        </select>
                    </div>
                    <div className="edit-task-field">
                        <label htmlFor="tarefaPreferenciaTempo">Duração</label>
                        <select
                            id="tarefaPreferenciaTempo"
                            name="tarefaPreferenciaTempo"
                            value={formData.tarefaPreferenciaTempo}
                            onChange={handleChange}
                        >
                            <option value="00:30:00">30 minutos</option>
                            <option value="01:00:00">1 hora</option>
                            <option value="01:30:00">1h 30min</option>
                            <option value="02:00:00">2 horas</option>
                        </select>
                    </div>
                    <button type="submit" className="edit-task-submit-btn">
                        Salvar Alterações
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditTask;
