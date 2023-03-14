import { decodeURL, encodeURL, handleApiCalls } from "@/Utils/apiUtils";
import { Action } from "@/Utils/types";
import type { GetServerSidePropsContext } from "next/types";
import nookies from "nookies";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
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
  const { id, formData, commentData, postData } = ctx.query;
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
        if (!req) {
          break;
        }
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
        if (!req) {
          break;
        }
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
        if (!req) {
          break;
        }
        serverResponse = await encodeURL(req);
      }
      break;
    case "delete-comment":
      {
        if (!commentData) return;
        const decodedURL = await decodeURL(commentData);
        const req = await handleApiCalls(
          "http://localhost:3000/api/deleteComment",
          decodedURL
        );
        if (!req) {
          break;
        }
        serverResponse = await encodeURL(req);
      }
      break;
    case "edit-comment":
      {
        if (!commentData) return;
        const decodedURL = await decodeURL(commentData);
        const req = await handleApiCalls(
          "http://localhost:3000/api/editComment",
          decodedURL
        );
        if (!req) {
          break;
        }
        serverResponse = await encodeURL(req);
      }
      break;
    case "edit-post":
      {
        if (!postData) return;
        const decodedURL = await decodeURL(postData);
        const req = await handleApiCalls(
          "http://localhost:3000/api/editPost",
          decodedURL
        );
        if (req) {
          break;
        }
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
        if (!req) {
          break;
        }
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
        if (!req) {
          break;
        }
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
        destination: `${referer}?serverResponse=${serverResponse}`,
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/requestFailed",
        permanent: false,
      },
    };
  }
}

export default function handleApi() {
  return <></>;
}
