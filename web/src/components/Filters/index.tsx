import React, { useState } from "react";
import "./filters.css";

interface FiltersProps {
    onFilterChange: (filter: string) => void;
}

function Filters({ onFilterChange }: FiltersProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const levels = ["Todos", "Baixo", "Médio", "Alto"]; // Valores em português

    const handleFilterClick = (level: string, index: number) => {
        setActiveIndex(index);
        onFilterChange(level); // Chama a função passada para aplicar o filtro
    };

    return (
        <div className="filters-wrapper">
            <div className="filter-container">
        <span
            className="filter-highlight"
            style={{
                transform: `translateX(calc(${activeIndex} * 100%))`, // Movimenta a barra para o botão ativo
            }}
        ></span>
                {levels.map((level, index) => (
                    <button
                        key={index}
                        className={`filter-button ${
                            activeIndex === index ? "active" : ""
                        }`}
                        onClick={() => handleFilterClick(level, index)}
                    >
                        {level}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Filters;
