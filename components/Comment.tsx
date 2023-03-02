import { encodeURL } from "@/Utils/apiUtils";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

export default function Comments(props: {
  postId: any;
  comments: any;
  userData: any;
}) {
  const router = useRouter();
  return (
    <>
      {props.comments.length > 0 ? (
        props.comments.map((a: any, b: number) => {
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
                    {a.author.name}, {dateReg}
                  </span>
                  {(props.userData !== null &&
                    props.userData.id === a.author_id) ||
                  props.userData.rank === "Admin" ? (
                    <FontAwesomeIcon
                      className="trashIcon"
                      icon={faTrashCan}
                      onClick={async () => {
                        const obj = {
                          id: a.id,
                          postId: props.postId,
                        };
                        const base64 = await encodeURL(obj);
                        router.push(
                          `/action/delete-comment?commentData=${base64}`
                        );
                      }}
                    />
                  ) : (
                    ""
                  )}
                </div>
                <p>{a.content}</p>
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
