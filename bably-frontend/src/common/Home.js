import React, { useContext, useState } from "react";
import UserContext from "../users/UserContext";

function Home() {
  const [feeds, setFeeds] = useState([]);
  let { currChild } = useContext(UserContext);

  return (
    <div className="mt-4 col-11 col-xl-6 text-center">
      <h2>Today's Feeds</h2>
      {feeds.length ? (
        <div>
          <div className="row mb-3">
            <div className="col">
              <div className="card text-bg-primary">
                <div className="card-body">
                  <h2 id="bottleCount" className="card-title"></h2>
                </div>
                <div className="card-footer">
                  <p>Total oz</p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card text-bg-primary">
                <div className="card-body">
                  <h2 id="nursingCount" className="card-title"></h2>
                </div>
                <div className="card-footer">
                  <p>Nursing Feeds</p>
                </div>
              </div>
            </div>
          </div>
          <table className="table table-striped text-start">
            <thead>
              <tr>
                <th scope="col">Date/Time</th>
                <th scope="col">Method</th>
                <th scope="col">oz/mins</th>
              </tr>
            </thead>
            <tbody id="table"></tbody>
          </table>
        </div>
      ) : null}

      {!feeds.length ? (<div>
        <hr />
        <h4 className="my-3">
          Log {currChild.firstName}'s feeds to see your latest activity here!
        </h4>
        <hr />
      </div>) : null}

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
