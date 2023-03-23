import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction';

function Calendar() {
  return (
    <div className="container mt-3">
      <FullCalendar
        plugins={[dayGridPlugin, bootstrap5Plugin, timeGridPlugin, interactionPlugin]}
        dateClick={function (info) {
          if (info.view.type === "dayGridMonth") {
            this.changeView("timeGridDay", info.dateStr);
          }
        }}
        initialView="dayGridMonth"
        height={"90vh"}
        themeSystem="bootstrap5"
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "dayGridMonth,timeGridDay",
        }}
        
      />
    </div>
  );
}

export default Calendar;
