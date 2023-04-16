"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");

const User = require("../models/user");
const Email = require("../models/email");
const express = require("express");
const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");
const { createToken, createPwdResetToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userNewSchema = require("../schemas/userNew.json");
const { BadRequestError } = require("../expressError");
const jwt = require("jsonwebtoken");
const { pushNotifications } = require("../services");

const router = new express.Router();

/** POST /auth/token:  { email, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 *         // await Email.send()

 */

router.post("/token", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const { email, password } = req.body;
    const user = await User.authenticate(email, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

router.post("/reset", async function (req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.getWithPassword(email);
    const token = createPwdResetToken(user);
    await Email.sendPwdReset(email, token);
    return res.json({ emailSent: true });
  } catch (err) {
    return next(err);
  }
});

router.post("/new-password", async function (req, res, next) {
  try {
    const { token } = req.query;
    const { email, password } = req.body;
    const user = await User.getWithPassword(email);
    const tokenUser = jwt.verify(token, user.password);
    if (user.email === tokenUser.email) {
      await User.update(email, { password: password });
      return res.json({ passwordUpdated: true });
    }
  } catch (err) {
    return next(err);
  }
});

/** POST /auth/register:   { user } => { token }
 *
 * user must include { email, password, firstName  }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const newUser = await User.register({ ...req.body });
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

/** GET /[email] => { user }
 *
 * Returns { id, email, firstName, infants }
 *   where infants is {  }
 *
 * Authorization required: same user-as-:email
 **/

router.get("/:email", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.get(req.params.email);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

router.patch(
  "/reminders/:email",
  ensureCorrectUser,
  async function (req, res, next) {
    const { email } = req.params;
    try {
      await User.updateReminders(email, req.body);
      return res.json({ updated: true });
    } catch (err) {
      return next(err);
    }
  }
);

router.get("/pusher/beams-auth", function (req, res, next) {
  const userIDInQueryParam = req.query["user_id"];
  try {
    const user = res.locals.user;
    if (!(user && user.email === userIDInQueryParam)) {
      throw new BadRequestError();
    }
    const beamsToken = pushNotifications.generateToken(userIDInQueryParam);
    return res.send(JSON.stringify(beamsToken));
  } catch (err) {
    return next(err);
  }
});

router.patch(
  "/notify-admin/:userId/:infantId",
  async function (req, res, next) {
    const { userId, infantId } = req.params;
    const { notifyAdmin } = req.body;
    try {
      const notify = await User.updateNotifications(
        notifyAdmin,
        userId,
        infantId
      );
      return res.json({ notify });
    } catch (err) {
      return next(err);
    }
  }
);

router.patch("/access/:userId/:infantId", async function (req, res, next) {
  const { userId, infantId } = req.params;
  const { crud } = req.body;
  try {
    const access = await User.updateAcess(crud, userId, infantId);
    return res.json({ access });
  } catch (err) {
    return next(err);
  }
});

router.delete("/access/:userId/:infantId", async function (req, res, next) {
  const { userId, infantId } = req.params;
  try {
    await User.removeAccess(userId, infantId);
    return res.json({ removedAccess: +userId });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
