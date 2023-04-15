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
import Link from "next/link";
import { refinedComment } from "@/Utils/interfaces";
import Image from "next/image";
interface Props {
  comments: Array<Comment>;
  userData: Record<string, any>;
}

export default function Comments({ comments, userData }: Props) {
  const router = useRouter();
  const reComments = [...comments]
    .reverse()
    .map((a: any, _: number): refinedComment => {
      return {
        authorID: a.author.id,
        createdAt: a.createdAt,
        id: a.id,
        postID: a.post_id,
        content: a.content,
        name: a.author.name,
        profilPicture: a.author.profilPicture,
        editable: false,
      };
    });
  const [refinedComments, setRefinedComments] =
    useState<Array<refinedComment>>(reComments);
  const [commentText, setCommentText] = useState<string>("");

  function handleEditComment(commentID: number, text?: string) {
    const refinedArray = refinedComments.map((a: refinedComment, _: number) => {
      if (a.id === commentID) {
        return {
          ...a,
          editable: !a.editable,
        };
      }
      return a;
    });
    setRefinedComments(refinedArray);
    if (!text) return;
    setCommentText(text);
    return;
  }
  return (
    <>
      {comments.length > 0 ? (
        refinedComments.map((a: refinedComment, b: number) => {
          const regex = /([0-9\-]){10}/g;
          const dateReg = a.createdAt.toString().match(regex);
          console.log("comment comp", a);
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
                  <Link href={`/user/${a.name}`}>
                    <span
                      style={{
                        display: "flex",
                        gap: "5px",
                      }}
                    >
                      <Image
                        style={{ borderRadius: "10px", width: "15px" }}
                        src={a.profilPicture}
                        width={15}
                        height={15}
                        alt={`${a.name} profile-picture`}
                      />
                      {a.name}, {dateReg}
                    </span>
                  </Link>
                  <div className="actions">
                    {deletePermission(a.authorID, userData) ? (
                      <>
                        {a.editable ? (
                          <FontAwesomeIcon
                            className="trashIcon"
                            icon={faCheck}
                            onClick={async () => {
                              handleEditComment(a.id);
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
                            onClick={() => handleEditComment(a.id, a.content)}
                          />
                        )}
                        <FontAwesomeIcon
                          className="trashIcon"
                          icon={faTrashCan}
                          onClick={async () => {
                            const obj = {
                              id: a.id,
                              postId: a.postID,
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
                {a.editable ? (
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
