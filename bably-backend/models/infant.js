"use strict";

const db = require("../db");
const { UnauthorizedError } = require("../expressError");

/** Related functions for infants. */

class Infant {
  /** Register an infant (from data), update db, return new infant data.
   *
   * data should be { firstName, dob, gender, publicId }
   *
   * Returns { id, firstName, dob, gender, publicId }
   **/

  static async register(data, userId) {
    const result = await db.query(
      `INSERT INTO infants (first_name,
                             dob,
                             gender,
                             public_id)
           VALUES ($1, $2, $3, $4)
           RETURNING id, first_name AS "firstName", dob, gender, public_id AS "publicId"`,
      [data.firstName, data.dob, data.gender, data.publicId]
    );
    let infant = result.rows[0];

    await db.query(
      `INSERT INTO users_infants 
            (user_id,
            infant_id)
            VALUES ($1, $2)`,
      [userId, infant.id]
    );
    return infant;
  }

  static async get(infant_id) {
    const infantRes = await db.query(
      `SELECT id,
              first_name AS "firstName",
              dob,
              gender,
              public_id AS "publicId"
           FROM infants
           WHERE id = $1`,
      [infant_id]
    );
    const infant = infantRes.rows[0];
    if (!infant) throw new NotFoundError(`No infant: ${infant_id}`);
    return infant;
  }

  static async checkAuthorized(email, infant_id) {
    const result = await db.query(
      `SELECT ui.infant_id,
              ui.user_id
      FROM users_infants ui
      JOIN users u ON u.id = ui.user_id
      WHERE u.email = $1 AND ui.infant_id = $2`,
      [email, infant_id]
    );
    if (result.rows[0]) return true;
    else throw new UnauthorizedError();
  }
}

module.exports = Infant;
