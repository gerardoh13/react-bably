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

router.get(
  "/events/:infant_id/:start/:end",
  ensureLoggedIn,
  async function (req, res, next) {
    const { infant_id, start, end } = req.params;
    try {
      if (await Infant.checkAuthorized(res.locals.user.email, infant_id)){
        let events = {}
        events.feeds = await Feed.getFeedEvents(infant_id, start, end);
        events.diapers = await Diaper.getDiaperEvents(infant_id, start, end);
        return res.json({ events });
      }
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
