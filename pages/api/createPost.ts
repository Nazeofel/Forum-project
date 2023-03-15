import { NextApiRequest, NextApiResponse } from "next";
require("dotenv").config();
import { db } from "@/Utils/db.server";
import { algoliaIndex } from "@/Utils/apiUtils";
import { User } from "@prisma/client";
export default async function createPost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { content, title, id, tags } = req.body;
  const parsedInt = parseInt(id, 10);
  const user: User | null = await db.user.findFirst({
    where: {
      id: parsedInt,
    },
  });
  const createPost = await db.post.create({
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
  if (!user || !createPost) {
    return res.status(400).json({
      success: undefined,
      error: "an error occured while trying to create the post !",
    });
  }
  const index = await algoliaIndex();
  index
    .saveObject({
      ...createPost,
      comments: 0,
      author: {
        name: user.name,
      },
      objectID: createPost.id,
    })
    .wait();
  return res.status(200).json({
    success: "Post created successfully !",
    error: undefined,
    id: createPost.id,
  });
}
