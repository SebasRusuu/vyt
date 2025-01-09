import React, { useState } from "react";
import "./NewTask.css";
import axiosInstance from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

interface NewTaskProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewTask: React.FC<NewTaskProps> = ({ isOpen, onClose }) => {
    const [taskData, setTaskData] = useState({
        tarefaTitulo: "",
        tarefaDescricao: "",
        tarefaPrioridade: 0,
        tarefaDuracao: "00:30:00", // Valor padrão
        tarefaDataConclusao: "",
        tarefaCategoria: "",
        tarefaFaseDoDia: "",
    });
    const [rating, setRating] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { token } = React.useContext(AuthContext);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setTaskData({
            ...taskData,
            [e.target.name]: e.target.value,
        });
    };


    const handleRatingClick = (value: number) => {
        setRating(value);
        setTaskData({
            ...taskData,
            tarefaPrioridade: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        console.log("Submitting task data:", taskData);

        const formattedData = {
            ...taskData,
            tarefaDataConclusao: taskData.tarefaDataConclusao.split("T")[0], // Remove horas, se existirem
        };

        try {
            await axiosInstance.post("/tarefa/create", formattedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            onClose();
            window.location.reload();
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
                    <div className="edit-task-field rating">
                        <label htmlFor="tarefaPrioridade" className="form-label">
                            Prioridade
                        </label>
                        {[1, 2, 3, 4, 5].map((value) => (
                            <button
                                key={value}
                                className={rating === value ? "active" : ""}
                                onClick={() => handleRatingClick(value)}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                    <div className="edit-task-field">
                        <label htmlFor="tarefaDataConclusao">Data Limite</label>
                        <input
                            type="date"
                            id="tarefaDataConclusao"
                            name="tarefaDataConclusao"
                            value={taskData.tarefaDataConclusao}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tarefaDuracao" className="form-label">
                            Duração
                        </label>
                        <select
                            className="form-select"
                            id="tarefaDuracao"
                            name="tarefaDuracao"
                            value={taskData.tarefaDuracao}
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
                    <div className="mb-3">
                        <label htmlFor="tarefaCategoria" className="form-label">
                            Categoria
                        </label>
                        <select
                            className="form-select"
                            id="tarefaCategoria"
                            name="tarefaCategoria"
                            value={taskData.tarefaCategoria}
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
                    <div className="mb-3">
                        <label htmlFor="tarefaFaseDoDia" className="form-label">
                            Fase do dia
                        </label>
                        <select
                            className="form-select"
                            id="tarefaFaseDoDia"
                            name="tarefaFaseDoDia"
                            value={taskData.tarefaFaseDoDia}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione a fase do dia</option>
                            <option value="Manhã">Manhã</option>
                            <option value="Tarde">Tarde</option>
                            <option value="Noite">Noite</option>
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