import React, { useContext, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import BablyApi from "../api";
import UserContext from "../users/UserContext";
import FeedForm from "./FeedForm";
import DiaperForm from "./DiaperForm";
import ConfirmModal from "./ConfirmModal";
import "./Calendar.css";

function Calendar() {
  const [currEvent, setCurrEvent] = useState(null);
  const { currChild } = useContext(UserContext);
  const [showDiaperForm, setShowDiaperForm] = useState(false);
  const [showFeedForm, setShowFeedForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toDelete, setToDelete] = useState(null);

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

  const updateDiaper = async (diaper_id, diaper) => {
    delete diaper.infant_id;
    await BablyApi.updateDiaper(currChild.id, diaper_id, diaper);
  };

  const updateFeed = async (feed_id, feed) => {
    delete feed.infant_id;
    await BablyApi.updateFeed(currChild.id, feed_id, feed);
  };

  const confirmDelete = async () => {
    if (toDelete[1] === "diaper") {
      await BablyApi.deleteDiaper(currChild.id, toDelete[0]);
    } else if (toDelete[1] === "feed") {
      await BablyApi.deleteFeed(currChild.id, toDelete[0]);
    }
    setToDelete(null);
    setShowConfirmModal(false);
  };

  const onDelete = (id, type) => {
    setToDelete([id, type]);
    showModal(type);
    setShowConfirmModal(true);
  };

  const showModal = (type) => {
    if (type === "feed") {
      setShowFeedForm((prev) => !prev);
    } else if (type === "diaper") {
      setShowDiaperForm((prev) => !prev);
    }
  };

  return (
    <>
      <FeedForm
        show={showFeedForm}
        setShow={setShowFeedForm}
        submit={updateFeed}
        feed={currEvent}
        onDelete={onDelete}
      />
      <DiaperForm
        show={showDiaperForm}
        setShow={setShowDiaperForm}
        submit={updateDiaper}
        diaper={currEvent}
        onDelete={onDelete}
      />
      <ConfirmModal
        show={showConfirmModal}
        setShow={setShowConfirmModal}
        confirm={confirmDelete}
        cancel={setToDelete}
      />
      <div className="col-12 col-sm-8 col-xl-6 col-xxl-5 mt-4 my-sm-auto">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            bootstrap5Plugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
          ]}
          dateClick={function (info) {
            if (info.view.type === "dayGridMonth") {
              this.changeView("timeGridDay", info.dateStr);
            }
          }}
          eventClick={async function (info) {
            if (!currChild.crud) return
            const [type, eventId] = info.event._def.publicId.split("-");
            let event;
            if (type === "feed") {
              event = await BablyApi.getFeed(currChild.id, eventId);
            } else if (type === "diaper") {
              event = await BablyApi.getDiaper(currChild.id, eventId);
            }
            setCurrEvent(event);
            showModal(type);
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
    </>
  );
}

export default Calendar;
