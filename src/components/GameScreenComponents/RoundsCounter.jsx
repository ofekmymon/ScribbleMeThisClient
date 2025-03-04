import React from "react";
import styles from "./RoundsCounter.module.css";
import { useTimer } from "../../hooks/useRounds";
export default function RoundsCounter({ round, rounds }) {
  const timer = useTimer();
  return (
    <div className={styles.container}>
      <div className={styles.timer}>{timer}'s</div>
      <div className={styles.rounds}>
        Rounds: {round}/{rounds}
      </div>
    </div>
  );
}
