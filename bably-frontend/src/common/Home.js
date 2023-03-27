import React, { useContext, useState, useEffect } from "react";
import UserContext from "../users/UserContext";
import BablyApi from "../api";
import { Navigate } from "react-router-dom";
import DiaperForm from "../components/DiaperForm";
import FeedForm from "../components/FeedForm";
import FeedTable from "../components/FeedTable";
import SummaryCards from "../components/SummaryCards";
import DiaperTable from "../components/DiaperTable";

function Home() {
  const [feeds, setFeeds] = useState([]);
  const [diapers, setDiapers] = useState([]);
  const [showDiaperForm, setShowDiaperForm] = useState(false);
  const [showFeedForm, setShowFeedForm] = useState(false);
  const [currTable, setCurrTable] = useState("feeds");
  const [totals, setTotals] = useState({
    amount: 0,
    duration: 0,
    wet: 0,
    soiled: 0,
  });
  const { currChild } = useContext(UserContext);

  useEffect(() => {
    const getActivity = async () => {
      const { last_midnight, next_midnight } = getMidnights();
      const todaysFeeds = await BablyApi.getTodaysFeeds(
        currChild.id,
        last_midnight,
        next_midnight
      );
      const todaysDiapers = await BablyApi.getTodaysDiapers(
        currChild.id,
        last_midnight,
        next_midnight
      );
      setFeeds(todaysFeeds);
      setDiapers(todaysDiapers);
      updateCards(todaysFeeds, todaysDiapers);
    };
    if (currChild) getActivity();
  }, [currChild]);

  const getMidnights = () => {
    let midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    let last_midnight = midnight.getTime() / 1000;
    midnight.setDate(midnight.getDate() + 1);
    let next_midnight = midnight.getTime() / 1000;
    return { last_midnight, next_midnight };
  };

  const changeTable = (val) => {
    if (currTable === val) return;
    else setCurrTable(val);
  };
  const updateCards = (todaysFeeds, todaysDiapers) => {
    const bottleFeeds = todaysFeeds.filter((f) => f.method === "bottle");
    const nursingFeeds = todaysFeeds.filter((f) => f.method === "nursing");
    const wetDiapers = todaysDiapers.filter((f) => f.type !== "soiled");
    const soiledDiapers = todaysDiapers.filter((f) => f.type !== "wet");
    let feedAmt = !bottleFeeds.length
      ? 0
      : bottleFeeds.reduce((acc, curr) => acc + curr.amount, 0);
    let feedDuration = !nursingFeeds.length
      ? 0
      : nursingFeeds.reduce((acc, curr) => acc + curr.duration, 0);
    setTotals({
      duration: feedDuration,
      amount: feedAmt,
      wet: wetDiapers.length,
      soiled: soiledDiapers.length,
    });
  };

  function toDateStr(timestamp) {
    let value = timestamp * 1000;
    let toDate = new Date(value);
    let time = toDate.toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${time}`;
  }
  if (!currChild) return <Navigate to="/register" replace={true} />;
  return (
    <>
      <DiaperForm show={showDiaperForm} setShow={setShowDiaperForm} />
      <FeedForm show={showFeedForm} setShow={setShowFeedForm} />
      <div className="mt-4 col-11 col-xl-6 text-center">
        <h2 className="mb-4">Today's Activity</h2>
        {!feeds.length && !diapers.length ? (
          <div>
            <hr />
            <h4 className="my-3">
              Log {currChild.firstName}'s feeds and diapers to see your latest
              activity here!
            </h4>
            <hr />
          </div>
        ) : (
          <>
            <SummaryCards
              feeds={feeds}
              totals={totals}
              diapers={diapers}
              changeTable={changeTable}
            />
            {currTable === "feeds" ? (
              <FeedTable feeds={feeds} totals={totals} toDateStr={toDateStr} />
            ) : (
              <DiaperTable
                diapers={diapers}
                totals={totals}
                toDateStr={toDateStr}
              />
            )}
          </>
        )}

        <div
          className="card text-bg-primary mb-3"
          onClick={() => setShowFeedForm(true)}
        >
          <div className="card-body">
            <h5 className="card-title">Log Feed</h5>
          </div>
        </div>

        <div
          className="card text-bg-warning mb-3"
          onClick={() => setShowDiaperForm(true)}
        >
          <div className="card-body">
            <h5 className="card-title">Log Diaper</h5>
          </div>
        </div>

        <div className="card text-bg-info mb-3">
          <a className="nav-link" href="/reminders">
            <div className="card-body">
              <h5 className="card-title">Reminders</h5>
            </div>
          </a>
        </div>

        <div className="card text-bg-success mb-3">
          <a className="nav-link" href="/calendar">
            <div className="card-body">
              <h5 className="card-title">Calendar</h5>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
export default Home;
