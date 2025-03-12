import { useState, useEffect } from "react";
import { socket } from "../socket";

export function useWords() {
  const [words, setWords] = useState([]);
  useEffect(() => {
    socket.emit("get-words");
    socket.once("word-options", (words) => setWords(words));
    return () => socket.off("word-options");
  }, []);
  return words;
}

export function useTimer() {
  const [timer, setTimer] = useState("-");
  useEffect(() => {
    socket.on("update-countdown", (countdown) => {
      setTimer(countdown);
    });
    return () => socket.off("update-countdown");
  }, []);

  return timer;
}

export function wordChosen(word) {
  socket.emit("word-chosen", word);
}
