import * as PusherPushNotifications from "@pusher/push-notifications-web";
import BablyApi from "../api";

const BASE_URL =
  process.env.REACT_APP_BASE_URL ||
  "http://" + window.location.hostname + ":3001";

// const beamsClient = new PusherPushNotifications.Client({
//   instanceId: "0c2efc77-8e04-4f45-a1ac-558892357612",
// });

function startBeams(email) {
  if (!email || sessionStorage.getItem("beamsUser") === "denied") {
    return;
  }
  if (sessionStorage.getItem("beamsUser") !== email) {
    const beamsTokenProvider = new PusherPushNotifications.TokenProvider({
      url: `${BASE_URL}/users/pusher/beams-auth`,
      headers: {
        Authorization: `Bearer ${BablyApi.token}`,
      },
    });
    // beamsClient
    //   .start()
    //   .then(() => beamsClient.setUserId(email, beamsTokenProvider))
    //   .then(() => {
    //     console.log("Beams client started");
    //     sessionStorage.setItem("beamsUser", email);
    //   })
    //   .catch((e) => {
    //     if (
    //       e.toString() === "AbortError: Registration failed - permission denied"
    //     ) {
    //       sessionStorage.setItem("beamsUser", "denied");
    //     } else console.error(e);
    //   });
  }
}

function stopBeams() {
  // beamsClient
  //   .clearAllState()
  //   .then(() => console.log("Beams state has been cleared"))
  //   .catch((e) => console.error("Could not clear Beams state", e));
  // sessionStorage.removeItem("beamsUser");
}

export { startBeams, stopBeams };
