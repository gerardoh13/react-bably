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
    const uniqueFeedDates = new Set(
      events.feeds.map((d) =>
        new Date(d.start)
          .toLocaleString("sv", { timeZoneName: "short" })
          .slice(0, 10)
      )
    );
    const uniqueDiaperDates = new Set(
      events.diapers.map((d) =>
        new Date(d.start)
          .toLocaleString("sv", { timeZoneName: "short" })
          .slice(0, 10)
      )
    );
    const allDayFeedEvents = Array.from(uniqueFeedDates).map((d) => ({
      date: d,
      title: "feed",
      backgroundColor: "#66bdb8",
    }));
    const allDayDiaperEvents = Array.from(uniqueDiaperDates).map((d) => ({
      date: d,
      title: "diaper",
    }));
    events = [
      ...events.feeds,
      ...events.diapers,
      ...allDayFeedEvents,
      ...allDayDiaperEvents,
    ];
    return events;
  };

  return (
    <div className="col-12 col-sm-8 mt-3 calendar">
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
        height="auto"
        nextDayThreshold="09:00:00"
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
        dayMaxEvents={2}
        slotEventOverlap={false}
        events={{
          events: function (info) {
            return getEvents(info.start, info.end);
          },
        }}
      />
    </div>
  );
}

export default Calendar;
