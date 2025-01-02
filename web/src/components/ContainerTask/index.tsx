import React from 'react';
import './ContainerTask.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

interface TaskProps {
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


const ContainerTask: React.FC<TaskProps> = ({ title, description, createdAt, importanciaPrioridade }) => {
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
                    <button className="edit-task">
                        <FaEdit />
                    </button>
                    <button className="delete-task">
                        <FaTrashAlt />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContainerTask;
