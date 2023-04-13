const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  let payload = {
    email: user.email,
    id: user.id
  };
  return jwt.sign(payload, SECRET_KEY);
}

function createPwdResetToken(user) {
  let payload = {
    email: user.email,
  };
  return jwt.sign(payload, user.password);
}
module.exports = { createToken, createPwdResetToken };
