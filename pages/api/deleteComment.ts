import { NextApiRequest, NextApiResponse } from "next";
import { undefined } from "zod";
import { db } from "@/Utils/db.server";
import { algoliaIndex } from "@/Utils/apiUtils";

export default async function deleteComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { postId, id } = req.body;
  const posts = await db.comment.findFirst({
    where: { id: id },
  });
  if (posts) {
    await db.comment.delete({ where: { id: id } });
    const index = await algoliaIndex();
    index.partialUpdateObject({
      comments: {
        _operation: "Decrement",
        value: 1,
      },
      objectID: postId,
    });
    return res
      .status(200)
      .json({ success: "comment sucessfully deleted", error: undefined });
  }
  return res
    .status(400)
    .json({ success: undefined, error: "comment not sucessfully deleted" });
}
