import React, { useState, useContext } from 'react';
import './ContainerTask.css';
import { FaEdit, FaTrashAlt, FaCheck } from 'react-icons/fa';
import EditTask from '../EditTask';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Feedback from "../Feedback";


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
    // Mostra a data no formato Dia da semana "<br />" dd/mm/aaaa
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
    console.log("Tentando marcar tarefa como completa:", taskId);
    try {
        const response = await api.put(`/tarefa/complete/${taskId}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Resposta da API ao completar tarefa:", response.status);
    } catch (error: any) {
        console.error("Erro ao marcar a tarefa como completada:", error);
    }
};

const deleteTask = async (taskId: number, token: string) => {
    console.log("Tentando excluir tarefa:", taskId);
    try {
        const response = await api.delete(`/tarefa/delete/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Resposta da API ao excluir tarefa:", response.status);
        return response.data;
    } catch (error: any) {
        console.error("Erro ao excluir a tarefa:", error);
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
        setIsEditPopupOpen(false); // Centraliza o fecho do popup
    };

    const handleCompleteTask = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Evita que o evento clique afete elementos externos

        if (!token) {
            console.log('Token não encontrado no contexto!');
            return;
        }

        try {
            await markTaskAsCompleted(taskId, token);
        } catch (error) {
            console.error("Erro ao marcar a tarefa como completada:", error);
        } finally {
            // Exibe o pop-up de feedback mesmo se ocorrer um erro na conclusão
            setIsFeedbackOpen(true);
        }
    };

    const handleFeedbackClose = (rating: number | null) => {
        if (rating !== null) {
            console.log(`Feedback para a tarefa ${taskId}: ${rating}/5`);
        }
        setIsFeedbackOpen(false); // Fecha o pop-up de Feedback
    };

    return (
        <>
            <div className="task-container" onClick={(e) => {e.stopPropagation();setIsEditPopupOpen(true);}}>
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
                            onClick={handleCompleteTask} // Chamando Feedback após completar a tarefa
                        >
                            <FaCheck/>
                        </button>
                        <button
                            className="edit-task"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditPopupOpen(true);
                            }}
                        >
                            <FaEdit/>
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
                            <FaTrashAlt/>
                        </button>
                    </div>
                </div>
            </div>
            {/* Feedback Popup */}
            <Feedback isOpen={isFeedbackOpen} onClose={handleFeedbackClose} />

            {/* Edit Popup */}
            {isEditPopupOpen && (
                <div
                    className="popup-overlay"
                    onClick={handleClosePopup} // Fechar ao clicar fora
                >
                    <div
                        className="popup-content"
                        onClick={(e) => e.stopPropagation()} // Previne fecho ao clicar dentro
                    >
                        <EditTask
                            taskId={taskId}
                            onClose={handleClosePopup} // Callback para fechar o popup
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ContainerTask;
