"use strict";

/** Routes for feeds. */

const jsonschema = require("jsonschema");

const Feed = require("../models/feed");
const Infant = require("../models/infant");
const Notification = require("../models/notification");
const express = require("express");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const feedNewSchema = require("../schemas/feedNew.json");
const feedUpdateSchema = require("../schemas/feedUpdate.json");
const { BadRequestError } = require("../expressError");

const router = new express.Router();

/** POST /:   { infant } => { infant }
 *
 * feed must include { firstName, dob, gender }
 *
 * Returns { id, firstName, dob, gender, publicId }
 *
 * Authorization required: none
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, feedNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    if (
      await Infant.checkAuthorized(res.locals.user.email, req.body.infant_id)
    ) {
      const feed = await Feed.add(req.body);
      return res.status(201).json({ feed });
    }
  } catch (err) {
    return next(err);
  }
});

router.get("/:infant_id/:id", ensureLoggedIn, async function (req, res, next) {
  const { infant_id, id } = req.params;
  try {
    if (await Infant.checkAuthorized(res.locals.user.email, infant_id)) {
      const feed = await Feed.get(id);
      return res.json({ feed });
    }
  } catch (err) {
    return next(err);
  }
});

router.patch(
  "/:infant_id/:feed_id",
  ensureLoggedIn,
  async function (req, res, next) {
    const { infant_id, feed_id } = req.params;
    try {
      const validator = jsonschema.validate(req.body, feedUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      if (await Infant.checkAuthorized(res.locals.user.email, infant_id)) {
        const diaper = await Feed.update(feed_id, req.body);
        return res.json({ diaper });
      }
    } catch (err) {
      return next(err);
    }
  }
);

router.delete(
  "/:infant_id/:feed_id",
  ensureLoggedIn,
  async function (req, res, next) {
    const { infant_id, feed_id } = req.params;

    try {
      if (await Infant.checkAuthorized(res.locals.user.email, infant_id)) {
        await Feed.delete(feed_id);
        return res.json({ deleted: feed_id });
      }
    } catch (err) {
      return next(err);
    }
  }
);

router.post(
  "/reminders/:email/",
  ensureCorrectUser,
  async function (req, res, next) {
    const { email } = req.params;
    const { timestamp, infant } = req.body;
    try {
      Notification.scheduleFeedReminder(timestamp, infant, email);
      return res.json({ scheduled: true });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
