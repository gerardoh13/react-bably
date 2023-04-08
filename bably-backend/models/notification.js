// const PushNotifications = require("@pusher/push-notifications-server");
const schedule = require("node-schedule");
const { pushNotifications } = require("../services");

class Notification {

  static send() {
    pushNotifications
      .publishToInterests(["hello"], {
        web: {
          notification: {
            title: "Hello",
            body: "Hello, world!",
          },
        },
      })
      .then((publishResponse) => {
        console.log("Just published:", publishResponse.publishId);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  static scheduleFeedReminder(timestamp, infant, email) {
    const date = new Date(timestamp);
    schedule.scheduleJob(date, () => {
      pushNotifications
        .publishToUsers([email], {
          web: {
            notification: {
              title: "Heads up!",
              body: `Time to feed ${infant}`,
            },
          },
        })
        .then((publishResponse) => {
          console.log("Just published:", publishResponse.publishId);
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    });
  }
}

module.exports = Notification;
