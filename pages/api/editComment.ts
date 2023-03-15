import { NextApiRequest, NextApiResponse } from "next";
import { undefined } from "zod";
import { db } from "@/Utils/db.server";

export default async function editComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { commentId, text } = req.body;
  const comment = await db.comment.findFirst({
    where: { id: commentId },
  });

  const updateComment = await db.comment.update({
    where: { id: commentId },
    data: {
      content: text,
    },
  });

  if (!comment || !updateComment) {
    return res
      .status(400)
      .json({ success: undefined, error: "comment not sucessfully updated" });
  }

  return res
    .status(200)
    .json({ success: "comment sucessfully updated", error: undefined });
}
