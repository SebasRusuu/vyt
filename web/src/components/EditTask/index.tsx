import React, { useState, useEffect, useContext } from "react";
import "./EditTask.css"; // Estilos específicos do componente
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../services/api";

interface EditTaskProps {
    taskId: number; // ID da tarefa a ser editada
    onClose: () => void; // Função para fechar o pop-up
}

const EditTask: React.FC<EditTaskProps> = ({ taskId, onClose }) => {
    const [formData, setFormData] = useState({
        tarefaTitulo: "",
        tarefaDescricao: "",
        tarefaPrioridade: 0,
        tarefaDuracao: "00:30:00", // Valor padrão
        tarefaDataConclusao: "",
        tarefaCategoria: "",
        tarefaFaseDoDia: "",
    });
    const [error, setError] = useState<string | null>(null);
    const { token } = useContext(AuthContext);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            tarefaPrioridade: parseInt(e.target.value),
        });
    };

    useEffect(() => {
        const loadTask = async () => {
            try {
                const response = await axiosInstance.get(`/tarefa/id/${taskId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const task = response.data;

                // Converte o formato de data para "yyyy-MM-dd"
                const formatDate = (dateString: string): string => {
                    const date = new Date(dateString);
                    return date.toISOString().split("T")[0]; // Pega apenas a parte da data
                };

                setFormData({
                    tarefaTitulo: task.tarefaTitulo,
                    tarefaDescricao: task.tarefaDescricao,
                    tarefaPrioridade: task.tarefaPrioridade,
                    tarefaDuracao: task.tarefaDuracao,
                    tarefaDataConclusao: formatDate(task.tarefaDataConclusao),
                    tarefaCategoria: task.tarefaCategoria,
                    tarefaFaseDoDia: task.tarefaFaseDoDia,
                });
            } catch (err: any) {
                console.error("Erro ao carregar tarefa:", err.message);
                setError("Erro ao carregar tarefa. Tente novamente.");
            }
        };

        loadTask();
    }, [taskId, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const formattedData = {
            ...formData,
            tarefaDataConclusao: formData.tarefaDataConclusao.split("T")[0], // Remove horas, se existirem
        }

        try {
            // Realizar o pedido PUT para atualizar a tarefa
            await axiosInstance.put(
                `/tarefa/update/${taskId}`, formattedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            onClose(); // Fecha o pop-up após a atualização
            window.location.reload(); // Recarrega a página para atualizar a lista de tarefas
        } catch (err: any) {
            console.error("Erro ao atualizar a tarefa:", err.message);
            setError("Erro ao atualizar a tarefa. Tente novamente.");
        }
    };

    return (
        <div className="edit-task-overlay">
            <div className="edit-task-popup">
                <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={onClose}
                    style={{ float: "right" }}
                ></button>
                <form onSubmit={handleSubmit}>
                    <h2>Tarefa</h2>
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
                    <div className="edit-task-field rating">
                        <label htmlFor="tarefaPrioridade" className="form-label">
                            Prioridade
                        </label>
                        {[1, 2, 3, 4, 5].map((value) => (
                            <label key={value}>
                                <input
                                    type="radio"
                                    name="tarefaPrioridade"
                                    value={value}
                                    checked={formData.tarefaPrioridade === value}
                                    onChange={handlePriorityChange}
                                    style={{ display: "none" }}
                                />
                                <button
                                    type="button"
                                    className={formData.tarefaPrioridade === value ? "active" : ""}
                                    onClick={() => setFormData({ ...formData, tarefaPrioridade: value })}
                                >
                                    {value}
                                </button>
                            </label>
                        ))}
                    </div>
                    <div className="edit-task-field">
                        <label htmlFor="tarefaDataConclusao">Data Limite</label>
                        <input
                            type="date"
                            id="tarefaDataConclusao"
                            name="tarefaDataConclusao"
                            value={formData.tarefaDataConclusao}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="edit-task-field">
                        <label htmlFor="tarefaDuracao" className="form-label">
                            Duração
                        </label>
                        <select
                            className="form-select"
                            id="tarefaDuracao"
                            name="tarefaDuracao"
                            value={formData.tarefaDuracao}
                            onChange={handleChange}
                        >
                            <option value="00:30:00">30 minutos</option>
                            <option value="01:00:00">1 hora</option>
                            <option value="01:30:00">1h 30min</option>
                            <option value="02:00:00">2 horas</option>
                            <option value="02:30:00">2h 30min</option>
                            <option value="03:00:00">3 horas</option>
                        </select>
                    </div>
                    <div className="edit-task-field">
                        <label htmlFor="tarefaCategoria" className="form-label">
                            Categoria
                        </label>
                        <select
                            className="form-select"
                            id="tarefaCategoria"
                            name="tarefaCategoria"
                            value={formData.tarefaCategoria}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione a categoria</option>
                            <option value="Trabalho">Trabalho</option>
                            <option value="Saúde">Saúde</option>
                            <option value="Lazer">Lazer</option>
                            <option value="Estudos">Estudos</option>
                            <option value="Casa">Casa</option>
                            <option value="Social">Social</option>
                            <option value="Financeiro">Financeiro</option>
                            <option value="Desenvolvimento Pessoal">Desenvolvimento Pessoal</option>
                            <option value="Viagens">Viagens</option>
                            <option value="Recados">Recados</option>
                        </select>
                    </div>
                    <div className="edit-task-field">
                        <label htmlFor="tarefaFaseDoDia" className="form-label">
                            Fase do dia
                        </label>
                        <select
                            className="form-select"
                            id="tarefaFaseDoDia"
                            name="tarefaFaseDoDia"
                            value={formData.tarefaFaseDoDia}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione a fase do dia</option>
                            <option value="Manhã">Manhã</option>
                            <option value="Tarde">Tarde</option>
                            <option value="Noite">Noite</option>
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