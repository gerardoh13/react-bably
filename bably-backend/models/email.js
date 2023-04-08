"use strict";
const { transporter } = require("../services");

class Email {
  // static transporter = nodemailer.createTransport({
  //   // host: "smtp.ethereal.email",
  //   host: "smtp-relay.sendinblue.com",
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: "gerardoh13@gmail.com",
  //     pass: "YK02S157bwAz8Nm6",
  //   },
  // });
  static async sendPwdReset(email, token) {
    let info = await transporter.sendMail({
      from: '"Bably Team" <donotreply@bably.com>', // sender address
      to: email, // list of receivers
      subject: "Reset your Bably password", // Subject line
      //   text: "Hello from bably team!", // plain text body
      html: `<div style="text-align: center;">
      <h1>Forgot your Password? We've got you covered.</h1>
      <h3>follow the link below to reset your password</h3>
      <a href="http://localhost:3000/reset?token=${token}">reset password</a>
      </div>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
  }
}

module.exports = Email;
