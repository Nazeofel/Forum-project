import Posts from "@/components/Posts";
import { decodeURL, getTokenData } from "@/Utils/apiUtils";
import { atomPosts, jwtoken } from "@/Utils/globalStates";
import { tokenData } from "@/Utils/interfaces";
import { Post } from "@prisma/client";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
interface Props {
  posts: Post[] | [];
  tokenData: tokenData | null;
  errors: any;
}

export async function getServerSideProps(ctx: any) {
  let tokenData: tokenData = await getTokenData(ctx);
  const params = ctx.query;
  let errors = {};
  const req = await fetch("http://localhost:3000/api/fetchPosts");
  if (req.status !== 200) {
    return {
      props: {
        posts: [],
        tokenData,
        errors,
      },
    };
  }
  if (params.error) {
    await decodeURL(params.error);
    errors = await decodeURL(params.error);
  }
  const json = await req.json();
  const posts = json.posts;
  return {
    props: {
      posts,
      tokenData,
      errors,
    },
  };
}

export default function Home({ posts, tokenData, errors }: Props) {
  const [searchPosts, setSearchPosts] = useAtom(atomPosts);
  const [page, setPage] = useState(1);
  const [jwt, setJWTOKEN] = useAtom(jwtoken);
  const [emptyArray, setEmptyArray] = useState<null | []>(null);
  console.log(page);
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
    if (!jwt && tokenData) {
      setJWTOKEN(tokenData);
    }
  }, []);

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
        {errors.success ? <h1>Post correctly deleted !</h1> : ""}
        {errors.error ? (
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
