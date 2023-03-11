import { NextApiRequest, NextApiResponse } from "next";
import { undefined } from "zod";
import { db } from "@/Utils/db.server";
import { algoliaIndex } from "@/Utils/apiUtils";

export default async function editComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { postId, content } = req.body;
  const post = await db.post.findFirst({
    where: { id: postId },
  });
  if (post) {
    const index = await algoliaIndex();
    await db.post.update({
      where: { id: postId },
      data: {
        content: content,
      },
    });
    index.partialUpdateObject({
      content: content,
      objectID: postId,
    });
    return res
      .status(200)
      .json({ success: "post sucessfully updated", error: undefined });
  }
  return res
    .status(400)
    .json({ success: undefined, error: "post not sucessfully updated" });
}
