import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faBellSlash } from "@fortawesome/free-solid-svg-icons";
import { useAtom } from "jotai";
import {
  jwtoken,
  menuAtom,
  atomPosts,
  notifications,
} from "@/Utils/globalStates";
import { useEffect, useState } from "react";
import { useDebounce } from "@/Utils/customHooks";
import { searchIndex } from "@/Utils/formUtils";
import { getMessaging, onMessage } from "firebase/messaging";
import { NotificationObject } from "@/Utils/interfaces";
import NotificationBox from "./NotificationBox";
import NavigationMenu from "./NavigationMenu";
import Image from "next/image";

export default function Navbar() {
  const [showMenu, setShowMenu] = useAtom(menuAtom);
  const [token, setJWTOKEN] = useAtom(jwtoken);
  const [_, setSearchPosts] = useAtom(atomPosts);
  const [searchBoolean, setSearchBoolean] = useState<boolean>(false);
  const [searchBarInput, setSearchBarInput] = useState<string>();
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [localStorageNotifications, setLocalStorageNotifications] =
    useAtom(notifications);
  const debouncedValue = useDebounce(searchBarInput, 500);
  const unseenNotification = localStorageNotifications.filter(
    (notif) => notif.data.seen !== "seen"
  );
  function handleMenu() {
    setShowMenu(false);
  }
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
      if (!searchBoolean) return;
      const search = await searchIndex(debouncedValue, "posts");
      setSearchPosts(search);
    })();

    return () => {
      setSearchBoolean(false);
    };
  }, [debouncedValue]);

  return (
    <>
      <header>
        <nav>
          <div>
            <input
              type="search"
              placeholder="Search for a post"
              onChange={(e) => {
                setSearchBoolean(true);
                setSearchBarInput(e.currentTarget.value);
              }}
            />
            <div className="nav-icons">
              {token === undefined ? (
                ""
              ) : (
                <div>
                  <div
                    className="bell"
                    style={{ display: "block", position: "relative" }}
                  >
                    {unseenNotification.length >= 1 ? (
                      <Image
                        src="/circle-moon-svgrepo-com.svg"
                        alt="circle-moon-svgrepo-com.svg"
                        width={10}
                        height={10}
                        style={{
                          position: "absolute",
                          zIndex: "20",
                          right: "10px",
                        }}
                      />
                    ) : (
                      ""
                    )}
                    <FontAwesomeIcon
                      className="svg-style bell"
                      style={{ position: "relative", zIndex: "0" }}
                      icon={
                        localStorageNotifications.length > 0
                          ? faBell
                          : faBellSlash
                      }
                      onClick={handleInBoxNotifications}
                    ></FontAwesomeIcon>
                  </div>
                </div>
              )}
              <FontAwesomeIcon
                className="svg-style"
                icon={faBars}
                onClick={() => setShowMenu((prev: boolean) => !prev)}
              ></FontAwesomeIcon>
            </div>
          </div>
        </nav>
      </header>
      <NotificationBox
        showNotification={showNotification}
        locaStorageNotifications={localStorageNotifications}
        setLocalStorageNotifications={setLocalStorageNotifications}
      />
      <NavigationMenu
        showMenu={showMenu}
        handleMenu={handleMenu}
        token={token}
        setJWTOKEN={setJWTOKEN}
      />
    </>
  );
}
