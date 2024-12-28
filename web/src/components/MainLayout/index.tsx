import React from 'react';
import Filters from '../../components/Filters'; // Importa o componente Filters
import './MainLayout.css';

function MainLayout() {
  return (
    <div className="main-layout">
      <div className="header-section">
        <h1 className="title">All Tasks</h1>
        <Filters />
      </div>
      
      <div className="tasks-content">
        {/* Conteúdo dos cards seria adicionado aqui futuramente */}
      </div>
    </div>
  );
}

export default MainLayout;
