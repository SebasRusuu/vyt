import React from 'react';
import SideBar from '../../components/sidebar';
import Footer from '../../components/footer';
import MainLayout from '../../components/MainLayout';

function Home() {
  return (
    <div className="d-flex flex-column vh-100">
      <div className="d-flex flex-grow-1">
        <SideBar />
        <MainLayout />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
