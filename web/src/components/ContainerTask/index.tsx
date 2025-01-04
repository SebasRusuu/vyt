import React, { useState } from 'react'; // Adicionado: useState para controlar o pop-up
import './ContainerTask.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { deleteTask } from "../../services/taskService";
import EditTask from '../EditTask'; // Adicionado: Importação do componente EditTask

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
        case "Alto":
            return "high-important";
        case "Médio":
            return "medium-important";
        case "Baixo":
            return "low-important";
        default:
            return "default-important";
    }
};

const formatCreatedAt = (createdAt: string | undefined): string => {
    if (!createdAt) return "No date available";

    try {
        const taskDate = new Date(createdAt);
        if (isNaN(taskDate.getTime())) return "Invalid date";

        const today = new Date();
        const differenceInDays = Math.floor((today.getTime() - taskDate.getTime()) / (1000 * 3600 * 24));

        if (differenceInDays === 0) return "Today";
        if (differenceInDays === 1) return "Yesterday";
        return `${differenceInDays} days ago`;
    } catch (e) {
        return "Invalid date";
    }
};

const ContainerTask: React.FC<TaskProps> = ({ taskId, title, description, createdAt, importanciaPrioridade }) => {
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); // Adicionado: Estado para controlar o pop-up

    return (
        <div className="task-container">
            <h4 className="task-title">{title}</h4>
            <p className="task-description">{description}</p>
            <div className="task-footer">
                <p className="task-date">{formatCreatedAt(createdAt)}</p>
                <p className={`task-important ${getImportantColor(importanciaPrioridade)}`}>
                    {getImportantLabel(importanciaPrioridade)}
                </p>
                <div className="task-actions">
                    <button
                        className="edit-task"
                        onClick={() => setIsEditPopupOpen(true)} // Adicionado: Abre o pop-up de edição
                    >
                        <FaEdit />
                    </button>
                    <button
                        className="delete-task"
                        onClick={() => deleteTask(taskId).then(() => {
                            console.log('Tarefa excluída com sucesso!');
                            // Atualize a lista de tarefas, se necessário
                        }).catch((error) => {
                            console.log(error.message);
                        })}
                    >
                        <FaTrashAlt />
                    </button>
                </div>
            </div>

            {/* Adicionado: Renderização do pop-up de edição */}
            {isEditPopupOpen && (
                <EditTask
                    taskId={taskId} // Passa o ID da tarefa para o componente EditTask
                    onClose={() => setIsEditPopupOpen(false)} // Fecha o pop-up ao clicar
                />
            )}
        </div>
    );
};

export default ContainerTask;
