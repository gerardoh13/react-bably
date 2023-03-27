import React, { useState } from "react";

function FeedTable({ feeds, toDateStr }) {
  const [showMore, setShowMore] = useState("d-none");

  const createRows = (arr, hidden = false) => {
    return arr.map((f) => (
      <tr key={f.id} className={hidden ? showMore : ""}>
        <td>{toDateStr(f.fed_at)}</td>
        <td>{f.method.charAt(0).toUpperCase() + f.method.substr(1)}</td>
        <td>
          {f.method === "bottle" ? `${f.amount} oz` : `${f.duration} Mins`}
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <table className="table table-striped bg-light">
        <thead>
          <tr>
            <th scope="col">Time</th>
            <th scope="col">Method</th>
            <th scope="col">oz/Mins</th>
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
              <tr className={showMore} onClick={() => setShowMore("d-none")}>
                <th scope="row">Hide</th>
                <td></td>
                <td></td>
              </tr>
            </>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

export default FeedTable;
