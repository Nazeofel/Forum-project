import { Post } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/Utils/db.server";

type ResponseData = {
  posts: Array<Post>;
};

export default async function fetchPosts(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const posts = await db.post.findMany({
    include: {
      author: {
        select: {
          name: true,
        },
      },

      comments: true,
    },
  });
  if (posts.length > 0) {
    return res.status(200).json({ posts: posts });
  }
  return res.status(400).json({ posts: [] });
}
