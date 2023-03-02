import { db } from "@/Utils/db.server";
import { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  success: string | undefined;
  error: string | undefined;
};

export default async function postComment(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { content, postId, userId } = req.body;

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
  return res
    .status(200)
    .json({ success: "Comment posted !", error: undefined });
}
