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
      const { lastMidnight, nextMidnight } = getMidnights();
      const todaysData = await BablyApi.getTodaysData(
        currChild.id,
        lastMidnight,
        nextMidnight
      );
      setFeeds(todaysData.feeds);
      setDiapers(todaysData.diapers);
      updateFeedCard(todaysData.feeds);
      updateDiaperCard(todaysData.diapers);
    };
    if (currChild) getActivity();
  }, [currChild]);

  const getMidnights = () => {
    let midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    let lastMidnight = midnight.getTime() / 1000;
    midnight.setDate(midnight.getDate() + 1);
    let nextMidnight = midnight.getTime() / 1000;
    return { lastMidnight, nextMidnight };
  };

  const changeTable = (val) => {
    if (currTable === val) return;
    else setCurrTable(val);
  };

  const addFeed = async (feed) => {
    let newFeed = await BablyApi.addFeed(feed);
    const { lastMidnight, nextMidnight } = getMidnights();
    let dateTime = parseInt(newFeed.fed_at);
    if (dateTime > lastMidnight && dateTime < nextMidnight) {
      pushAndSortFeeds(newFeed);
    }
  };

  const pushAndSortFeeds = (newFeed) => {
    let feedsCopy = [...feeds];
    feedsCopy.push(newFeed);
    feedsCopy.sort((a, b) => b.fed_at - a.fed_at);
    setFeeds(feedsCopy);
    updateFeedCard(feedsCopy);
  };

  const updateFeedCard = (todaysFeeds) => {
    const bottleFeeds = todaysFeeds.filter((f) => f.method === "bottle");
    const nursingFeeds = todaysFeeds.filter((f) => f.method === "nursing");
    let feedAmt = !bottleFeeds.length
      ? 0
      : bottleFeeds.reduce((acc, curr) => acc + curr.amount, 0);
    let feedDuration = !nursingFeeds.length
      ? 0
      : nursingFeeds.reduce((acc, curr) => acc + curr.duration, 0);
    setTotals((data) => ({
      ...data,
      duration: feedDuration,
      amount: feedAmt,
    }));
  };

  const addDiaper = async (diaper) => {
    let newDiaper = await BablyApi.addDiaper(diaper);
    const { lastMidnight, nextMidnight } = getMidnights();
    let dateTime = parseInt(newDiaper.changed_at);
    if (dateTime > lastMidnight && dateTime < nextMidnight) {
      pushAndSortDiapers(newDiaper);
    }
  };

  const pushAndSortDiapers = (newDiaper) => {
    let diapersCopy = [...diapers];
    diapersCopy.push(newDiaper);
    diapersCopy.sort((a, b) => b.changed_at - a.changed_at);
    setDiapers(diapersCopy);
    updateDiaperCard(diapersCopy);
  };

  const updateDiaperCard = (todaysDiapers) => {
    const wetDiapers = todaysDiapers.filter((f) => f.type !== "soiled");
    const soiledDiapers = todaysDiapers.filter((f) => f.type !== "wet");
    setTotals((data) => ({
      ...data,
      wet: wetDiapers.length,
      soiled: soiledDiapers.length,
    }));
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
      <DiaperForm
        show={showDiaperForm}
        setShow={setShowDiaperForm}
        submit={addDiaper}
      />
      <FeedForm
        show={showFeedForm}
        setShow={setShowFeedForm}
        submit={addFeed}
      />
      <div className="mt-3 col-11 col-xl-6 text-center">
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
            {currTable === "feeds" && feeds.length ? (
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
