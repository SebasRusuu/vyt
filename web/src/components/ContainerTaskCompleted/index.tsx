import React from "react";
import "../ContainerTask/ContainerTask.css";

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

const formatConclusaoAt = (dataConclusao: string | undefined): JSX.Element => {
    if (!dataConclusao) return <>No date available</>;
    // Mostra a data no formato Dia da semana "<br />" dd/mm/aaaa
    const date = new Date(dataConclusao);
    const day = date.toLocaleDateString('pt-BR', { weekday: 'long' });
    return (
        <>
            {day}
            <br />
            {`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}
        </>
    );
};



const ContainerTaskCompleted: React.FC<TaskProps> = ({ title, description, conclusionDate, importanciaPrioridade }) => {
    return (
        <div className="task-container">
            <h4 className="task-title">{title}</h4>
            <p className="task-description">{description}</p>
            <div className="task-footer">
                <p className="task-date">{formatConclusaoAt(conclusionDate)}</p>
                <p className={`task-important ${getImportantColor(importanciaPrioridade)}`}>
                    {getImportantLabel(importanciaPrioridade)}
                </p>
            </div>
        </div>
    );
};

export default ContainerTaskCompleted;
