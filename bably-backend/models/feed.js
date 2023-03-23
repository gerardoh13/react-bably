"use strict";

const db = require("../db");
const { ForbiddenError } = require("../expressError");
// const { NotFoundError} = require("../expressError");
// const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for feeds. */

class Feed {
  /** Register an infant (from data), update db, return new infant data.
   *
   * data should be { method, fed_at, amount, duration, infant_id }
   *
   * Returns { id, method, fed_at, amount, duration, infant_id }
   **/

  static async add(data) {
    const result = await db.query(
      `INSERT INTO feeds (method,
                        fed_at,
                        amount,
                        duration,
                        infant_id)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, method, fed_at, amount, duration, infant_id`,
      [data.method, data.fed_at, data.amount, data.duration, data.infant_id]
    );
    let feed = result.rows[0];

    return feed;
  }

  static async getTodaysFeeds(infant_id, last_midnight, next_midnight) {
    const result = await db.query(
      `SELECT id,
              method,
              fed_at,
              amount,
              duration,
              infant_id
      FROM feeds WHERE infant_id = $1 AND fed_at > $2 AND fed_at < $3`,
      [infant_id, last_midnight, next_midnight]
    );
    let feeds = result.rows;

    return feeds;
  }
}

module.exports = Feed;
