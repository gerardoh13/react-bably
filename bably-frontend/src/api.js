import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 *
 */

class BablyApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${BablyApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  // ------------------USERS---------------------------
  static async login(data) {
    let res = await this.request("users/token", data, "post");
    return res.token;
  }

  static async registerUser(data) {
    let res = await this.request("users/register", data, "post");
    return res.token;
  }

  static async getCurrUser(email) {
    let res = await this.request(`users/${email}`);
    return res.user;
  }

  static async updateUser(email, data) {
    let res = await this.request(`users/${email}`, data, "patch");
    return res.user;
  }

  // ------------------INFANTS-----------------------
  static async registerInfant(userId, data) {
    let res = await this.request(`infants/register/${userId}`, data, "post");
    return res.token;
  }
  // ------------------FEEDS-----------------------
  static async addFeed(data) {
    let res = await this.request("feeds", data, "post");
    return res.feed;
  }

  static async getTodaysFeeds(infant_id, last_midnight, next_midnight) {
    let res = await this.request(
      `feeds/${infant_id}/${last_midnight}/${next_midnight}`
    );
    return res.feeds;
  }
}

export default BablyApi;
