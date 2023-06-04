import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faBellSlash } from "@fortawesome/free-solid-svg-icons";
import { useAtom, useAtomValue } from "jotai";
import {
  jwtoken,
  menuAtom,
  atomPosts,
  notifications,
  dbPosts,
} from "@/Utils/globalStates";
import { useEffect, useState } from "react";
import { useDebounce } from "@/Utils/customHooks";
import { searchIndex } from "@/Utils/formUtils";
import { getMessaging, onMessage } from "firebase/messaging";
import { NotificationObject } from "@/Utils/interfaces";
import NotificationBox from "./NotificationBox";
import NavigationMenu from "./NavigationMenu";
import BellComponent from "./BellComponent";

export default function Navbar() {
  const [showMenu, setShowMenu] = useAtom(menuAtom);
  const [token, setJWTOKEN] = useAtom(jwtoken);
  const [_, setSearchPosts] = useAtom(atomPosts);
  const savedDbPosts = useAtomValue(dbPosts);
  const [searchBoolean, setSearchBoolean] = useState<boolean>(false);
  const [searchBarInput, setSearchBarInput] = useState<string>();
  const [localStorageNotifications, setLocalStorageNotifications] =
    useAtom(notifications);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const debouncedValue = useDebounce(searchBarInput, 500);
  function handleMenu() {
    setShowMenu(false);
  }

  useEffect(() => {
    (async () => {
      const perm = await navigator.permissions.query({ name: "notifications" });
      if (perm.state === "granted") {
        const messaging = getMessaging();
        onMessage(messaging, (payload) => {
          setLocalStorageNotifications((prev: any) => [...prev, payload]);
        });
      } else {
        return;
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!searchBoolean || savedDbPosts.length <= 0) return;
      const search = await searchIndex(debouncedValue, "posts");
      setSearchPosts(search);
    })();

    return () => {
      setSearchBoolean(false);
    };
  }, [debouncedValue]);

  function handleInBoxNotifications() {
    const seenNotif = localStorageNotifications.map(
      (a: NotificationObject, _: number): NotificationObject => {
        return {
          ...a,
          data: {
            ...a.data,
            seen: "seen",
          },
        };
      }
    );
    setLocalStorageNotifications(seenNotif);
    setShowNotification((prev: boolean) => !prev);
  }

  return (
    <>
      <header>
        <nav>
          <input
            type="search"
            placeholder="Search for a post"
            onChange={(e) => {
              setSearchBoolean(true);
              setSearchBarInput(e.currentTarget.value);
            }}
          />
          <NavigationMenu
            showMenu={showMenu}
            handleMenu={handleMenu}
            token={token}
            setJWTOKEN={setJWTOKEN}
          />
          {token === undefined ? (
            ""
          ) : (
            <BellComponent
              handleInBoxNotifications={handleInBoxNotifications}
              localStorageNotifications={localStorageNotifications}
            />
          )}
          <FontAwesomeIcon
            className="svg-style  hamburger-menu"
            icon={faBars}
            onClick={() => setShowMenu((prev: boolean) => !prev)}
          ></FontAwesomeIcon>
          <NotificationBox
            showNotification={showNotification}
            locaStorageNotifications={localStorageNotifications}
            setLocalStorageNotifications={setLocalStorageNotifications}
          />
        </nav>
      </header>
    </>
  );
}

/* <NotificationBox
            showNotification={showNotification}
            locaStorageNotifications={localStorageNotifications}
            setLocalStorageNotifications={setLocalStorageNotifications}
          />*/
