import { Post } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

import { db } from "@/Utils/db.server";

type ResponseData = {
  posts: Partial<Post>;
};

export default async function fetchPost(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { id } = req.body;
  const posts = await db.post.findFirst({
    where: { id: id },
    include: {
      author: {
        select: {
          deviceID: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });

  if (posts) {
    return res.status(200).json({ posts: posts });
  }
  return res.status(400).json({ posts: {} });
}
/* {
        include: {
          author: {
            select: {
              name: true,
              id: true,
              deviceID: true,
            },
          },
        },
      },*/
