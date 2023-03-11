import { NextApiRequest, NextApiResponse } from "next";
import { undefined } from "zod";
import { db } from "@/Utils/db.server";
import { algoliaIndex } from "@/Utils/apiUtils";

export default async function deletePost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body;
  const posts = await db.post.findFirst({
    where: { id: id },
  });
  if (posts) {
    const index = await algoliaIndex();
    await db.post.delete({ where: { id: id } });
    index.deleteObject(id).wait();
    return res
      .status(200)
      .json({ success: "post sucessfully deleted", error: undefined });
  }
  return res
    .status(400)
    .json({ success: undefined, error: "post not sucessfully deleted" });
}
