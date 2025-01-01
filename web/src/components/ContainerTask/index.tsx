import React from 'react';
import './ContainerTask.css';

interface TaskProps {
    title: string;
    description: string;
    createdAt: string;
    priority: string;
}

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case '1':
            return 'low-priority';
        case '2':
            return 'medium-priority';
        case '3':
            return 'high-priority';
        default:
            return 'default-priority';
    }
};

const ContainerTask: React.FC<TaskProps> = ({ title, description, createdAt, priority }) => {
    return (
        <div className="task-container">
            <h4 className="task-title">{title}</h4>
            <p className="task-description">{description}</p>
            <div className="task-footer">
                <p className="task-date">{new Date(createdAt).toLocaleDateString()}</p>
                <p className={`task-priority ${getPriorityColor(priority)}`}>Prioridade: {priority}</p>
            </div>
        </div>
    );
};

export default ContainerTask;
