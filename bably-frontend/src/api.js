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

  static async resetPwd(token, data) {
    let res = await this.request(
      `users/new-password?token=${token}`,
      data,
      "post"
    );
    return res;
  }

  static async requestPwdReset(data) {
    let res = await this.request("users/reset", data, "post");
    return res;
  }

  static async updateReminders(email, data) {
    let res = await this.request(`users/reminders/${email}`, data, "patch");
    return res;
  }

  // static async updateUser(email, data) {
  //   let res = await this.request(`users/${email}`, data, "patch");
  //   return res.user;
  // }

  // ------------------INFANTS-----------------------
  static async registerInfant(userId, data) {
    let res = await this.request(`infants/register/${userId}`, data, "post");
    return res.infant;
  }

  static async getCurrChild(id) {
    let res = await this.request(`infants/${id}`);
    return res.infant;
  }

  static async getTodaysData(infant_id, start, end) {
    let res = await this.request(`infants/today/${infant_id}/${start}/${end}`);
    return res.today;
  }

  static async updateInfant(infant_id, data) {
    let res = await this.request(`infants/${infant_id}`, data, "patch");
    return res.infant;
  }
  
  static async addUser(infant_id, data) {
    let res = await this.request(`infants/add-user/${infant_id}`, data, "post");
    return res.details;
  }

  static async getAuthorizedUsers(infant_id) {
    let res = await this.request(`infants/auth-users/${infant_id}`);
    return res.users;
  }
  // ------------------FEEDS-----------------------
  static async addFeed(data) {
    let res = await this.request("feeds", data, "post");
    return res.feed;
  }

  static async getFeed(infant_id, feed_id) {
    let res = await this.request(`feeds/${infant_id}/${feed_id}`);
    return res.feed;
  }

  static async updateFeed(infant_id, feed_id, data) {
    let res = await this.request(
      `feeds/${infant_id}/${feed_id}`,
      data,
      "patch"
    );
    return res.feed;
  }

  static async deleteFeed(infant_id, feed_id) {
    let res = await this.request(`feeds/${infant_id}/${feed_id}`, {}, "delete");
    return res;
  }

  static async scheduleReminder(email, data) {
    let res = await this.request(`feeds/reminders/${email}`, data, "post");
    return res;
  }
  // ------------------DIAPERS-----------------------
  static async addDiaper(data) {
    let res = await this.request("diapers", data, "post");
    return res.diaper;
  }

  static async getDiaper(infant_id, diaper_id) {
    let res = await this.request(`diapers/${infant_id}/${diaper_id}`);
    return res.diaper;
  }

  static async updateDiaper(infant_id, diaper_id, data) {
    let res = await this.request(
      `diapers/${infant_id}/${diaper_id}`,
      data,
      "patch"
    );
    return res.diaper;
  }

  static async deleteDiaper(infant_id, diaper_id) {
    let res = await this.request(
      `diapers/${infant_id}/${diaper_id}`,
      {},
      "delete"
    );
    return res;
  }
  // ------------------EVENTS-----------------------
  static async getEvents(infant_id, start, end) {
    let res = await this.request(`infants/events/${infant_id}/${start}/${end}`);
    return res.events;
  }
}

export default BablyApi;
