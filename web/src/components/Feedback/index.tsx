import React, { useState } from "react";
import "./Feedback.css";
import api from "../../services/api";
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
            // Enviar os dados do feedback para o backend
            await api.post(`/feedback/${tarefaId}`, {
                feedbackValor: rating,
                feedbackComentario: comment,
            });

            onClose(); // Fecha o modal após envio
            navigate("/completed"); // Redireciona para a página de conclusão
        } catch (err: any) {
            console.error("Erro ao enviar feedback:", err.message);
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
