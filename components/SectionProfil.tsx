import { User } from "@prisma/client";
import Link from "next/link";
import { deletePermission, encodeURL } from "@/Utils/apiUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { splitStr } from "@/Utils/stringFunctions";
import { useRouter } from "next/router";

/* 
  Make sure to render things based on the rank ! // DONE

  Make more precise type ! ?
*/

interface Props {
  title?: string;
  data: [];
  userData: any;
}

function InfosStyle(props: any) {
  const infosMap = props.data.map((a: User, b: number) => {
    return <p key={b}>{a.name}</p>;
  });
  return <>{infosMap}</>;
}

function PostStyle(props: any) {
  const posts = Array.from(props.data);
  const router = useRouter();
  return (
    <>
      {posts.length > 0 ? (
        posts.map((a: any, b: number) => {
          const regex = /([0-9\-]){10}/g;
          const dateReg = a.createdAt.toString().match(regex);
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
                      <span>{dateReg}</span>
                      {deletePermission(a.authorId, props.userData) ? (
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

function CommentStyle(props: any) {
  return (
    <>
      {props.data.length > 0 ? (
        props.data.map((a: any, b: number) => {
          const regex = /([0-9\-]){10}/g;
          const dateReg = a.createdAt.toString().match(regex);
          return (
            <div className="posts" key={b}>
              <div className="posts-infos">
                <span>{dateReg}</span>
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

export default function SectionProfil(props: any) {
  const section = (title: string) => {
    switch (props.title) {
      case "infos": {
        return <InfosStyle title={title} data={props.data} />;
      }
      case "comments": {
        return <CommentStyle data={props.data} />;
      }
      case "posts": {
        return <PostStyle data={props.data} userData={props.userData} />;
      }
      default:
        break;
    }
  };

  return (
    <section onClick={props.handleTab} className="section-style user-posts">
      <h2
        className="form-title"
        style={{
          fontSize: "24px",
          borderBottom: props.section ? "1px solid" : "",
        }}
      >
        {props.title}
      </h2>

      <section
        className="content-section"
        style={{ height: props.section ? "400px" : "0px" }}
      >
        <div
          className={
            props.section ? "content-element-display" : "content-element"
          }
        >
          {section(props.title)}
        </div>
      </section>
    </section>
  );
}
