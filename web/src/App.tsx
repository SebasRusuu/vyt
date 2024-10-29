import React from 'react';
import './App.css';
import Home from './pages/home';
import Header from './components/header';
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';

const MainPage = () => {
  return (
    <div>
      <Home/>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <Router>
        <div className="main-container">
          <Header/>
          <Routes>
            <Route path="/" element={<MainPage />} />
          </Routes>
        </div>
      </Router>
      
    </div>
  );
}

export default App;
