import Posts from "@/components/posts/Posts";
import { decodeURL, getTokenData, handleApiCalls } from "@/Utils/apiUtils";
import { atomPosts, jwtoken, notifications } from "@/Utils/globalStates";
import { tokenData } from "@/Utils/interfaces";
import { serverResponseObject } from "@/Utils/types";
import { Post } from "@prisma/client";
import { useAtom } from "jotai";
import Link from "next/link";
import type { GetServerSidePropsContext } from "next/types";
import { useEffect, useState } from "react";

interface Props {
  posts: Post[] | [];
  tokenData: tokenData | null;
  serverResponse: serverResponseObject;
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let tokenData: tokenData = await getTokenData(ctx);
  const params = ctx.query;
  let serverResponse = {};
  const req = await fetch("http://localhost:3000/api/fetchPosts");
  if (req.status !== 200) {
    return {
      props: {
        posts: [],
        tokenData,
        serverResponse,
      },
    };
  }
  if (params.serverResponse) {
    await decodeURL(params.serverResponse);
    serverResponse = await decodeURL(params.serverResponse);
  }
  const json = await req.json();
  const posts = json.posts;
  return {
    props: {
      posts,
      tokenData,
      serverResponse,
    },
  };
}

export default function Home({ posts, tokenData, serverResponse }: Props) {
  const [searchPosts, setSearchPosts] = useAtom(atomPosts);
  const [page, setPage] = useState(1);
  const [jwt, setJWTOKEN] = useAtom(jwtoken);
  const [emptyArray, setEmptyArray] = useState<null | []>(null);
  const getSearchResultsPage = () => {
    if (posts.length <= 0 || page < 1) {
      setPage(1);
      setEmptyArray([]);
      return;
    }
    const start = (page - 1) * 5;
    const end = page * 5;
    const sliced = posts.slice(start, end);
    const slicedPred = posts.slice(start + 1, end + 1);
    if (slicedPred.length <= 0) {
      setEmptyArray([]);
    } else {
      setEmptyArray(null);
    }

    return setSearchPosts(sliced);
  };

  useEffect(() => {
    (async () => {
      if (!jwt && tokenData) {
        setJWTOKEN(tokenData);
      }
    })();
  }, []);

  const x = async (username: string, commentContent: string) => {
    await handleApiCalls("http://localhost:3000/api/sendNotification", {
      postURL: `/`,
      username: username,
      commentContent: commentContent,
      receiver:
        "dXzDmUKrAPU5y8wxaCtCB3:APA91bHCnmVKNGtrJwzN3YxCayNPf36kYcmQrh75MajmHOvUkgT7PRmESp9YQZWyUD0lMxiMjFXj-OHbfuxZ1H6HG5e2xVvXAkAaecNtCjU3A_wmZYZS-3ORTZ_hl8XbHJcz50cQ-FdI",
    });
  };

  useEffect(() => {
    if (searchPosts.length <= 0) {
      setSearchPosts(posts);
      getSearchResultsPage();
    }
    getSearchResultsPage();
  }, [page]);

  return (
    <>
      <div className="post-container">
        <Posts tokenData={tokenData} />
        <button
          onClick={async () => {
            await x("My username is that", "message from inside the client");
          }}
        >
          client
        </button>
        <Link href="/oui/json">lol</Link>
        <button
          onClick={async () => {
            await x("Notification message", "message from outside the client");
          }}
        >
          outside client
        </button>
        {serverResponse.success ? <h1>Post correctly deleted !</h1> : ""}
        {serverResponse.error ? (
          <h1>An error occured while trying to delete the post !</h1>
        ) : (
          ""
        )}
      </div>
      <div
        className="pagination-container"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <button onClick={() => setPage((prev) => prev - 1)}>{page - 1}</button>
        <button style={{ backgroundColor: "green" }}>{page}</button>
        {emptyArray === null ? (
          <button onClick={() => setPage((prev) => prev + 1)}>
            {" "}
            {page + 1}
          </button>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
