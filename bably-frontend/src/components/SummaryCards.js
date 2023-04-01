import React from "react";

function SummaryCards({ feeds, totals, diapers, changeTable }) {
  return (
    <>
      <div className="row mb-3 px-1 text-center">
        <div
          className="col card bablyOffWhite mx-2"
          onClick={() => changeTable("feeds")}
        >
          <div className="card-body">
            <h4 className="card-title">Feeds</h4>
            <span>Total: {feeds.length}</span>
            <br />
            <span>Minutes: {totals.duration}</span>
            <br />
            <span>Ounces: {totals.amount}</span>
          </div>
        </div>
        <div
          className="col card bablyOffWhite mx-2"
          onClick={() => changeTable("diapers")}
        >
          <div className="card-body">
            <h4 className="card-title text-center">Diapers</h4>

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
