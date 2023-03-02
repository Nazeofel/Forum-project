import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useAtom } from "jotai";
import { jwtoken, menuAtom, atomPosts } from "@/Utils/globalStates";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "@/Utils/customHooks";
import { searchIndex } from "@/Utils/formUtils";

export default function Navbar() {
  const [showMenu, setShowMenu] = useAtom(menuAtom);
  const [token, setJWTOKEN] = useAtom(jwtoken);
  const [_, setSearchPosts] = useAtom(atomPosts);
  const [data, setData] = useState<any>();
  const debouncedValue = useDebounce(data, 500);
  const pathName = usePathname();
  function handleMenu() {
    setShowMenu(false);
  }
  /*useEffect(() => {
    (async () => {
      const search = await searchIndex(debouncedValue, "posts");
      setSearchPosts(search);
    })();
  }, [debouncedValue]);*/

  return (
    <header>
      <nav>
        <div>
          <input
            type="search"
            placeholder="Search for a post"
            onChange={(e) => setData(e.currentTarget.value)}
          />
          <FontAwesomeIcon
            icon={faBars}
            onClick={() => setShowMenu((prev: any) => !prev)}
          ></FontAwesomeIcon>
        </div>
      </nav>
      <div
        className={`nav-menu ${showMenu ? "display-block" : "display-none"}`}
      >
        {token === undefined ? (
          <>
            <Link href="/signin" onClick={handleMenu}>
              Sign-in
            </Link>
            <Link href="/signup" onClick={handleMenu}>
              Sign-up
            </Link>
          </>
        ) : (
          <>
            <Link href="/" onClick={handleMenu}>
              Home Page !
            </Link>
            <Link href="/createpost" onClick={handleMenu}>
              Create a new post !
            </Link>
            <Link href={"/user/" + token.name} onClick={handleMenu}>
              Profil
            </Link>
            <Link
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
    </header>
  );
}
//className={`nav-menu ${showMenu ? "display-block" : "display-none"}`}
//
/* <Link
              replace={true}
              href="/logout"
              onClick={() => {
                handleMenu();
                setJWTOKEN(undefined);
              }}
            >
              Log-out
            </Link>*/
