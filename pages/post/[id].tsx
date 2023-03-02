import { fetchWrapper } from "@/Utils/formUtils";
import { Post, Comment } from "@prisma/client";
import Comments from "@/components/Comment";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import {
  decodeURL,
  deletePermission,
  encodeURL,
  getTokenData,
} from "@/Utils/apiUtils";
import { useRouter } from "next/router";
interface BasicPost extends Post {
  comments: Array<Comment>;
}

export async function getServerSideProps(ctx: any) {
  let errors = {};
  let tokenData = await getTokenData(ctx);
  const params = ctx.query;
  const obj = {
    id: parseInt(params.id, 10),
  };
  const posts = await fetchWrapper(`http://localhost:3000/api/fetchPost`, obj);
  const datas: Post = await posts.posts;
  if (params.error !== undefined) {
    await decodeURL(params.error);
    errors = await decodeURL(params.error);
  }
  return {
    props: {
      datas,
      tokenData,
      errors,
    },
  };
}

export default function DetailedPost(props: {
  datas: BasicPost;
  tokenData: any;
  errors?: any;
}) {
  const [reFetch, setRefetch] = useState(false);
  const [postData, setPostData] = useState(props.datas);
  const [serverErrors, setServerErrors] = useState<any>(props.errors);
  const [clientErrors, setClientErrors] = useState<string | null>(null);
  const router = useRouter();
  const [data, setData] = useState({
    postId: props.datas.id,
    userId: props.tokenData.id,
    content: "",
  });

  useEffect(() => {
    (async () => {
      if (reFetch === false) return;
      const obj = {
        id: postData.id,
      };
      const req = await fetchWrapper(
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
      setServerErrors({
        success: undefined,
        error: undefined,
      });
      return;
    }
    if (data.content.length > 244) {
      setClientErrors("Comment should be less than 244 characters !");
      setServerErrors({
        success: undefined,
        error: undefined,
      });
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
          <div className="posts" style={{ marginBlock: "40px" }}>
            <div className="posts-infos">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "auto",
                }}
              >
                <span>{postData.name}</span>
                {deletePermission(props.datas.authorId, props.tokenData) ? (
                  <FontAwesomeIcon
                    className="trashIcon"
                    icon={faTrashCan}
                    onClick={() =>
                      router.push(`/action/delete-post?id=${props.datas.id}`)
                    }
                  />
                ) : (
                  ""
                )}
              </div>
              <p>{postData.content}</p>
            </div>
          </div>
          {props.tokenData === null ? (
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
              {serverErrors.success !== undefined ? (
                <p className="success">{serverErrors.success}</p>
              ) : (
                ""
              )}
              {serverErrors.error !== undefined ? (
                <p className="error">{serverErrors.error}</p>
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
              postId={props.datas.id}
              comments={postData.comments}
              userData={props.tokenData}
            />
          </div>
        </>
      )}
    </>
  );
}
