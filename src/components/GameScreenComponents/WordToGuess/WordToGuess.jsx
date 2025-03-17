import React from "react";
import { useState, useEffect } from "react";
import styles from "./WordToGuess.module.css";
import { socket } from "../../../socket";
export default function WordToGuess({ word, youTurn, didGuess }) {
  const [hints, setHints] = useState([]);

  useEffect(() => {
    socket.on("get-hint", (hints) => {
      setHints(hints);
      console.log(hints);
    });
    return () => socket.off("get-hints");
  }, []);

  function ifIsHint(index) {
    if (hints.includes(index)) {
      return true;
    }
  }

  function generateGuess(word) {
    const wordSplit = word.split("");
    const guess = wordSplit.map((letter, index) => {
      return (letter = ifIsHint(index)
        ? letter
        : letter === " "
        ? " - "
        : " _ ");
    });
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
