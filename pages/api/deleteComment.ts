import { NextApiRequest, NextApiResponse } from "next";
import { undefined } from "zod";
import { db } from "@/Utils/db.server";

export default async function deleteComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body;
  const posts = await db.comment.findFirst({
    where: { id: id },
  });
  if (posts) {
    await db.comment.delete({ where: { id: id } });
    return res
      .status(200)
      .json({ success: "comment sucessfully deleted", error: undefined });
  }
  return res
    .status(400)
    .json({ success: undefined, error: "comment not sucessfully deleted" });
}
