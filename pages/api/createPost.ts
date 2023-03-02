import { NextApiRequest, NextApiResponse } from "next";
require("dotenv").config();
import { db } from "@/Utils/db.server";
import { algoliaIndex } from "@/Utils/apiUtils";
export default async function createPost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { content, title, id, tags } = req.body;
  const parsedInt = parseInt(id, 10);
  const user = db.user.findFirst({
    where: {
      id: parsedInt,
    },
  });
  if (user === null) {
    return res.status(400).json({ success: undefined });
  }
  const index = await algoliaIndex();
  const c = await db.post.create({
    data: {
      content: content,
      name: title,
      authorId: parsedInt,
      tags: tags.split(" ").filter((el: any) => el !== ""),
      comments: {
        create: [],
      },
    },
  });

  index.saveObject({ ...c, objectID: c.id }).wait();

  return res
    .status(200)
    .json({ success: "Post created successfully !", id: c.id });
}
