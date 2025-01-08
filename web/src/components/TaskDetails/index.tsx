import React, { useState, useEffect } from "react";
import "./TaskDetails.css";
import axiosInstance from "../../services/api";

interface TaskDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    tarefaId: number;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ isOpen, onClose, tarefaId }) => {
    const [taskDetails, setTaskDetails] = useState<any>(null);
    const [feedbackDetails, setFeedbackDetails] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const fetchDetails = async () => {
            try {
                // Buscar informações da tarefa
                const taskResponse = await axiosInstance.get(`/tarefa/id/${tarefaId}`);
                setTaskDetails(taskResponse.data);

                // Buscar informações do feedback
                const feedbackResponse = await axiosInstance.get(`/feedback/tarefa/${tarefaId}`);
                setFeedbackDetails(feedbackResponse.data);
            } catch (err: any) {
                console.error("Erro ao buscar detalhes:", err.message);
                setError("Erro ao carregar os detalhes. Tente novamente.");
            }
        };

        fetchDetails();
    }, [isOpen, tarefaId]);

    if (!isOpen) return null;

    return (
        <div className="task-details-overlay" onClick={onClose}>
            <div className="task-details-popup" onClick={(e) => e.stopPropagation()}>
                <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={onClose}
                    style={{ float: "right" }}
                ></button>
                <h3>Detalhes da Tarefa</h3>
                {error && <p className="error-message">{error}</p>}
                {taskDetails && (
                    <div className="task-info">
                        <p><strong>Título:</strong> {taskDetails.tarefaTitulo}</p>
                        <p><strong>Descrição:</strong> {taskDetails.tarefaDescricao}</p>
                        <p><strong>Data de Conclusão:</strong> {taskDetails.tarefaDataConclusao}</p>
                        <p><strong>Importância:</strong> {taskDetails.tarefaImportanciaPrioridade}</p>
                    </div>
                )}
                {feedbackDetails && (
                    <div className="feedback-info">
                        <p><strong>Feedback:</strong> {feedbackDetails.feedbackValor}/10</p>
                        <p><strong>Comentário:</strong> {feedbackDetails.feedbackComentario}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskDetails;
