import React, { useState } from "react";

function DiaperTable({ diapers, toDateStr }) {
  const [showMore, setShowMore] = useState("d-none");

  const createRows = (arr, hidden = false) => {
    return arr.map((d) => (
      <tr key={d.id} className={hidden ? showMore : ""}>
        <td>{toDateStr(d.changed_at)}</td>
        <td>{d.type.charAt(0).toUpperCase() + d.type.substr(1)}</td>
        <td>{d.size.charAt(0).toUpperCase() + d.size.substr(1)}</td>
      </tr>
    ));
  };

  return (
    <div>
      <table className="table table-striped bg-light">
        <thead>
          <tr>
            <th scope="col">Time</th>
            <th scope="col">Type</th>
            <th scope="col">Size</th>
          </tr>
        </thead>
        <tbody id="table">
          {createRows(diapers.slice(0, 3))}
          {diapers.length > 3 ? (
            <>
              <tr
                className={showMore === "" ? "d-none" : ""}
                onClick={() => setShowMore("")}
              >
                <th scope="row">+ {diapers.slice(3).length} More</th>
                <td></td>
                <td></td>
              </tr>
              {createRows(diapers.slice(3), true)}
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

export default DiaperTable;
