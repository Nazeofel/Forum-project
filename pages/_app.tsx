import Navbar from "@/components/navigation/Navbar";
import type { AppProps } from "next/app";
import "../styles/globals.scss";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { localFMC, notifications } from "@/Utils/globalStates";
import { initAppToken } from "../webPush";
import { getTokenData, handleApiCalls } from "@/Utils/apiUtils";
import { GetServerSidePropsContext } from "next";
import { tokenData } from "@/Utils/interfaces";
config.autoAddCss = false;

App.getInitialProps = async (ctx: GetServerSidePropsContext) => {
  let tokenData: tokenData = await getTokenData(ctx);
  return {
    props: {
      tokenData,
    },
  };
};

export default function App({ Component, pageProps }: AppProps) {
  const [__, setStoredFMC] = useAtom(localFMC);
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js", {
          scope: "/",
        })
        .then((registration) => {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              (async () => {
                const token = await initAppToken();
                if (pageProps && pageProps.tokenData) {
                  await handleApiCalls(
                    `${process.env.NEXT_PUBLIC_HOST}/api/updateDeviceID`,
                    {
                      id: pageProps.tokenData.id,
                      deviceID: token,
                    }
                  );
                }
                setStoredFMC(token);
              })();
            } else {
              console.log("no granted");
              return;
            }
          });
        })
        .catch((error) => {
          console.log("perm", error);
        })
        .catch((error) => {
          console.log("Service worker registration failed:", error);
        });
    } else {
      console.log("Service workers are not supported.");
    }
  }, []);
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
