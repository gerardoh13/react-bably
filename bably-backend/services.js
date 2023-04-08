"use strict";
const nodemailer = require("nodemailer");
const PushNotifications = require("@pusher/push-notifications-server");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "gerardoh13@gmail.com",
    pass: "YK02S157bwAz8Nm6",
  },
});

const pushNotifications = new PushNotifications({
  instanceId: "0c2efc77-8e04-4f45-a1ac-558892357612",
  secretKey: "1C54B5C2EDF1101286012D0C0CEA11FF82592492F4ED3F10F0B346C55511EFFA",
});

module.exports = { transporter, pushNotifications };
