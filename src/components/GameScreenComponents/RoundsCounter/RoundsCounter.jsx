import React, { useEffect, useRef } from "react";
import styles from "./RoundsCounter.module.css";
import { useTimer } from "../../../hooks/useRounds";
import { socket } from "../../../socket";

export default function RoundsCounter({ round, rounds }) {
  const timer = useTimer();
  const audioRef = useRef(new Audio("./clock.wav")); // Store audio in a ref

  useEffect(() => {
    const stopTimerHandler = () => {
      console.log(audioRef.current);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };

    socket.on("stop-timer", stopTimerHandler);
    return () => socket.off("stop-timer", stopTimerHandler);
  }, []);

  useEffect(() => {
    if (timer === 10) {
      audioRef.current.play();
    } else if (timer === 0) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [timer]); // Runs only when `timer` changes

  return (
    <div className={styles.container}>
      <div className={styles.timer}>{timer}'s</div>
      <div className={styles.rounds}>
        Rounds: {round > rounds ? rounds : round}/{rounds}
      </div>
    </div>
  );
}
