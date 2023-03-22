"use strict";

/** Routes for infants. */

const jsonschema = require("jsonschema");

const Infant = require("../models/infant");
const express = require("express");
// const { ensureCorrectUser } = require("../middleware/auth");
const infantNewSchema = require("../schemas/infantNew.json");
const { BadRequestError } = require("../expressError");

const router = new express.Router();

/** POST /auth/register:   { infant } => { infant }
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

/** GET /[email] => { user }
 *
 * Returns { id, email, firstName }
 *   where jobs is { id, title, companyHandle, companyName, state }
 *
 * Authorization required: same user-as-:email
 **/

// router.get("/:email", ensureCorrectUser, async function (req, res, next) {
//     try {
//       const user = await User.get(req.params.email);
//       return res.json({ user });
//     } catch (err) {
//       return next(err);
//     }
//   });

module.exports = router;
