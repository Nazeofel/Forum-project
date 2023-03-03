import { fetchWrapper } from "./formUtils";
const jwt = require("jsonwebtoken");
import nookies from "nookies";
import algoliasearch from "algoliasearch";
const env = require("dotenv").config();
export async function handleApiCalls(url: string, data: any) {
  const req = await fetchWrapper(url, data);

  // display success message !

  return req;
}

export function deletePermission(authorId: number, tokenData: any) {
  let permission: boolean = false;
  if (tokenData === null) return;
  if (tokenData.id === authorId || tokenData.rank === "Admin") {
    permission = true;
    return permission;
  }
  permission = false;
  return permission;
}

export async function getTokenData(ctx: any) {
  let tokenData: any = null;
  const token = nookies.get(ctx).token || null;
  if (token) {
    const decrypt = jwt.verify(token, process.env.PRIVATE_KEY);
    tokenData = decrypt;
  }
  return tokenData;
}

export async function algoliaIndex() {
  const client = algoliasearch(env.API_KEY, env.SEARCH_ONLY_KEY);
  const index = client.initIndex("posts");
  return index;
}

export async function encodeURL(data: any): Promise<string> {
  const base64 = Buffer.from(JSON.stringify(data)).toString("base64");
  return base64;
}

export async function decodeURL(data: any): Promise<any> {
  const base64 = Buffer.from(data, "base64").toString();
  return JSON.parse(base64);
}
