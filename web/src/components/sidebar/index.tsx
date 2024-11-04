import React from "react";
import { Link } from "react-router-dom";
import Calendar from "../../assets/calendar.svg";
import TaskDone from "../../assets/taskdone.svg";
import Tasks from "../../assets/tasks.svg";
import './sidebar.css';


function Sidebar() {
  const navItems = [
    {
      icon: Tasks,
      link: "/",
    },
    {
      icon: TaskDone,
      link: "/completed",
    },
    {
      icon: Calendar,
      link: "/calendar",
    },
  ];

  return (
    <div className="d-flex flex-column align-items-center" style={{ width: "70px", height: "100vh" }}>
      <ul className="nav flex-column mt-4">
        {navItems.map((item, index) => (
          <li key={index} className="nav-item mb-4">
            <Link to={item.link} className="nav-link p-0">
              <img 
                src={item.icon} 
                alt={`icon-${index}`} 
                className="icon-img"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
