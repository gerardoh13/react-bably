"use strict";
const nodemailer = require("nodemailer");
const PushNotifications = require("@pusher/push-notifications-server");
const {
  NODEMAILER_PWD,
  NODEMAILER_USER,
  BEAMS_INSTANCE_ID,
  BEAMS_SECRET_KEY,
} = require("./config");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PWD,
  },
});

const pushNotifications = new PushNotifications({
  instanceId: BEAMS_INSTANCE_ID,
  secretKey: BEAMS_SECRET_KEY,
});

module.exports = { transporter, pushNotifications };
