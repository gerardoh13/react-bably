import React, { useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import BablyApi from "../api";
import UserContext from "../users/UserContext";
import "./Calendar.css";

function Calendar() {
  let { currChild } = useContext(UserContext);

  const getEvents = async (start, end) => {
    start = start.getTime() / 1000;
    end = end.getTime() / 1000;
    let events = await BablyApi.getEvents(currChild.id, start, end);
    let uniqueDates = new Set(
      events.map((d) =>
        new Date(d.start)
          .toLocaleString("sv", { timeZoneName: "short" })
          .slice(0, 10)
      )
    );
    let allDayFeedEvents = Array.from(uniqueDates).map((d) => ({
      date: d,
      title: "feed",
    }));
    events = [...events, ...allDayFeedEvents];
    return events;
  };

  return (
    <div className="col-12 col-sm-8 mt-3">
      <FullCalendar
        plugins={[
          dayGridPlugin,
          bootstrap5Plugin,
          timeGridPlugin,
          interactionPlugin,
        ]}
        dateClick={function (info) {
          if (info.view.type === "dayGridMonth") {
            this.changeView("timeGridDay", info.dateStr);
          }
        }}
        initialView="dayGridMonth"
        height={"80vh"}
        themeSystem="bootstrap5"
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "dayGridMonth,timeGridDay",
        }}
        views={{
          dayGrid: {
            titleFormat: { year: "numeric", month: "short" },
          },
          day: {
            titleFormat: { year: "numeric", month: "short", day: "numeric" },
            allDaySlot: false,
          },
        }}
        dayMaxEvents={1}
        slotEventOverlap={false}
        events={{
          events: function (info) {
            return getEvents(info.start, info.end);
          },
          backgroundColor: "#66bdb8",
        }}
      />
    </div>
  );
}

export default Calendar;
