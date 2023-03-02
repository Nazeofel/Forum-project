import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { scryptAsync } from "@noble/hashes/scrypt";
const jwt = require("jsonwebtoken");
require("dotenv").config();
import { db } from "@/Utils/db.server";

type ResponseData = {
  success?: string;
  failure?: string;
  token?: Object;
  userData?: Object;
};

export default async function SignIn(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { email, pass } = req.body;
  const cryptPass = await scryptAsync(pass, "my insane salt", {
    N: 2 ** 16,
    r: 8,
    p: 1,
    dkLen: 32,
  });
  const user: User | null = await db.user.findFirst({
    where: { email: email },
  });
  if (user === null) {
    return res.status(400).json({ failure: "the email doesn't exist !" });
  }
  if (user.password !== cryptPass.toString()) {
    return res.status(400).json({ failure: "the user doesn't exist !" });
  }
  const token = jwt.sign(
    {
      id: user.id,
      rank: user.rank,
      name: user.name,
    },
    process.env.PRIVATE_KEY,
    { algorithm: "HS256" }
  );
  return res.status(200).json({
    success: "connected successfully !",
    token: token,
    userData: {
      id: user.id,
      rank: user.rank,
      name: user.name,
    },
  });
}
