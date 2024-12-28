import React, { useState } from "react";
import "./filters.css";

function Filters() {
  const [activeIndex, setActiveIndex] = useState(0);
  const priorities = ["All", "Low", "Medium", "High"];

  return (
    <div className="filter-container">
      <span
        className="filter-highlight"
        style={{
          width: `calc(100% / ${priorities.length} - 10px)`,
          height: "calc(100% - 10px)",
          top: "50%",
          transform: `translate(calc(${activeIndex * 100}% + ${
            activeIndex * 10
          }px), -50%)`,
        }}
      ></span>
      {priorities.map((priority, index) => (
        <button
          key={index}
          className={`filter-button ${
            activeIndex === index ? "active" : ""
          }`}
          onClick={() => setActiveIndex(index)}
        >
          {priority}
        </button>
      ))}
    </div>
  );
}

export default Filters;
