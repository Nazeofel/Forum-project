import { useRedirect } from "@/Utils/customHooks";
import { useEffect } from "react";

export default function RequestFailed() {
  const [redirect, setRedirect] = useRedirect("/", 5);
  useEffect(() => {
    setRedirect({
      path: "/",
      timer: 5,
    });
  }, []);
  return (
    <h1 className="error">
      An error happened while contacting the API endpoint ! {redirect.timer}
      {redirect.timer <= 1 ? " second" : " seconds"}
    </h1>
  );
}
