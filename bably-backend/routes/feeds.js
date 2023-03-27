"use strict";

/** Routes for feeds. */

const jsonschema = require("jsonschema");

const Feed = require("../models/feed");
const Infant = require("../models/infant");
const express = require("express");
const { ensureLoggedIn } = require("../middleware/auth");
const feedNewSchema = require("../schemas/feedNew.json");
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

router.get(
  "/:infant_id/:start/:end",
  ensureLoggedIn,
  async function (req, res, next) {
    const { infant_id, start, end } = req.params;
    try {
      if (await Infant.checkAuthorized(res.locals.user.email, infant_id)) {
        const feeds = await Feed.getTodaysFeeds(infant_id, start, end);
        return res.json({ feeds });
      }
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
