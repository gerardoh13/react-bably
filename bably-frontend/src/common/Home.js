import React, { useContext, useState, useEffect } from "react";
import UserContext from "../users/UserContext";
import BablyApi from "../api";

function Home() {
  const [feeds, setFeeds] = useState([]);
  const [showMore, setShowMore] = useState("d-none");
  const [totals, setTotals] = useState({
    amount: 0,
    duration: 0,
  });
  let { currChild } = useContext(UserContext);

  useEffect(() => {
    const getFeeds = async () => {
      const { last_midnight, next_midnight } = getMidnights();
      let todaysFeeds = await BablyApi.getTodaysFeeds(
        currChild.id,
        last_midnight,
        next_midnight
      );
      setFeeds(todaysFeeds);
      updateCards(todaysFeeds);
    };
    getFeeds();
  }, [currChild]);

  const getMidnights = () => {
    let midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    let last_midnight = midnight.getTime() / 1000;
    midnight.setDate(midnight.getDate() + 1);
    let next_midnight = midnight.getTime() / 1000;
    return { last_midnight, next_midnight };
  };

  const updateCards = (todaysFeeds) => {
    const bottleFeeds = todaysFeeds.filter((f) => f.method === "bottle");
    const nursingFeeds = todaysFeeds.filter((f) => f.method === "nursing");
    let feedAmt = !bottleFeeds.length
      ? 0
      : bottleFeeds.reduce((acc, curr) => acc + curr.amount, 0);
    let feedDuration = !nursingFeeds.length
      ? 0
      : nursingFeeds.reduce((acc, curr) => acc + curr.duration, 0);
    setTotals({ duration: feedDuration, amount: feedAmt });
  };

  const createRows = (arr, hidden = false) => {
    return arr.map((f) => (
      <tr key={f.id} className={hidden ? showMore : ""}>
        <td>{toDateStr(f.fed_at)}</td>
        <td>{f.method}</td>
        <td>
          {f.method === "bottle" ? `${f.amount} oz` : `${f.duration} mins`}
        </td>
      </tr>
    ));
  };

  function toDateStr(timestamp) {
    let value = timestamp * 1000;
    let toDate = new Date(value);
    let date = toDate.toLocaleDateString();
    let time = toDate.toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${date} ${time}`;
  }

  return (
    <div className="mt-4 col-11 col-xl-6 text-center">
      <h2>Today's Feeds</h2>
      {feeds.length ? (
        <div>
          <div className="row mb-3">
            <div className="col">
              <div className="card text-bg-primary">
                <div className="card-body">
                  <h2 id="bottleCount" className="card-title">
                    {totals.amount}
                  </h2>
                </div>
                <div className="card-footer">
                  <p>
                    Total <br className="d-block d-sm-none" /> Oz
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card text-bg-primary">
                <div className="card-body">
                  <h2 id="nursingCount" className="card-title">
                    {totals.duration}
                  </h2>
                </div>
                <div className="card-footer">
                  <p>Nursing Mins</p>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="card text-bg-primary">
                <div className="card-body">
                  <h2 id="nursingCount" className="card-title">
                    {feeds.length}
                  </h2>
                </div>
                <div className="card-footer">
                  <p>Total Feeds</p>
                </div>
              </div>
            </div>
          </div>
          <table className="table table-striped text-start bg-light">
            <thead>
              <tr>
                <th scope="col">Date and Time</th>
                <th scope="col">Method</th>
                <th scope="col">Oz/Mins</th>
              </tr>
            </thead>
            <tbody id="table">
              {createRows(feeds.slice(0, 3))}
              {feeds.length > 3 ? (
                <>
                  <tr
                    className={showMore === "" ? "d-none" : ""}
                    onClick={() => setShowMore("")}
                  >
                    <th scope="row">+ {feeds.slice(3).length} More</th>
                    <td></td>
                    <td></td>
                  </tr>
                  {createRows(feeds.slice(3), true)}
                  <tr
                    className={showMore}
                    onClick={() => setShowMore("d-none")}
                  >
                    <th scope="row">Hide</th>
                    <td></td>
                    <td></td>
                  </tr>
                </>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}

      {!feeds.length ? (
        <div>
          <hr />
          <h4 className="my-3">
            Log {currChild.firstName}'s feeds to see your latest activity here!
          </h4>
          <hr />
        </div>
      ) : null}

      <div className="card text-bg-primary mb-3">
        <a className="nav-link" href="/feeds">
          <div className="card-body">
            <h5 className="card-title">Log Feed</h5>
          </div>
        </a>
      </div>

      {/* <div className="card text-bg-success mb-3">
  <a className="cardLink" href="/diapers">
    <div className="card-body">
      <h5 className="card-title">Diaper</h5>
    </div>
  </a>
</div> */}

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
  );
}
export default Home;
