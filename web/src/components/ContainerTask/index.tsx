import React, { useState } from 'react';
import './ContainerTask.css';
import { FaEdit, FaTrashAlt, FaCheck } from 'react-icons/fa';
import { deleteTask, markTaskAsCompleted } from '../../services/taskService';
import EditTask from '../EditTask';

interface TaskProps {
    taskId: number;
    title: string;
    description: string;
    createdAt: string;
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

const formatCreatedAt = (createdAt: string | undefined): string => {
    if (!createdAt) return 'No date available';

    try {
        const taskDate = new Date(createdAt);
        if (isNaN(taskDate.getTime())) return 'Invalid date';

        const today = new Date();
        const differenceInDays = Math.floor(
            (today.getTime() - taskDate.getTime()) / (1000 * 3600 * 24)
        );

        if (differenceInDays === 0) return 'Hoje';
        if (differenceInDays === 1) return 'Ontem';
        return `${differenceInDays} dias atrás`;
    } catch (e) {
        return 'Invalid date';
    }
};

const ContainerTask: React.FC<TaskProps> = ({
    taskId,
    title,
    description,
    createdAt,
    importanciaPrioridade,
}) => {
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

    const handleClosePopup = () => {
        setIsEditPopupOpen(false); // Centraliza o fecho do popup
    };

    return (
        <>
            <div
                className="task-container"
                onClick={(e) => {
                    e.stopPropagation(); // Previne cliques indesejados
                    setIsEditPopupOpen(true);
                }}
            >
                <h4 className="task-title">{title}</h4>
                <p className="task-description">{description}</p>
                <div className="task-footer">
                    <p className="task-date">{formatCreatedAt(createdAt)}</p>
                    <p
                        className={`task-important ${getImportantColor(
                            importanciaPrioridade
                        )}`}
                    >
                        {getImportantLabel(importanciaPrioridade)}
                    </p>
                    <div className="task-actions">
                        <button
                            className="check-task"
                            onClick={(e) => {
                                e.stopPropagation();
                                markTaskAsCompleted(taskId)
                                    .then(() => {
                                        console.log('Tarefa marcada como completada!');
                                        window.location.reload();
                                    })
                                    .catch((error) => {
                                        console.log(error.message);
                                    });
                            }}
                        >
                            <FaCheck />
                        </button>
                        <button
                            className="edit-task"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditPopupOpen(true);
                            }}
                        >
                            <FaEdit />
                        </button>
                        <button
                            className="delete-task"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteTask(taskId)
                                    .then(() => {
                                        console.log('Tarefa excluída com sucesso!');
                                        window.location.reload();
                                    })
                                    .catch((error) => {
                                        console.log(error.message);
                                    });
                            }}
                        >
                            <FaTrashAlt />
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay e Popup */}
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
