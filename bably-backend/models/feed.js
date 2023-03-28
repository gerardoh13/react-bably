"use strict";

const db = require("../db");
const { NotFoundError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

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

  static async get(id) {
    const result = await db.query(
      `SELECT id,
              method,
              fed_at,
              amount,
              duration,
              infant_id
      FROM feeds 
      WHERE id = $1`,
      [id]
    );
    let feed = result.rows[0];

    return feed;
  }

  static async getTodays(infant_id, start, end) {
    const result = await db.query(
      `SELECT id,
              method,
              fed_at,
              amount,
              duration,
              infant_id
      FROM feeds 
      WHERE infant_id = $1 AND fed_at > $2 AND fed_at < $3
      ORDER BY fed_at DESC`,
      [infant_id, start, end]
    );
    let feeds = result.rows;

    return feeds;
  }

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE feeds
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, method, fed_at, amount, duration, infant_id`;
                      const result = await db.query(querySql, [...values, id]);
    const feed = result.rows[0];

    if (!feed) throw new NotFoundError(`No feed: ${id}`);

    return feed;
  }

  static async getEvents(infant_id, start, end) {
    const result = await db.query(
      `SELECT id,
              method,
              amount,
              duration,
              fed_at
      FROM feeds 
      WHERE infant_id = $1 AND fed_at > $2 AND fed_at < $3
      ORDER BY fed_at DESC`,
      [infant_id, start, end]
    );
    let feeds = result.rows.map((f) => this.formatEvent(f));

    return feeds;
  }
  static formatEvent(feed) {
    let title =
      feed.method === "bottle"
        ? `${feed.method} feed, ${feed.amount} oz`
        : `${feed.method}, ${feed.duration} mins`;
    let feedEvent = {
      title,
      id: `feed-${feed.id}`,
      start: feed.fed_at * 1000,
      backgroundColor: "#66bdb8",
    };
    return feedEvent;
  }
}

module.exports = Feed;
