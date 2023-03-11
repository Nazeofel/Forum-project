const jwt = require("jsonwebtoken");
import nookies from "nookies";
import algoliasearch, { SearchIndex } from "algoliasearch";
import { tokenData } from "./interfaces";

export async function handleApiCalls(url: string, data: any) {
  let json;
  try {
    const req = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    });
    if (!req.ok) {
      throw new Error("failed to contact database ! contact an Admin");
    }
    json = await req.json();
  } catch (err) {
    if (err instanceof SyntaxError) {
      return console.log("There was a Syntax Error", err.message);
    }
    if (err instanceof Error) {
      return err.message;
    }
  }

  if (json) {
    return json;
  }
  return false;
}

export function deletePermission(authorId: number, tokenData: any): Boolean {
  let permission: boolean = false;
  if (tokenData === null) return false;
  if (tokenData.id === authorId || tokenData.rank === "Admin") {
    permission = true;
    return permission;
  }
  permission = false;
  return permission;
}

export async function getTokenData(ctx: any): Promise<tokenData> {
  let tokenData: any = null;
  const token = nookies.get(ctx).token || null;
  if (token) {
    const decrypt = jwt.verify(token, process.env.PRIVATE_KEY);
    tokenData = decrypt;
  }
  return tokenData;
}

export async function algoliaIndex(): Promise<SearchIndex> {
  const client = algoliasearch(
    process.env.API_KEY as string,
    process.env.SEARCH_ONLY_KEY as string
  );
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

// Fire base

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY_FMC,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN_FMC,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID_FMC,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET_FMC,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};
