const PushNotifications = require("@pusher/push-notifications-server");
const schedule = require("node-schedule");

class Notification {
  static pushNotifications = new PushNotifications({
    instanceId: "0c2efc77-8e04-4f45-a1ac-558892357612",
    secretKey:
      "1C54B5C2EDF1101286012D0C0CEA11FF82592492F4ED3F10F0B346C55511EFFA",
  });

  static send() {
    this.pushNotifications
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

  static scheduleFeedReminder(timestamp, infant) {
    const date = new Date(timestamp);
    schedule.scheduleJob(date, () => {
      this.pushNotifications
        .publishToInterests(["hello"], {
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
