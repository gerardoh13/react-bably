import React from "react";

function Alerts({ msgs = [], type = "danger" }) {
  return (
    <div className={`alert alert-${type}`} role="alert">
      {msgs.map((msg) => (
        <p className="mb-0 small" key={msg}>
          {msg}
        </p>
      ))}
    </div>
  );
}
export default Alerts;
