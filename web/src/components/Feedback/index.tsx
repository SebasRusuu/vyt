import React, { useState} from "react";
import "./Feedback.css";
import axiosInstance from "../../services/api";
import { useNavigate } from "react-router-dom";


interface FeedbackProps {
    isOpen: boolean;
    onClose: () => void;
    tarefaId: number; // ID da tarefa associada ao feedback
}



const Feedback: React.FC<FeedbackProps> = ({ isOpen, onClose, tarefaId }) => {
    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (rating === null) return;

        try {
            // Criar feedback e enviar para o backend
            await axiosInstance.post(`/feedback/${tarefaId}`, {
                feedbackValor: rating,
                feedbackComentario: comment,
            });

            // Após enviar o feedback, fechar o modal e atualizar a interface
            navigate('/completed');
            console.log(`[INFO] Feedback enviado com sucesso para a tarefa ${tarefaId}`);
        } catch (err: any) {
            console.error("[ERROR] Erro ao enviar feedback:", err.message);
            setError("Erro ao enviar feedback. Tente novamente.");
        }
    };



    return (
        <div className="feedback-overlay" onClick={onClose}>
            <div
                className="feedback-popup"
                onClick={(e) => e.stopPropagation()} // Previne o fechamento ao clicar no pop-up
            >
                <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={onClose}
                    style={{ float: "right" }}
                ></button>
                <h3>Dê seu Feedback</h3>
                <div className="rating">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                        <button
                            key={value}
                            className={rating === value ? "active" : ""}
                            onClick={() => setRating(value)}
                        >
                            {value}
                        </button>
                    ))}
                </div>
                <textarea
                    placeholder="Escreva seu feedback aqui..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button
                    className="submit"
                    onClick={handleSubmit}
                    disabled={rating === null}
                >
                    Enviar
                </button>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default Feedback;
