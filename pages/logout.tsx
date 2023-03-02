import nookies from "nookies";

export async function getServerSideProps(ctx: any) {
  nookies.destroy(ctx, "token", {
    maxAge: -1,
    domain: undefined,
    path: "/",
    secure: false,
  });

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
}

export default function Logout() {
  return <></>;
}
