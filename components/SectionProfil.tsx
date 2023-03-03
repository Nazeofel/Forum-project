import { User } from "@prisma/client";
import Link from "next/link";
import { deletePermission, encodeURL } from "@/Utils/apiUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { splitStr } from "@/Utils/stringFunctions";
import { useRouter } from "next/router";
import Comments from "./Comment";

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
  /*const infosMap = props.data.map((a: User, b: number) => {
    return <p key={b}>{a.name}</p>;
  });*/
  return <>no</>;
}

function PostStyle(props: any) {
  const posts = Array.from(props.posts);
  const router = useRouter();
  console.log(props.userData[0]);
  return (
    <>
      {posts.length > 0 ? (
        posts.map((a: any, b: number) => {
          console.log(a);
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
                      <span>
                        {a.name}, {dateReg}
                      </span>
                      {deletePermission(a.authorId, props.userData) ? (
                        <FontAwesomeIcon
                          className="trashIcon"
                          icon={faTrashCan}
                          onClick={async () => {
                            const obj = {
                              id: a.authorId,
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
      <Comments
        postId={props.postId}
        comments={props.comments}
        userData={props.userData}
      />
    </>
  );
}

export default function SectionProfil(props: any) {
  const section = (title: string) => {
    switch (title) {
      case "infos": {
        return <InfosStyle title={title} data={props.data} />;
      }
      case "comments": {
        return (
          <CommentStyle
            userData={props.userData}
            postId={props.postId}
            comments={props.comments}
          />
        );
      }
      case "posts": {
        return <PostStyle posts={props.posts} userData={props.userData} />;
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
