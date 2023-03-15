import { NotificationObject } from "@/Utils/interfaces";
import { faBell, faBellSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export default function BellComponent(props: {
  handleInBoxNotifications: () => void;
  localStorageNotifications: NotificationObject[];
}) {
  const unseenNotification = props.localStorageNotifications.filter(
    (notif) => notif.data.seen !== "seen"
  );

  return (
    <div className="bell" style={{ display: "block", position: "relative" }}>
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
        icon={props.localStorageNotifications.length > 0 ? faBell : faBellSlash}
        onClick={props.handleInBoxNotifications}
      ></FontAwesomeIcon>
    </div>
  );
}
