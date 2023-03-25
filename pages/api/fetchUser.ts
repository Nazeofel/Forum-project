import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/Utils/db.server";

export default async function fetchUser(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { name, token } = req.body;
  const user = await db.user.findFirst({
    where: {
      name: {
        startsWith: name,
        endsWith: name,
        mode: "insensitive",
      },
    },
    include: {
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
      posts: true,
    },
  });
  if (!user) {
    return res.status(400).json({ userInfos: user });
  }
  return res.status(200).json({ userInfos: user, token: token });
}
