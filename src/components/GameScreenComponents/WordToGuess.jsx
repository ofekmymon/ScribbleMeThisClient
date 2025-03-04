import React from "react";
import styles from "./WordToGuess.module.css";
export default function WordToGuess({ word, youTurn, didGuess }) {
  function generateGuess(word) {
    const wordSplit = word.split("");
    const guess = wordSplit.map((letter) => (letter === " " ? " - " : " _ "));
    return guess;
  }

  return (
    <div className={styles.container}>
      {word ? (
        <div className={styles.word}>
          {youTurn || didGuess ? word : generateGuess(word)}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
