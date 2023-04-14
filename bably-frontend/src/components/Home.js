import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserContext from "../users/UserContext";
import BablyApi from "../api";
import DiaperForm from "../common/DiaperForm";
import FeedForm from "../common/FeedForm";
import FeedTable from "./FeedTable";
import SummaryCards from "./SummaryCards";
import DiaperTable from "./DiaperTable";
import { startBeams } from "../common/PushNotifications";
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
  const { currChild, currUser } = useContext(UserContext);

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
     getActivity();
  }, [currChild.id]);

  useEffect(() => {
    if (diapers.length && !feeds.length) setCurrTable("diapers");
    if (feeds.length && !diapers.length) setCurrTable("feeds");
  }, [feeds, diapers]);

  useEffect(() => {
    startBeams(currUser.email)
  }, [currUser.email]);

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
    let newFeedTime = parseInt(newFeed.fed_at);
    if (newFeedTime > lastMidnight && newFeedTime < nextMidnight) {
      let latestFeedTime = feeds.length ? feeds[0].fed_at : 0;
      handleNotifications(newFeedTime, latestFeedTime);
      pushAndSortFeeds(newFeed);
    }
  };

  const handleNotifications = async (newFeedTime, latestFeedTime) => {
    const { enabled, hours, minutes, cutoffEnabled, start, cutoff } =
      currUser.reminders;
    // if feed is not the latest feed, do nothing
    if (newFeedTime < latestFeedTime) return;
    // if reminders are disabled, do nothing
    if (!enabled) return;
    let now = new Date();
    let futureTime = (hours * 60 + minutes) * 60;
    let futureDate = new Date((newFeedTime + futureTime) * 1000);
    // if future reminder date already passed, do nothing
    if (futureDate.getTime() < now.getTime()) return;
    if (cutoffEnabled) {
      const [startHours, startMins] = start.split(":").map((t) => parseInt(t));
      const [endHours, endMins] = cutoff.split(":").map((t) => parseInt(t));
      const startTime = startHours * 60 + startMins;
      const endTime = endHours * 60 + endMins;
      const futureMins = futureDate.getHours() * 60 + futureDate.getMinutes();
      // if cutoff is enabled and reminder falls after cutoff or before start, do nothing
      if (futureMins >= endTime || futureMins <= startTime) return;
    }
    console.log("set reminder at", futureDate.toLocaleString());
    let res = await BablyApi.scheduleReminder(currUser.email, {
      timestamp: futureDate.getTime(),
      infant: currChild.firstName,
    });
    console.log(res);
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
    const wetDiapers = todaysDiapers.filter(
      (f) => f.type === "wet" || f.type === "mixed"
    );
    const soiledDiapers = todaysDiapers.filter(
      (f) => f.type === "soiled" || f.type === "mixed"
    );
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
      <div className="my-auto col-11 col-md-6 col-xxl-5 text-center text-light">
        <h1 className="my-4">
          {currChild.firstName}
          {currChild.firstName.endsWith("s") ? "'" : "'s"} Daily Activity
        </h1>
        {!feeds.length && !diapers.length ? (
          <div>
            <hr />
            <h4 className="my-3 text-light">
              Log {currChild.firstName}
              {currChild.firstName.endsWith("s") ? "'" : "'s"} feeds and diapers
              to see {currChild.gender === "male" ? "his" : "her"} latest
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
            ) : currTable === "diapers" && diapers.length ? (
              <DiaperTable
                diapers={diapers}
                totals={totals}
                toDateStr={toDateStr}
              />
            ) : (
              <h4 className="my-3 text-light">
                Log {currChild.firstName}
                {currChild.firstName.endsWith("s") ? "'" : "'s"} {currTable} to
                see {currChild.gender === "male" ? "his" : "her"} latest
                activity here!
              </h4>
            )}
          </>
        )}

        <div
          className="card bablyGrey text-light mb-3 pointer"
          onClick={() => setShowFeedForm(true)}
        >
          <div className="card-body">
            <h5 className="card-title">Log Feed</h5>
          </div>
        </div>

        <div
          className="card bablyBlue text-light mb-3 pointer"
          onClick={() => setShowDiaperForm(true)}
        >
          <div className="card-body">
            <h5 className="card-title">Log Diaper</h5>
          </div>
        </div>

        <div className="card bablyGreen text-light mb-3">
          <Link className="nav-link" to="/settings">
            <div className="card-body">
              <h5 className="card-title">Settings</h5>
            </div>
          </Link>
        </div>

        <div className="card bablyColor text-light mb-3">
          <Link className="nav-link" to="/calendar">
            <div className="card-body">
              <h5 className="card-title">Calendar</h5>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
export default Home;
