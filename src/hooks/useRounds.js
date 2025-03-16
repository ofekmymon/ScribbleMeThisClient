import { socket } from "../socket";
import { useEffect, useState } from "react";

export function useTimer() {
  const [timer, setTimer] = useState("-");

  useEffect(() => {
    socket.on("update-timer", (timer) => {
      setTimer(timer);
    });

    return () => {
      socket.off("update-timer");
    };
  }, [timer]);

  return timer;
}
