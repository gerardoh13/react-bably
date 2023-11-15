"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for diapers. */

class Diaper {
  /** Register an infant (from data), update db, return new infant data.
   *
   * data should be { method, fed_at, amount, duration, infant_id }
   *
   * Returns { id, method, fed_at, amount, duration, infant_id }
   **/

  static async add(data) {
    const result = await db.query(
      `INSERT INTO diapers (type,
                        size,
                        changed_at,
                        infant_id)
           VALUES ($1, $2, $3, $4)
           RETURNING id, type, size, changed_at, infant_id`,
      [data.type, data.size, data.changed_at, data.infant_id]
    );
    let diaper = result.rows[0];

    return diaper;
  }

  static async get(id) {
    const result = await db.query(
      `SELECT id,
              type,
              size,
              changed_at,
              infant_id
      FROM diapers 
      WHERE id = $1`,
      [id]
    );
    let diaper = result.rows[0];

    return diaper;
  }
  static async getTodays(infant_id, start, end) {
    const result = await db.query(
      `SELECT id,
              type,
              size,
              changed_at,
              infant_id
      FROM diapers 
      WHERE infant_id = $1 AND changed_at > $2 AND changed_at < $3
      ORDER BY changed_at DESC`,
      [infant_id, start, end]
    );
    let diapers = result.rows;

    return diapers;
  }

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE diapers
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, type, size, changed_at, infant_id`;
    const result = await db.query(querySql, [...values, id]);
    const diaper = result.rows[0];

    if (!diaper) throw new NotFoundError(`No diaper: ${id}`);

    return diaper;
  }

  static async delete(id) {
    const result = await db.query(
      `DELETE
           FROM diapers
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const diaper = result.rows[0];

    if (!diaper) throw new NotFoundError(`No diaper: ${id}`);
  }

  static async getEvents(infant_id, start, end) {
    const result = await db.query(
      `SELECT id,
              type,
              size,
              changed_at
      FROM diapers 
      WHERE infant_id = $1 AND changed_at > $2 AND changed_at < $3
      ORDER BY changed_at DESC`,
      [infant_id, start, end]
    );
    let diapers = result.rows.map((f) => this.formatEvent(f));

    return diapers;
  }
  static formatEvent(diaper) {
    let diaperEvent = {
      id: `diaper-${diaper.id}`,
      title: `${diaper.type} diaper`,
      size: diaper.size,
      start: diaper.changed_at * 1000,
    };
    return diaperEvent;
  }
}

module.exports = Diaper;
