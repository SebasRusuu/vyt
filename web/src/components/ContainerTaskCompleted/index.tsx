import React, { useState } from "react";
import "../ContainerTask/ContainerTask.css";
import TaskDetails from "../TaskDetails";

interface TaskProps {
    taskId: number;
    title: string;
    description: string;
    conclusionDate: string;
    Prioridade: number;
}

const getImportantLabel = (Prioridade: number) => {
    if (Prioridade === 1 || Prioridade === 2) {
        return 'Baixo';
    }
    if (Prioridade === 3) {
        return 'Médio';
    }
    return 'Alto';
};

const getImportantColor = (Prioridade: number) => {
    if (Prioridade === 1 || Prioridade === 2) {
        return "Baixo";
    }
    if (Prioridade === 3) {
        return "Médio";
    }
    return "Alto";

};

const formatConclusaoAt = (dataConclusao: string | undefined): JSX.Element => {
    if (!dataConclusao) return <>No date available</>;
    const date = new Date(dataConclusao);
    const day = date.toLocaleDateString("pt-BR", { weekday: "long" });
    return (
        <>
            {day}
            <br />
            {`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}
        </>
    );
};

const ContainerTaskCompleted: React.FC<TaskProps> = ({
                                                         taskId,
                                                         title,
                                                         description,
                                                         conclusionDate,
                                                         Prioridade,
                                                     }) => {
    const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);

    const handleOpenTaskDetails = () => {
        setIsTaskDetailsOpen(true);
    };

    const handleCloseTaskDetails = () => {
        setIsTaskDetailsOpen(false);
    };

    return (
        <>
            <div className="task-container" onClick={handleOpenTaskDetails}>
                <h4 className="task-title">{title}</h4>
                <p className="task-description">{description}</p>
                <div className="task-footer">
                    <p className="task-date">{formatConclusaoAt(conclusionDate)}</p>
                    <p
                        className={`task-important ${getImportantColor(
                            Prioridade
                        )}`}
                    >
                        {getImportantLabel(Prioridade)}
                    </p>
                </div>
            </div>
            {isTaskDetailsOpen && (
                <TaskDetails
                    isOpen={isTaskDetailsOpen}
                    onClose={handleCloseTaskDetails}
                    tarefaId={taskId}
                />
            )}
        </>
    );
};

export default ContainerTaskCompleted;
