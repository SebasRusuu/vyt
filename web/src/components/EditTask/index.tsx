import React, { useState, useEffect , useContext} from "react";
import "./EditTask.css"; // Estilos específicos do componente
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";


interface EditTaskProps {
    taskId: number; // ID da tarefa a ser editada
    onClose: () => void; // Função para fechar o pop-up
}

const EditTask: React.FC<EditTaskProps> = ({ taskId, onClose }) => {
    const [formData, setFormData] = useState({
        tarefaTitulo: "",
        tarefaDescricao: "",
        tarefaImportancia: "",
        tarefaPrioridade: "",
        tarefaPreferenciaTempo: "",
    });
    const [error, setError] = useState<string | null>(null);
    const { token } = useContext(AuthContext);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        const loadTask = async () => {
            try {
                const response = await api.get(`/tarefa/id/${taskId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const task = response.data;
                setFormData({
                    tarefaTitulo: task.tarefaTitulo,
                    tarefaDescricao: task.tarefaDescricao,
                    tarefaImportancia: task.tarefaImportancia,
                    tarefaPrioridade: task.tarefaPrioridade,
                    tarefaPreferenciaTempo: task.tarefaPreferenciaTempo,
                });
            } catch (err: any) {
                console.error("Erro ao carregar tarefa:", err.message);
                setError("Erro ao carregar tarefa. Tente novamente.");
            }
        };

        loadTask();
    }, [taskId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            // Determinar a combinação de Importância & Prioridade
            let importanciaPrioridade = "Baixo";
            if (
                formData.tarefaImportancia === "Importante" &&
                formData.tarefaPrioridade === "Urgente"
            ) {
                importanciaPrioridade = "Alto";
            } else if (
                formData.tarefaImportancia === "Importante" ||
                formData.tarefaPrioridade === "Urgente"
            ) {
                importanciaPrioridade = "Médio";
            }

            // Realizar o pedido PUT para atualizar a tarefa
            await api.put(
                `/tarefa/update/${taskId}`,
                {
                    tarefaTitulo: formData.tarefaTitulo,
                    tarefaDescricao: formData.tarefaDescricao,
                    tarefaImportanciaPrioridade: importanciaPrioridade,
                    tarefaPreferenciaTempo: formData.tarefaPreferenciaTempo,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            onClose(); // Fecha o pop-up após a atualização
            window.location.reload(); // Recarrega a página para atualizar a lista de tarefas
        } catch (err: any) {
            console.error("Erro ao atualizar a tarefa:", err.message);
            setError("Erro ao atualizar a tarefa. Tente novamente.");
        }
    }



    return (
        <div className="edit-task-overlay">
            <div className="edit-task-popup">
                <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={onClose}
                    style={{ float: "right" }}
                ></button>
                <form onSubmit={handleSubmit}>

                    <h2>Tarefa</h2>
                    {error && <p className="edit-task-error">{error}</p>}
                    <div className="edit-task-field">
                        <label htmlFor="tarefaTitulo">Título</label>
                        <input
                            type="text"
                            id="tarefaTitulo"
                            name="tarefaTitulo"
                            value={formData.tarefaTitulo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="edit-task-field">
                        <label htmlFor="tarefaDescricao">Descrição</label>
                        <textarea
                            id="tarefaDescricao"
                            name="tarefaDescricao"
                            rows={3}
                            value={formData.tarefaDescricao}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <div className="edit-task-field">
                        <label htmlFor="tarefaImportancia">Importância</label>
                        <select
                            id="tarefaImportancia"
                            name="tarefaImportancia"
                            value={formData.tarefaImportancia}
                            onChange={handleChange}
                        >
                            <option value="Pouco Importante">Pouco Importante</option>
                            <option value="Importante">Importante</option>
                        </select>
                    </div>
                    <div className="edit-task-field">
                        <label htmlFor="tarefaPrioridade">Prioridade</label>
                        <select
                            id="tarefaPrioridade"
                            name="tarefaPrioridade"
                            value={formData.tarefaPrioridade}
                            onChange={handleChange}
                        >
                            <option value="Não Urgente">Não Urgente</option>
                            <option value="Urgente">Urgente</option>
                        </select>
                    </div>
                    <div className="edit-task-field">
                        <label htmlFor="tarefaPreferenciaTempo">Duração</label>
                        <select
                            id="tarefaPreferenciaTempo"
                            name="tarefaPreferenciaTempo"
                            value={formData.tarefaPreferenciaTempo}
                            onChange={handleChange}
                        >
                            <option value="00:30:00">30 minutos</option>
                            <option value="01:00:00">1 hora</option>
                            <option value="01:30:00">1h 30min</option>
                            <option value="02:00:00">2 horas</option>
                        </select>
                    </div>
                    <button type="submit" className="edit-task-submit-btn">
                        Salvar Alterações
                        
                    </button>
                </form>
            </div>
        </div>
    );
};
export default EditTask;
