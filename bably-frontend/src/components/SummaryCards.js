import React from "react";

function SummaryCards({ feeds, totals, diapers, changeTable }) {
  return (
    <>
      <div className="row mb-3 px-1 text-center">
        <div
          className="col card text-bg-primary mx-2"
          onClick={() => changeTable("feeds")}
        >
          <div className="card-body">
            <div className="card-title">Feeds</div>
            <span>Total: {feeds.length}</span>
            <br />
            <span>Minutes: {totals.duration}</span>
            <br />
            <span>Ounces: {totals.amount}</span>
          </div>
        </div>
        <div
          className="col card text-bg-primary mx-2"
          onClick={() => changeTable("diapers")}
        >
          <div className="card-body">
            <div className="card-title text-center">Diapers</div>

            <span>Total: {diapers.length}</span>
            <br />
            <span>Wet: {totals.wet}</span>
            <br />
            <span>Soiled: {totals.soiled}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default SummaryCards;
