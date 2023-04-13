"use strict";

const db = require("../db");
const { UnauthorizedError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

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
            infant_id,
            user_is_admin,
            crud)
            VALUES ($1, $2, $3, $4)`,
      [userId, infant.id, true, true]
    );
    return infant;
  }

  static async get(infantId, userId) {
    const infantRes = await db.query(
      `SELECT i.id,
              i.first_name AS "firstName",
              i.dob,
              i.gender,
              i.public_id AS "publicId",
              ui.user_is_admin AS "userIsAdmin",
              ui.crud
           FROM infants i JOIN users_infants ui ON i.id = ui.infant_id
           WHERE i.id = $1 AND ui.user_id = $2`,
      [infantId, userId]
    );
    const infant = infantRes.rows[0];
    if (!infant) throw new NotFoundError(`No infant: ${infantId}`);
    return infant;
  }

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
      publicId: "public_id",
    });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE infants
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, first_name AS "firstName", dob, gender, public_id AS "publicId"`;
    const result = await db.query(querySql, [...values, id]);
    const infant = result.rows[0];

    if (!infant) throw new NotFoundError(`No infant: ${id}`);

    return infant;
  }

static async getAuthorizedUsers(infantId, adminId) {
  const usersRes = await db.query(
    `SELECT u.id AS "userId",
            u.first_name as "userName",
            ui.crud
            FROM users u
            JOIN users_infants ui on u.id = ui.user_id
            WHERE ui.infant_id = $1 AND u.id != $2`, [infantId, adminId]
  )
  return usersRes.rows
}

  static async checkAuthorized(email, infantId) {
    const result = await db.query(
      `SELECT ui.infant_id,
              ui.user_id
      FROM users_infants ui
      JOIN users u ON u.id = ui.user_id
      WHERE u.email = $1 AND ui.infant_id = $2`,
      [email, infantId]
    );
    if (!result.rows[0]) throw new UnauthorizedError();
    else return true;
  }
}

module.exports = Infant;
