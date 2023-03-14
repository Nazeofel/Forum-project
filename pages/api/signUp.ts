import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { scryptAsync } from "@noble/hashes/scrypt";
import { db } from "@/Utils/db.server";

type ResponseData = {
  success: string | undefined;
  error: string | undefined;
  name: string | undefined;
  email: string | undefined;
};

export default async function signin(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { email, pass, name, deviceID, notifications, profilPicture } =
    req.body;
  const cryptPass = await scryptAsync(pass, "my insane salt", {
    N: 2 ** 16,
    r: 8,
    p: 1,
    dkLen: 32,
  });
  const emailTaken: User | null = await db.user.findFirst({
    where: { email: email },
  });
  const nameTaken: User | null = await db.user.findFirst({
    where: {
      name: name,
    },
  });
  if (emailTaken !== null && nameTaken !== null) {
    return res.status(400).json({
      success: undefined,
      error: undefined,
      name: "name already taken",
      email: "email already exists !",
    });
  }
  if (emailTaken !== null) {
    return res.status(400).json({
      success: undefined,
      error: undefined,
      name: undefined,
      email: "email already exists !",
    });
  }
  if (nameTaken !== null) {
    return res.status(400).json({
      success: undefined,
      error: undefined,
      name: "name already taken !",
      email: undefined,
    });
  }

  if (deviceID) {
    await db.user.create({
      data: {
        name: name,
        email: email,
        password: cryptPass.toString(),
        posts: {
          create: [],
        },
        comments: {
          create: [],
        },
        rank: "User",
        deviceID: deviceID,
        notifications: notifications,
        profilPicture: profilPicture,
      },
    });
    return res.status(200).json({
      success: "Successfully signed up ! sign in",
      error: undefined,
      name: undefined,
      email: undefined,
    });
  } else {
    return res.status(400).json({
      success: undefined,
      error: "an error occured while trying to create the account !",
      name: undefined,
      email: undefined,
    });
  }
}
