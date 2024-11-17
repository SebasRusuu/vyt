import React, { useEffect } from 'react';
import './NewTask.css';

interface NewTaskProps {
    isOpen: boolean;
    onClose: () => void;
}

function NewTask({ isOpen, onClose }: NewTaskProps) {
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 600);

    const handleResize = () => {
        setIsMobile(window.innerWidth <= 600);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isOpen) return null; // Retorna `null` se o pop-up estiver fechado

    return (
        <div className={`app-container overlay`}>
            <div className="popup-overlay">
                <div className="popup">
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px'
                        }}
                    ></button>
                    <form>
                        <div className="mb-3">
                            <label
                                htmlFor="taskName"
                                className="form-label"
                                style={{ padding: '5px 0' }}
                            >
                                Nome da Tarefa
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="taskName"
                                style={{
                                    fontSize: isMobile ? '0.9em' : '1em'
                                }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="taskDescription" className="form-label">Descrição</label>
                            <textarea
                                className="form-control"
                                id="taskDescription"
                                rows={3}
                                style={{
                                    fontSize: isMobile ? '0.9em' : '1em'
                                }}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="taskPriority" className="form-label">Prioridade</label>
                            <select
                                className="form-select"
                                id="taskPriority"
                                style={{
                                    fontSize: isMobile ? '0.9em' : '1em'
                                }}
                            >
                                <option value="null">- - - - -</option>
                                <option value="low">Não-Urgente</option>
                                <option value="high">Urgente</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="taskImportancia" className="form-label">Importância</label>
                            <select
                                className="form-select"
                                id="taskImportancia"
                                style={{
                                    fontSize: isMobile ? '0.9em' : '1em'
                                }}
                            >
                                <option value="null">- - - - -</option>
                                <option value="low">Não-Importante</option>
                                <option value="high">Importante</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="taskDate" className="form-label">Data</label>
                            <input
                                type="date"
                                className="form-control"
                                id="taskDate"
                                style={{
                                    fontSize: isMobile ? '0.9em' : '1em'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button
                                type="button"
                                onClick={onClose}
                                className="submit-button"
                                style={{
                                    width: isMobile ? '100%' : 'auto'
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default NewTask;
