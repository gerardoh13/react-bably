"use strict";

const db = require("../db");
const { ForbiddenError } = require("../expressError");
// const { NotFoundError} = require("../expressError");
// const { sqlForPartialUpdate } = require("../helpers/sql");

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
}

module.exports = Infant;
