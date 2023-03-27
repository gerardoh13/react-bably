"use strict";

/** Routes for diapers. */

const jsonschema = require("jsonschema");

const Diaper = require("../models/diaper");
const Infant = require("../models/infant");
const express = require("express");
const { ensureLoggedIn } = require("../middleware/auth");
const diaperNewSchema = require("../schemas/diaperNew.json");
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
    const validator = jsonschema.validate(req.body, diaperNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    if (
      await Infant.checkAuthorized(res.locals.user.email, req.body.infant_id)
    ) {
      const diaper = await Diaper.add(req.body);
      return res.status(201).json({ diaper });
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
        const diapers = await Diaper.getTodaysDiapers(infant_id, start, end);
        return res.json({ diapers });
      }
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
