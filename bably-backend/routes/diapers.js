"use strict";

/** Routes for diapers. */

const jsonschema = require("jsonschema");

const Diaper = require("../models/diaper");
const Infant = require("../models/infant");
const express = require("express");
const { ensureLoggedIn } = require("../middleware/auth");
const diaperNewSchema = require("../schemas/diaperNew.json");
const diaperUpdateSchema = require("../schemas/diaperUpdate.json");
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

router.get("/:infant_id/:id", ensureLoggedIn, async function (req, res, next) {
  const { infant_id, id } = req.params;
  try {
    if (await Infant.checkAuthorized(res.locals.user.email, infant_id)) {
      const diaper = await Diaper.get(id);
      return res.json({ diaper });
    }
  } catch (err) {
    return next(err);
  }
});

router.patch(
  "/:infant_id/:diaper_id",
  ensureLoggedIn,
  async function (req, res, next) {
    const { infant_id, diaper_id } = req.params;
    try {
      const validator = jsonschema.validate(req.body, diaperUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      if (await Infant.checkAuthorized(res.locals.user.email, infant_id)) {
        const diaper = await Diaper.update(diaper_id, req.body);
        return res.json({ diaper });
      }
    } catch (err) {
      return next(err);
    }
  }
);

router.delete(
  "/:infant_id/:diaper_id",
  ensureLoggedIn,
  async function (req, res, next) {
    const { infant_id, diaper_id } = req.params;

    try {
      if (await Infant.checkAuthorized(res.locals.user.email, infant_id)) {
        await Diaper.delete(diaper_id);
        return res.json({ deleted: diaper_id });
      }
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
