import SectionProfil from "@/components/SectionProfil";
import { getTokenData } from "@/Utils/apiUtils";
import { fetchWrapper } from "@/Utils/formUtils";
import { tokenData } from "@/Utils/interfaces";
import { User, Post, Comment } from "@prisma/client";
import { useState } from "react";

interface UserData extends User {
  comments: Array<Comment>;
  posts: Array<Post>;
}
interface Props {
  userData: UserData;
  tokenData: any;
}

export async function getServerSideProps(ctx: any) {
  let tokenData: tokenData = await getTokenData(ctx);
  const params = ctx.query;
  const payload = {
    name: params.name,
    token: tokenData,
  };
  const user = await fetchWrapper(
    `http://localhost:3000/api/fetchUser`,
    payload
  );
  const userData = await user.userInfos;
  return {
    props: {
      userData,
      tokenData,
    },
  };
}

export default function ProfilPage({ userData, tokenData }: Props) {
  const [section, setSection] = useState<any>({
    comments: false,
    posts: false,
    infos: false,
  });

  if (userData === null) {
    return <h1 className="error">USER NOT FOUND !</h1>;
  }

  const postsRefined = userData.posts.map((a: Post, _: number) => {
    return {
      id: a.id,
      authorId: a.authorId,
      content: a.content,
      createdAt: a.createdAt,
      name: a.name,
      tags: a.tags,
      comments: userData.comments,
    };
  });
  const user = [
    {
      name: userData.name,
      email: userData.email,
      id: userData.id,
      rank: tokenData === null ? null : tokenData.rank,
      tokenId: tokenData === null ? null : tokenData.id,
    },
  ];

  function handleTab(tab: string) {
    return setSection((prev: any) => {
      if (prev[tab] === true) {
        return {
          ...prev,
          [tab]: false,
        };
      }
      return {
        [tab]: true,
      };
    });
  }

  return (
    <div className="profil-container">
      <div className="profil-infos">
        <h1 className="form-title" style={{ paddingBlock: "50px" }}>
          {userData.name}
        </h1>
        <div className="infos">
          <SectionProfil
            userData={user}
            data={postsRefined}
            handleTab={() => handleTab("posts")}
            title="posts"
            section={section.posts}
          />
          <SectionProfil
            userData={user}
            data={userData.comments}
            handleTab={() => handleTab("comments")}
            title="comments"
            section={section.comments}
          />
          <SectionProfil
            userData={user}
            data={user}
            handleTab={() => handleTab("infos")}
            title="infos"
            section={section.infos}
          />
        </div>
      </div>
    </div>
  );
}

/* 

  useEffect(() => {
    (async () => {
      if (reFetch === false) return;
      const obj = {
        name: userData.name,
      };
      const user = await fetchWrapper(
        "http://localhost:3000/api/fetchUser",
        obj
      );
      const datas = await user.userInfo;
      setUserData(datas);
      setRefetch(false);
    })();
  }, [reFetch]);*/