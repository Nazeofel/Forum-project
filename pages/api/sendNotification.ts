import { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "google-auth-library";
import { notificationStatus } from "@/Utils/types";

export default async function sendNotification(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { postURL, username, commentContent, receiver } = req.body;
  const serviceAccount = require("../../Firebase/forum-71f19-firebase-adminsdk-w6itv-cf5fa79621.json");
  const requestBody = {
    validate_only: false,
    message: {
      token: receiver,
      data: {
        name: username,
        content: commentContent,
        date: new Date().toISOString(),
        seen: "unseen" as notificationStatus,
      },
      notification: {
        title: username,
        body: commentContent,
      },
      webpush: {
        fcm_options: {
          link: postURL,
        },
      },
    },
  };

  async function getAccessToken() {
    const key = serviceAccount;
    const jwtClient = new JWT(
      key.client_email,
      undefined,
      key.private_key,
      "https://www.googleapis.com/auth/firebase.messaging",
      undefined
    );
    const t = await jwtClient.authorize();
    if (!t) return;
    return t.access_token;
  }

  const access_token = await getAccessToken();
  const reqs = await fetch(
    `https://fcm.googleapis.com/v1/projects/forum-71f19/messages:send`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + access_token,
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!reqs.ok) {
    res.status(reqs.status).json({ error: "tghtrh" });
    return;
  }
  res.status(200).json({ success: "nice" });
}
