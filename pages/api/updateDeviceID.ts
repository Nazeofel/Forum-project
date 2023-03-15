import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/Utils/db.server";

type ResponseData = {
  userInfo: User | null;
};

export default async function updateDeviceID(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { id, deviceID } = req.body;
  const user: User | null = await db.user.findFirst({
    where: {
      id: id,
    },
  });
  if (user) {
    if (user.deviceID !== deviceID) {
      await db.user.update({
        where: {
          id: id,
        },
        data: {
          deviceID: deviceID,
        },
      });
    }
    return res.status(200).json({ userInfo: user });
  }
  return res.status(400).json({ userInfo: null });
}
