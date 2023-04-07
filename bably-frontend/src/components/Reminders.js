import React, { useState } from "react";
import Alerts from "../common/Alerts";

function Reminders({ reminders, update }) {
  const [formData, setFormData] = useState({
    hours: reminders.hours,
    minutes: reminders.minutes,
    cutoff: reminders.cutoff,
    start: reminders.start,
  });
  const [enabled, setEnabled] = useState(reminders.enabled);
  const [cutoffEnabled, setCutoffEnabled] = useState(reminders.cutoffEnabled);
  const [msgs, setMsgs] = useState([]);
  const [errs, setErrs] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsgs([]);
    setErrs([]);
    const validTime = validateTime();
    const validStartCutoff = validateStartCutoff();
    if (!validTime || !validStartCutoff) return;
    let updatedReminders = structuredClone(formData);
    updatedReminders.enabled = enabled;
    updatedReminders.cutoffEnabled = cutoffEnabled;
    let res = await update(updatedReminders);
    if (res.updated) setMsgs(["Reminder settings updated!"]);
  };

  const validateTime = () => {
    if (!enabled) return true;
    let time = parseInt(formData.hours) + parseInt(formData.minutes);
    if (time === 0) setErrs(["If enabled, 'Remind After' time can't be 0"]);
    return time > 0;
  };

  const validateStartCutoff = () => {
    const startDate = getDate(formData.start);
    const cutoffDate = getDate(formData.cutoff);
    if (startDate >= cutoffDate)
      setErrs((prev) => [...prev, "Start time must be before cutoff"]);
    return startDate < cutoffDate;
  };

  const getDate = (time) => {
    let date = new Date();
    const [hrs, mins] = time.split(":").map((t) => parseInt(t));
    date.setHours(hrs, mins, 0);
    return date;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleSwitch = (e) => {
    const { name } = e.target;
    if (name === "enabled") setEnabled((prev) => !prev);
    if (name === "cutoffEnabled") setCutoffEnabled((prev) => !prev);
  };

  return (
    <form onSubmit={handleSubmit}>
      {msgs.length ? <Alerts msgs={msgs} type="primary" /> : null}
      {errs.length ? <Alerts msgs={errs} /> : null}

      <div className="row mt-3">
        <p>
          If enabled, you will receive a push notification after each feed after
          a specified time
        </p>
        <div className="col-6 text-start">
          <p>Enabled</p>
        </div>
        <div className="col-6 form-check form-switch">
          <input
            className="form-check-input lgSwitch "
            type="checkbox"
            role="switch"
            name="enabled"
            checked={enabled}
            onChange={handleSwitch}
          />
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-6 text-start">
          <br />
          <p>Remind After</p>
        </div>
        <div className="col-6">
          <div className="row">
            <div className="col pe-1">
              <span>Hours</span>
              <select
                name="hours"
                className="form-select"
                value={formData.hours}
                onChange={handleChange}
                disabled={!enabled}
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <div className="col ps-1">
              <span>Mins</span>
              <select
                name="minutes"
                className="form-select"
                value={formData.minutes}
                onChange={handleChange}
                disabled={!enabled}
              >
                <option value="0">0</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3">Enable cutoff to stop notifications at night</p>
      <div className="row mt-2">
        <div className="col-6 text-start">
          <p>Cutoff Enabled</p>
        </div>
        <div className="col-6 form-check form-switch">
          <input
            className="form-check-input lgSwitch"
            type="checkbox"
            role="switch"
            name="cutoffEnabled"
            checked={cutoffEnabled}
            onChange={handleSwitch}
            disabled={!enabled}
          />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col text-start">
          <label htmlFor="start">Start Time</label>
          <p>Notifications start at:</p>
        </div>
        <div className="col">
          <input
            className="form-control"
            type="time"
            name="start"
            id="start"
            value={formData.start}
            onChange={handleChange}
            disabled={!cutoffEnabled || !enabled}
          />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col text-start">
          <label htmlFor="cutoff">Cutoff Time</label>
          <p>No notifications after:</p>
        </div>
        <div className="col">
          <input
            className="form-control"
            type="time"
            name="cutoff"
            id="cutoff"
            value={formData.cutoff}
            onChange={handleChange}
            disabled={!cutoffEnabled || !enabled}
          />
        </div>
      </div>
      <button className="btn btn-success btn-lg form-control mt-3">Save</button>
    </form>
  );
}

export default Reminders;
