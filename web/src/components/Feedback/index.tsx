import React, { useState } from "react";
import "./Feedback.css";

interface FeedbackProps {
    isOpen: boolean;
    onClose: (rating: number | null) => void;
}

const Feedback: React.FC<FeedbackProps> = ({ isOpen, onClose }) => {
    const [rating, setRating] = useState<number | null>(null);

    if (!isOpen) return null;

    const handleSubmit = () => {
        onClose(rating);
        window.location.reload();
    };

    return (
        <div className="feedback-popup">
            <h3>Dê seu Feedback</h3>
            <div className="rating">
                {[1, 2, 3, 4, 5].map((value) => (
                    <button
                        key={value}
                        className={rating === value ? "active" : ""}
                        onClick={() => setRating(value)}
                    >
                        {value}
                    </button>
                ))}
            </div>
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