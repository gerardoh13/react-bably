"use strict";

/** Routes for diapers. */

const jsonschema = require("jsonschema");

const Diaper = require("../models/diaper");
const Infant = require("../models/infant");
const Notification = require("../models/notification");
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
    const userAccess = await Infant.checkAuthorized(
      res.locals.user.email,
      req.body.infant_id
    );
    if (userAccess) {
      const diaper = await Diaper.add(req.body);
      if (!userAccess.userIsAdmin && userAccess.notifyAdmin){
        await Notification.sendNotification(res.locals.user.id, req.body.infant_id, "diaper")
      }
      return res.status(201).json({ diaper });
    }
  } catch (err) {
    return next(err);
  }
});

router.get("/:infant_id/:id", ensureLoggedIn, async function (req, res, next) {
  const { infant_id, id } = req.params;
  try {
    const userAccess = await Infant.checkAuthorized(
      res.locals.user.email,
      infant_id
    );
    if (userAccess.crud) {
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
      const userAccess = await Infant.checkAuthorized(
        res.locals.user.email,
        infant_id
      );
      if (userAccess.crud) {
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
      const userAccess = await Infant.checkAuthorized(
        res.locals.user.email,
        infant_id
      );
      if (userAccess.crud) {
        await Diaper.delete(diaper_id);
        return res.json({ deleted: diaper_id });
      }
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
