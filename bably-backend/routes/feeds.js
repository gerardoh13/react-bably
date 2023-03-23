"use strict";

/** Routes for feeds. */

const jsonschema = require("jsonschema");

const Feed = require("../models/feed");
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

    const feed = await Feed.add(req.body);
    return res.status(201).json({ feed });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
