/* 
/deletePost 
/createPost 
/postComment
/deleteComment
/signIn
/signUp
*/

import {
  decodeURL,
  encodeURL,
  getTokenData,
  handleApiCalls,
} from "@/Utils/apiUtils";
import { tokenData } from "@/Utils/interfaces";
import type { GetServerSidePropsContext } from "next/types";
import nookies from "nookies";

type Action =
  | "delete-post"
  | "create-post"
  | "post-comment"
  | "delete-comment"
  | "update-rank"
  | "sign-in"
  | "sign-up";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const tokenData: tokenData = await getTokenData(ctx);

  let { referer } = ctx.req.headers;
  const refinedString = () => {
    if (!referer) return;
    const index = referer.indexOf("?");
    if (index === -1) return;
    const header = referer.slice(0, index);
    referer = header;
  };
  refinedString();
  const action = ctx.params?.action;
  const { id, formData, commentData } = ctx.query;
  let serverResponse: any = null;
  switch (action as Action) {
    case "delete-post":
      {
        const req = await handleApiCalls(
          "http://localhost:3000/api/deletePost",
          {
            id: parseInt(id as string, 10),
          }
        );
        if (!req) return;
        serverResponse = await encodeURL(req);
      }
      break;
    case "create-post":
      {
        if (!formData) return;
        const decodedURL = await decodeURL(formData);
        const req = await handleApiCalls(
          "http://localhost:3000/api/createPost",
          decodedURL
        );
        if (!req) return;
        serverResponse = await encodeURL(req);
      }
      break;
    case "post-comment":
      {
        if (!commentData) return;
        const decodedURL = await decodeURL(commentData);
        const req = await handleApiCalls(
          "http://localhost:3000/api/postComment",
          decodedURL
        );
        if (!req) return;
        serverResponse = await encodeURL(req);
      }
      break;
    case "delete-comment":
      {
        const req = await handleApiCalls(
          "http://localhost:3000/api/deleteComment",
          {
            id: parseInt(id as string, 10),
          }
        );
        if (!req) return;
        serverResponse = await encodeURL(req);
      }
      break;
    case "sign-up":
      {
        if (!formData) return;
        const decodedURL = await decodeURL(formData);
        const req = await handleApiCalls(
          "http://localhost:3000/api/signUp",
          decodedURL
        );
        if (!req) return;
        serverResponse = await encodeURL(req);
      }
      break;
    case "sign-in":
      {
        if (!formData) return;
        const decodedURL = await decodeURL(formData);
        const req = await handleApiCalls(
          "http://localhost:3000/api/signIn",
          decodedURL
        );
        if (!req) return;
        nookies.set(ctx, "token", req.token as string, {
          domain: undefined,
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
          secure: false,
        });
        serverResponse = await encodeURL(req);
      }
      break;
    default:
      throw new Error(`Invalid action ${action}`);
  }

  if (serverResponse !== null) {
    return {
      redirect: {
        destination: `${referer}?error=${serverResponse}`,
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}

export default function handleApi() {
  return <></>;
}
