import React from "react";
import SideBar from "../../components/sidebar";
import Footer from "../../components/footer";
import FullCalendarPage from "../../components/FullCalendarPage";

function Calendar() {
    return (
        <div className="d-flex flex-column vh-100">
            <div className="d-flex flex-grow-1">
                <SideBar />
                <FullCalendarPage />
            </div>
            <Footer />
        </div>
    );
}

export default Calendar;
