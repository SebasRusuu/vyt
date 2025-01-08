import React, { useState } from "react";
import "./Feedback.css";

interface FeedbackProps {
    isOpen: boolean;
    onClose: (rating: number | null) => void;
}

const Feedback: React.FC<FeedbackProps> = ({ isOpen, onClose }) => {
    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState<string>("");

    if (!isOpen) return null;

    const handleSubmit = () => {
        onClose(rating);
        window.location.reload();
    };

    return (
        <div className="feedback-popup">
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
        </div>
    );
};

export default Feedback;