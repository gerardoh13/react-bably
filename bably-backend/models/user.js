"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate user with email, password.
   *
   * Returns { id, email, first_name }
   *
   * Throws UnauthorizedError if user not found or wrong password.
   **/

  static async authenticate(email, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT id,
                  email,
                  password,
                  first_name AS "firstName"
           FROM users
           WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid email/password");
  }

  /** Register user with data.
   *
   * Returns { email, first_name }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({ email, password, firstName }) {
    const duplicateCheck = await db.query(
      `SELECT email
           FROM users
           WHERE email = $1`,
      [email]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate email: ${email}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
           (email,
            password,
            first_name)
           VALUES ($1, $2, $3)
           RETURNING id, email, first_name AS "firstName"`,
      [email, hashedPassword, firstName]
    );

    const user = result.rows[0];

    return user;
  }

  /** Given a username, return data about user.
   *
   * Returns { username, first_name, last_name, is_admin, jobs }
   *   where jobs is { id, title, company_handle, company_name, state }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(email) {
    const userRes = await db.query(
      `SELECT id,
              email,
              first_name AS "firstName"
           FROM users
           WHERE email = $1`,
      [email]
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${email}`);

    const infantsRes = await db.query(
      `SELECT i.id,
              i.first_name AS "firstName",
              i.dob,
              i.gender
           FROM infants i
           WHERE i.id IN (SELECT infant_id from users_infants
            WHERE user_id = $1)`,
      [user.id]
    );

    user.infants = infantsRes.rows;

    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, password, email }
   *
   * Returns { id, email, firstName }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */

  static async update(email, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
    });
    const emailVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE email = ${emailVarIdx} 
                      RETURNING id,
                                first_name AS "firstName",
                                email`;
    const result = await db.query(querySql, [...values, email]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${email}`);

    delete user.password;
    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(email) {
    let result = await db.query(
      `DELETE
           FROM users
           WHERE email = $1
           RETURNING email`,
      [email]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${email}`);
  }
}

module.exports = User;
