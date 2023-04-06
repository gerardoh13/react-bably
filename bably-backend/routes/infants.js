"use strict";

/** Routes for infants. */

const jsonschema = require("jsonschema");

const Infant = require("../models/infant");
const Feed = require("../models/feed");
const Diaper = require("../models/diaper");
const express = require("express");
const infantNewSchema = require("../schemas/infantNew.json");
const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const router = new express.Router();

/** POST /register/:userId:   { infant } => { infant }
 *
 * infant must include { firstName, dob, gender }
 *
 * Returns { id, firstName, dob, gender, publicId }
 *
 * Authorization required: none
 */

router.post(
  "/register/:userId",
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, infantNewSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      const infant = await Infant.register(req.body, req.params.userId);
      return res.status(201).json({ infant });
    } catch (err) {
      return next(err);
    }
  }
);

router.get("/:infant_id", ensureLoggedIn, async function (req, res, next) {
  const { infant_id } = req.params;
  try {
    if (await Infant.checkAuthorized(res.locals.user.email, infant_id)) {
      const infant = await Infant.get(infant_id);
      return res.json({ infant });
    }
  } catch (err) {
    return next(err);
  }
});

router.patch("/:infant_id/", ensureLoggedIn, async function (req, res, next) {
  const { infant_id } = req.params;
  try {
    const validator = jsonschema.validate(req.body, infantNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    if (await Infant.checkAuthorized(res.locals.user.email, infant_id)) {
      const infant = await Infant.update(infant_id, req.body);
      return res.json({ infant });
    }
  } catch (err) {
    return next(err);
  }
});

router.get(
  "/events/:infant_id/:start/:end",
  ensureLoggedIn,
  async function (req, res, next) {
    const { infant_id, start, end } = req.params;
    try {
      if (await Infant.checkAuthorized(res.locals.user.email, infant_id)) {
        let events = {};
        events.feeds = await Feed.getEvents(infant_id, start, end);
        events.diapers = await Diaper.getEvents(infant_id, start, end);
        return res.json({ events });
      }
    } catch (err) {
      return next(err);
    }
  }
);

router.get(
  "/today/:infant_id/:start/:end",
  ensureLoggedIn,
  async function (req, res, next) {
    const { infant_id, start, end } = req.params;
    try {
      if (await Infant.checkAuthorized(res.locals.user.email, infant_id)) {
        let today = {};
        today.feeds = await Feed.getTodays(infant_id, start, end);
        today.diapers = await Diaper.getTodays(infant_id, start, end);
        return res.json({ today });
      }
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
