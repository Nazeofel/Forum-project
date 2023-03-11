import { notifications } from "@/Utils/globalStates";
import { NotificationObject } from "@/Utils/interfaces";
import { splitStr } from "@/Utils/stringFunctions";
import { useAtom } from "jotai";
import Link from "next/link";

export default function NotificationBox(props: {
  showNotification: boolean;
  setLocalStorageNotifications: any;
  locaStorageNotifications: Array<NotificationObject>;
}) {
  return (
    <div
      className="notification-container"
      style={{ display: props.showNotification ? "block" : "none" }}
    >
      <span
        style={{
          color: "rgba(44, 44, 44, 0.75)",
          fontWeight: "bold",
        }}
        onClick={() => {
          props.setLocalStorageNotifications([]);
        }}
      >
        Clear all
      </span>
      <hr />
      <ul>
        {props.locaStorageNotifications.length > 0 ? (
          <>
            {[...props.locaStorageNotifications]
              .reverse()
              .map((a: any, b: number) => {
                const regex = /([0-9\-]){10}/g;
                const dateReg = a.data.date.match(regex);
                return (
                  <Link href={a.fcmOptions.link} key={b}>
                    <li>
                      <div className="posts">
                        <div
                          className="posts-infos"
                          style={{
                            width: "fit-content",
                            padding: "10px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "auto",
                            }}
                          >
                            <span>
                              {a.data.name}, {dateReg} :{" "}
                            </span>
                          </div>
                          <p>{splitStr(a.data.content, 30)}</p>
                        </div>
                      </div>
                    </li>
                  </Link>
                );
              })}
          </>
        ) : (
          <p
            style={{
              fontWeight: "bold",
              textAlign: "center",
              fontSize: "24px",
              color: "rgba(44, 44, 44, 0.75)",
            }}
          >
            No notifications !
          </p>
        )}
      </ul>
    </div>
  );
}
