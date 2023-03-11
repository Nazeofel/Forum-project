import { db } from "@/Utils/db.server";
import { NextApiRequest, NextApiResponse } from "next";
import { algoliaIndex, handleApiCalls } from "@/Utils/apiUtils";
type ResponseData = {
  success: string | undefined;
  error: string | undefined;
};

export default async function postComment(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { content, postId, userId, username, receiver, date } = req.body;

  await db.comment.create({
    data: {
      content: content,
      author_id: userId,
      post_id: postId,
    },
  });
  if (res.statusCode !== 200) {
    return res.status(400).json({
      success: undefined,
      error: "An error occured while posting the comment !",
    });
  }
  try {
    const reqNotif = await handleApiCalls(
      "http://localhost:3000/api/sendNotification",
      {
        postURL: `/post/${postId}`,
        username: username,
        commentContent: content,
        receiver: receiver,
      }
    );
    if (!reqNotif.success) {
      throw new Error(
        "Failed to send a notification ! please contact an Admin."
      );
    }
    const index = await algoliaIndex();
    index.partialUpdateObject({
      comments: {
        _operation: "Increment",
        value: 1,
      },
      objectID: postId,
    });
  } catch (e) {
    if (e instanceof Error) {
      return console.log("Error :", e.message);
    }
  }
  return res
    .status(200)
    .json({ success: "Comment posted !", error: undefined });
}
