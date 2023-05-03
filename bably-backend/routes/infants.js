"use strict";

/** Routes for infants. */

const jsonschema = require("jsonschema");

const Infant = require("../models/infant");
const User = require("../models/user");
const Feed = require("../models/feed");
const Diaper = require("../models/diaper");
const Email = require("../models/email");
const express = require("express");
const infantNewSchema = require("../schemas/infantNew.json");
const { BadRequestError, UnauthorizedError } = require("../expressError");
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

router.get("/:infantId", ensureLoggedIn, async function (req, res, next) {
  const { infantId } = req.params;
  try {
    const userAccess = await Infant.checkAuthorized(
      res.locals.user.email,
      infantId
    );
    if (userAccess) {
      const infant = await Infant.get(infantId, res.locals.user.id);
      return res.json({ infant });
    } else throw new UnauthorizedError();
  } catch (err) {
    return next(err);
  }
});

router.patch("/:infantId/", ensureLoggedIn, async function (req, res, next) {
  const { infantId } = req.params;
  try {
    const validator = jsonschema.validate(req.body, infantNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const userAccess = await Infant.checkAuthorized(
      res.locals.user.email,
      infantId
    );
    if (userAccess.userIsAdmin) {
      const infant = await Infant.update(
        infantId,
        req.body,
        res.locals.user.id
      );
      return res.json({ infant });
    } else throw new UnauthorizedError();
  } catch (err) {
    return next(err);
  }
});

router.get(
  "/events/:infantId/:start/:end",
  ensureLoggedIn,
  async function (req, res, next) {
    const { infantId, start, end } = req.params;
    try {
      const userAccess = await Infant.checkAuthorized(
        res.locals.user.email,
        infantId
      );
      if (userAccess) {
        let events = {};
        events.feeds = await Feed.getEvents(infantId, start, end);
        events.diapers = await Diaper.getEvents(infantId, start, end);
        return res.json({ events });
      } else throw new UnauthorizedError();
    } catch (err) {
      return next(err);
    }
  }
);

router.get(
  "/today/:infantId/:start/:end",
  ensureLoggedIn,
  async function (req, res, next) {
    const { infantId, start, end } = req.params;
    try {
      const userAccess = await Infant.checkAuthorized(
        res.locals.user.email,
        infantId
      );
      if (userAccess) {
        let today = {};
        today.feeds = await Feed.getTodays(infantId, start, end);
        today.diapers = await Diaper.getTodays(infantId, start, end);
        return res.json({ today });
      } else throw new UnauthorizedError();
    } catch (err) {
      return next(err);
    }
  }
);

router.get(
  "/auth-users/:infantId",
  ensureLoggedIn,
  async function (req, res, next) {
    const { infantId } = req.params;
    try {
      const userAccess = await Infant.checkAuthorized(
        res.locals.user.email,
        infantId
      );
      if (userAccess) {
        const users = await Infant.getAuthorizedUsers(
          infantId,
          res.locals.user.id
        );
        return res.json({ users });
      } else throw new UnauthorizedError();
    } catch (err) {
      return next(err);
    }
  }
);

router.post(
  "/add-user/:infantId",
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const { infantId } = req.params;
      const { sentTo, sentByName, sentById, crud, infantName } = req.body;
      const userAccess = await Infant.checkAuthorized(
        res.locals.user.email,
        infantId
      );
      if (userAccess.userIsAdmin) {
        const user = await User.checkIfRegistered(sentTo);
        let details = {};
        if (user) {
          details.recipient = user.firstName;
          details.inviteSent = false;
          // send email
          const addedtoTable = await Infant.addAuthorizedUser(
            user.id,
            infantId,
            crud
          );
          if (!addedtoTable) {
            details.previouslyAdded = true;
          }
        } else {
          await User.addInvitation(sentById, infantId, crud, sentTo);
          await Email.sendInvite(sentTo, sentByName, infantName);
          details.inviteSent = true;
        }
        return res.json({ details });
      } else throw new UnauthorizedError();
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
