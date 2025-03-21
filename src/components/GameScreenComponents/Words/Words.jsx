import React from "react";
import styles from "./Words.module.css";
import { useWords, wordChosen, useTimer } from "../../../hooks/useWords";
export default function Words() {
  const timer = useTimer();
  const words = useWords();

  return (
    <div className={styles.container}>
      <div className={styles.title}>Choose Word To Draw</div>
      <div className={styles.wordContainer}>
        {words
          ? words.map((word) => (
              <div
                className={styles.word}
                key={word}
                onClick={() => {
                  wordChosen(word);
                }}
              >
                {word}
              </div>
            ))
          : ""}
      </div>
      <div className={styles.timer}>Time To Choose: {timer}</div>
    </div>
  );
}
