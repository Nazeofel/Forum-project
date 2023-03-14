import { NextApiRequest, NextApiResponse } from "next";
import { addImageToBucket } from "@/Utils/blaze";

export default async function backBlaze(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = await addImageToBucket();
  if (!url) {
    return res.status(400).json({ error: "couldn't get the url !" });
  }
  return res.status(200).json({ success: url });
}
