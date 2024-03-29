import Posts from "@/components/posts/Posts";
import { decodeURL, getTokenData, handleApiCalls } from "@/Utils/apiUtils";
import {
  atomPosts,
  dbPosts,
  jwtoken,
  notifications,
} from "@/Utils/globalStates";
import { tokenData } from "@/Utils/interfaces";
import { serverResponseObject } from "@/Utils/types";
import { Post } from "@prisma/client";
import { useAtom } from "jotai";
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
  const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/fetchPosts`);
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
  const [searchdbPosts, setDbPosts] = useAtom(dbPosts);
  const [page, setPage] = useState(1);
  const [jwt, setJWTOKEN] = useAtom(jwtoken);
  const [emptyArray, setEmptyArray] = useState<null | []>(null);
  const getSearchResultsPage = (array: Post[] | [] = posts) => {
    if (posts.length <= 0 || page < 1) {
      setPage(1);
      setEmptyArray([]);
      return;
    }
    const start = (page - 1) * 5;
    const end = page * 5;
    const sliced = array.slice(start, end);
    const slicedPred = array.slice(start + 5, end + 5);
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

  useEffect(() => {
    setDbPosts(posts);
    if (searchPosts.length <= 0) {
      setSearchPosts(posts);
      getSearchResultsPage();
    }
    getSearchResultsPage();
  }, [page]);

  return (
    <>
      <div
        className="post-container"
        style={{ justifyContent: searchPosts.length >= 1 ? "unset" : "center" }}
      >
        <Posts tokenData={tokenData} />
        {serverResponse.success ? (
          <h1 className="success" style={{ textAlign: "center" }}>
            Post correctly deleted !
          </h1>
        ) : (
          ""
        )}
        {serverResponse.error ? (
          <h1>An error occured while trying to delete the post !</h1>
        ) : (
          ""
        )}
      </div>
      <div
        className="pagination-container"
        style={{ display: "flex", justifyContent: "center", gap: "2px" }}
      >
        {page <= 1 || searchPosts.length <= 0 ? (
          ""
        ) : (
          <button
            className="pagination-button"
            onClick={() => setPage((prev) => prev - 1)}
          >
            {page - 1}
          </button>
        )}
        {posts.length <= 0 ? (
          ""
        ) : (
          <button className="pagination-button">{page}</button>
        )}
        {emptyArray === null ? (
          <button
            className="pagination-button"
            onClick={() => setPage((prev) => prev + 1)}
          >
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
