import React from 'react';
import SideBar from '../../components/sidebar';
import Footer from '../../components/footer';
import MainLayoutCompleted from '../../components/MainLayoutCompleted';

function Completed() {
    return (
        <div className="d-flex flex-column vh-100">
            <div className="d-flex flex-grow-1">
                <SideBar />
                <MainLayoutCompleted />
            </div>
            <Footer />
        </div>
    );
}

export default Completed;
