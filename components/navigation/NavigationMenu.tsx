import { tokenData } from "@/Utils/interfaces";
import Link from "next/link";

interface Props {
  showMenu: boolean;
  token: tokenData;
  handleMenu: () => void;
  setJWTOKEN: (arg: undefined) => void;
}

export default function NavigationMenu({
  showMenu,
  token,
  handleMenu,
  setJWTOKEN,
}: Props) {
  return (
    <div className={`nav-menu ${showMenu ? "display-block" : "display-none"}`}>
      {token === undefined ? (
        <>
          <Link className="link-animation" href="/signin" onClick={handleMenu}>
            Sign-in
          </Link>
          <Link className="link-animation" href="/signup" onClick={handleMenu}>
            Sign-up
          </Link>
        </>
      ) : (
        <>
          <Link className="link-animation" href="/" onClick={handleMenu}>
            Home Page
          </Link>
          <Link
            className="link-animation"
            href="/createpost"
            onClick={handleMenu}
          >
            Create a new post
          </Link>
          <Link
            className="link-animation"
            href={"/user/" + token.name}
            onClick={handleMenu}
          >
            Profil
          </Link>
          <Link
            className="link-animation"
            href="/logout"
            onClick={() => {
              handleMenu();
              setJWTOKEN(undefined);
            }}
          >
            Log-out
          </Link>
        </>
      )}
    </div>
  );
}
