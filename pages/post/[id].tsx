import Comments from "@/components/posts/Comment";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { GetServerSidePropsContext } from "next/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import {
  decodeURL,
  deletePermission,
  encodeURL,
  getTokenData,
  handleApiCalls,
} from "@/Utils/apiUtils";
import { useRouter } from "next/router";
import { tokenData } from "@/Utils/interfaces";

type ServerReponse = {
  success: undefined;
  error: undefined;
};

interface Props {
  datas: any;
  tokenData: tokenData;
  serverResponse: ServerReponse;
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let serverResponse = {};
  let tokenData: tokenData = await getTokenData(ctx);
  const params = ctx.query;
  const obj = {
    id: parseInt(params.id as string, 10),
  };
  const posts = await handleApiCalls(
    `http://localhost:3000/api/fetchPost`,
    obj
  );
  const datas = await posts.posts;
  if (params.serverResponse) {
    await decodeURL(params.serverResponse);
    serverResponse = await decodeURL(params.serverResponse);
  }
  return {
    props: {
      datas,
      tokenData,
      serverResponse,
    },
  };
}

export default function DetailedPost({
  datas,
  tokenData,
  serverResponse,
}: Props) {
  const [reFetch, setRefetch] = useState<boolean>(false);
  const [postData, setPostData] = useState(datas);
  const [clientErrors, setClientErrors] = useState<string | null>(null);
  const router = useRouter();
  console.log(postData);
  const [data, setData] = useState({
    postId: datas.id,
    userId: tokenData.id,
    content: "",
    receiver: postData.author.deviceID,
    username: tokenData.name,
  });

  useEffect(() => {
    (async () => {
      if (reFetch === false) return;
      const obj = {
        id: postData.id,
      };
      const req = await handleApiCalls(
        "http://localhost:3000/api/fetchPost",
        obj
      );
      const datas = await req.posts;
      setPostData(datas);
      setRefetch(false);
    })();
  }, [reFetch]);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (reFetch) return;
    if (data.content.length <= 0) {
      setClientErrors("Comment shouldn't be empty !");
      return;
    }
    if (data.content.length > 244) {
      setClientErrors("Comment should be less than 244 characters !");
      return;
    } else {
      const base64 = await encodeURL(data);
      router.push(`/action/post-comment?commentData=${base64}`);
      setRefetch(true);
      setClientErrors(null);
    }
  }

  return (
    <>
      {Object.keys(postData).length <= 0 ? (
        <h1>
          404 NO POST EXIST ! Go back to{" "}
          <Link
            href="/"
            style={{
              textDecoration: "underline",
              width: "fit-content",
              color: "rgba(44, 44, 44, 0.75)",
              textAlign: "center",
            }}
          >
            home
          </Link>
        </h1>
      ) : (
        <>
          <div
            className="posts"
            style={{ marginBlock: "40px", marginInline: "auto" }}
          >
            <div className="posts-infos">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "auto",
                }}
              >
                <span>{postData.name}</span>
                {deletePermission(datas.authorId, tokenData) ? (
                  <FontAwesomeIcon
                    className="trashIcon"
                    icon={faTrashCan}
                    onClick={() =>
                      router.push(`/action/delete-post?id=${datas.id}`)
                    }
                  />
                ) : (
                  ""
                )}
              </div>
              <p>{postData.content}</p>
            </div>
          </div>
          {tokenData === null ? (
            <h1 style={{ textAlign: "center" }}>
              <Link href="/login" style={{ textDecoration: "underline" }}>
                Log-in
              </Link>{" "}
              to post a comment
            </h1>
          ) : (
            <form onSubmit={handleSubmit}>
              <label htmlFor="content" className="form-label">
                Comments !
              </label>
              {clientErrors !== null ? (
                <p className="error">{clientErrors}</p>
              ) : (
                ""
              )}
              {serverResponse.success !== undefined ? (
                <p className="success">{serverResponse.success}</p>
              ) : (
                ""
              )}
              {serverResponse.error !== undefined ? (
                <p className="error">{serverResponse.error}</p>
              ) : (
                ""
              )}
              <textarea
                className="form-input form-placeholder"
                style={{
                  marginBottom: "10px",
                  resize: "none",
                  height: "auto",
                }}
                name="content"
                maxLength={240}
                minLength={50}
                value={data.content}
                onChange={(e) => {
                  setData((prev) => {
                    return {
                      ...prev,
                      content: e.target.value,
                    };
                  });
                }}
                rows={5}
                placeholder="Ex : You should do that in order to..."
              />
              <input type="submit" value="Comment" className="form-submit" />
            </form>
          )}

          <div className="comments-container">
            <Comments
              postId={datas.id}
              comments={postData.comments}
              userData={tokenData}
            />
          </div>
        </>
      )}
    </>
  );
}
