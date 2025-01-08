import React, { useState, useContext } from 'react';
import './ContainerTask.css';
import { FaTrashAlt, FaCheck } from 'react-icons/fa';
import EditTask from '../EditTask';
import axiosInstance from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Feedback from '../Feedback';

interface TaskProps {
    taskId: number;
    title: string;
    description: string;
    conclusionDate: string;
    importanciaPrioridade: string;
}

const getImportantLabel = (importanciaPrioridade: string) => importanciaPrioridade;

const getImportantColor = (importanciaPrioridade: string) => {
    switch (importanciaPrioridade) {
        case 'Alto':
            return 'high-important';
        case 'Médio':
            return 'medium-important';
        case 'Baixo':
            return 'low-important';
        default:
            return 'default-important';
    }
};

const formatConclusaoAt = (dataConclusao: string | undefined): JSX.Element => {
    if (!dataConclusao) return <>No date available</>;
    const date = new Date(dataConclusao);
    const day = date.toLocaleDateString('pt-PT', { weekday: 'long' });
    return (
        <>
            {day}
            <br />
            {`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}
        </>
    );
};

const markTaskAsCompleted = async (taskId: number, token: string): Promise<void> => {
    console.log('Tentando marcar tarefa como completa:', taskId);
    try {
        const response = await axiosInstance.put(`/tarefa/complete/${taskId}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Resposta da API ao completar tarefa:', response.status);
    } catch (error: any) {
        console.error('Erro ao marcar a tarefa como completada:', error);
    }
};

const deleteTask = async (taskId: number, token: string) => {
    console.log('Tentando excluir tarefa:', taskId);
    try {
        const response = await axiosInstance.delete(`/tarefa/delete/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Resposta da API ao excluir tarefa:', response.status);
        return response.data;
    } catch (error: any) {
        console.error('Erro ao excluir a tarefa:', error);
    }
};

const ContainerTask: React.FC<TaskProps> = ({
                                                taskId,
                                                title,
                                                description,
                                                conclusionDate,
                                                importanciaPrioridade,
                                            }) => {
    const { token } = useContext(AuthContext); // Obtém o token do contexto
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    const handleClosePopup = () => {
        setIsEditPopupOpen(false);
    };

    const handleCompleteTask = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!token) {
            console.log('Token não encontrado no contexto!');
            return;
        }

        try {
            await markTaskAsCompleted(taskId, token);
        } catch (error) {
            console.error('Erro ao marcar a tarefa como completada:', error);
        } finally {
            setIsFeedbackOpen(true);
        }
    };

    const handleFeedbackClose = async (rating: number | null, comment: string) => {
        if (rating !== null) {
            try {
                // Enviar feedback ao backend
                await axiosInstance.post(`/feedback/${taskId}`, {
                    feedbackValor: rating,
                    feedbackComentario: comment,
                });
                console.log(`Feedback para a tarefa ${taskId}: ${rating}/10, comentário: "${comment}"`);
            } catch (error) {
                console.error('Erro ao salvar feedback:', error);
            }
        }
        setIsFeedbackOpen(false); // Fecha o pop-up de Feedback
    };

    return (
        <>
            <div className="task-container" onClick={(e) => { e.stopPropagation(); setIsEditPopupOpen(true); }}>
                <div className="task-header">
                    <h4 className="task-title">{title}</h4>
                    <p
                        className={`task-important ${getImportantColor(importanciaPrioridade)}`}
                    >
                        {getImportantLabel(importanciaPrioridade)}
                    </p>
                </div>
                <p className="task-description">{description}</p>
                <div className="task-footer">
                    <p className="task-date">{formatConclusaoAt(conclusionDate)}</p>
                    <div className="task-actions">
                        <button
                            className="check-task"
                            onClick={handleCompleteTask}
                        >
                            <FaCheck />
                        </button>
                        <button
                            className="delete-task"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (token) {
                                    deleteTask(taskId, token)
                                        .then(() => {
                                            window.location.reload();
                                        })
                                        .catch((error) => {
                                            console.log(error.message);
                                        });
                                } else {
                                    console.log('Token não encontrado no contexto!');
                                }
                            }}
                        >
                            <FaTrashAlt />
                        </button>
                    </div>
                </div>
            </div>
            {/* Feedback Popup */}
            {isFeedbackOpen && (
                <div className="feedback-overlay">
                    <Feedback
                        isOpen={isFeedbackOpen}
                        onClose={() => setIsFeedbackOpen(false)}
                        tarefaId={taskId}
                    />
                </div>
            )}

            {/* Edit Popup */}
            {isEditPopupOpen && (
                <div
                    className="popup-overlay"
                    onClick={handleClosePopup}
                >
                    <div
                        className="popup-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <EditTask
                            taskId={taskId}
                            onClose={handleClosePopup}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ContainerTask;
