"use strict";

/** Routes for infants. */

const jsonschema = require("jsonschema");

const Infant = require("../models/infant");
const express = require("express");
const infantNewSchema = require("../schemas/infantNew.json");
const { BadRequestError } = require("../expressError");

const router = new express.Router();

/** POST /register/:userId:   { infant } => { infant }
 *
 * infant must include { firstName, dob, gender }
 *
 * Returns { id, firstName, dob, gender, publicId }
 *
 * Authorization required: none
 */

router.post("/register/:userId", async function (req, res, next) {
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
});


module.exports = router;
