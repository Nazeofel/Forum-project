import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { atomPosts } from "@/Utils/globalStates";
import { splitStr } from "@/Utils/stringFunctions";
import { deletePermission } from "@/Utils/apiUtils";
import { tokenData } from "@/Utils/interfaces";
import { useRouter } from "next/router";

interface Props {
  tokenData: tokenData | null;
}

export default function Posts({ tokenData }: Props) {
  const posts = useAtomValue(atomPosts);
  const router = useRouter();

  return (
    <>
      {posts.length > 0 ? (
        posts.map((a: any, b: number) => {
          const regex = /([0-9\-]){10}/g;
          const dateReg = a.createdAt.toString().match(regex);
          console.log(a);
          return (
            <div key={b}>
              <Link href={"/post/" + a.id}>
                <div className="posts">
                  <div className="posts-infos">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "auto",
                      }}
                    >
                      <span>
                        {a.author.name}, {dateReg}: {splitStr(a.name, 20)}
                      </span>
                      {deletePermission(a.authorId, tokenData) ? (
                        <FontAwesomeIcon
                          className="trashIcon"
                          icon={faTrashCan}
                          onClick={async () => {
                            router.push(`/action/delete-post?id=${a.id}`);
                          }}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                    <p>{splitStr(a.content, 85)}</p>
                  </div>
                  <p>
                    <FontAwesomeIcon icon={faComment} />
                    {a.hasOwnProperty("comments") ? a.comments.length : "0"}
                  </p>
                </div>
              </Link>
            </div>
          );
        })
      ) : (
        <h1>No posts !</h1>
      )}
    </>
  );
}
