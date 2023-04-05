import React, { useState, useEffect } from "react";
import * as PusherPushNotifications from "@pusher/push-notifications-web";

function PushNotifications() {
  const beamsClient = new PusherPushNotifications.Client({
    instanceId: "0c2efc77-8e04-4f45-a1ac-558892357612",
  });

  beamsClient
    .start()
    .then((beamsClient) => beamsClient.getDeviceId())
    .then((deviceId) =>
      console.log("Successfully registered with Beams. Device ID:", deviceId)
    )
    .then(() => beamsClient.addDeviceInterest("hello"))
    .then(() => beamsClient.getDeviceInterests())
    .then((interests) => console.log("Current interests:", interests))
    .catch(console.error);
}

export default PushNotifications;
