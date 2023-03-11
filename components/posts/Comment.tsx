import { deletePermission, encodeURL } from "@/Utils/apiUtils";
import {
  faTrashCan,
  faPencil,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useState } from "react";
import type { Comment } from "@prisma/client";
interface Props {
  postId: number;
  comments: Array<Comment>;
  userData: Object;
}

export default function Comments({ postId, comments, userData }: Props) {
  const router = useRouter();
  const [editComment, setEditComment] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>("");

  function handleEditComment(text?: string) {
    setEditComment((prev) => !prev);
    if (!text) return;
    setCommentText(text);
    return;
  }
  return (
    <>
      {comments.length > 0 ? (
        [...comments].reverse().map((a: any, b: number) => {
          const regex = /([0-9\-]){10}/g;
          const dateReg = a.createdAt.toString().match(regex);
          return (
            <div className="posts" key={b}>
              <div className="posts-infos">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "auto",
                  }}
                >
                  <span>
                    {a.hasOwnProperty("author") ? `${a.author.name},` : ""}{" "}
                    {dateReg}
                  </span>
                  <div className="actions">
                    {deletePermission(a.author_id, userData) ? (
                      <>
                        {editComment ? (
                          <FontAwesomeIcon
                            className="trashIcon"
                            icon={faCheck}
                            onClick={async () => {
                              handleEditComment();
                              if (a.content === commentText) {
                                return;
                              }
                              const obj = {
                                commentId: a.id,
                                text: commentText,
                              };
                              const base64 = await encodeURL(obj);
                              router.push(
                                `/action/edit-comment?commentData=${base64}`
                              );
                            }}
                          />
                        ) : (
                          <FontAwesomeIcon
                            className="trashIcon"
                            icon={faPencil}
                            onClick={() => handleEditComment(a.content)}
                          />
                        )}
                        <FontAwesomeIcon
                          className="trashIcon"
                          icon={faTrashCan}
                          onClick={async () => {
                            const obj = {
                              id: a.id,
                              postId: postId,
                            };
                            const base64 = await encodeURL(obj);
                            router.push(
                              `/action/delete-comment?commentData=${base64}`
                            );
                          }}
                        />
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                {editComment ? (
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                ) : (
                  <p>{a.content}</p>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <h1 style={{ textAlign: "center" }}>No comments !</h1>
      )}
    </>
  );
}
