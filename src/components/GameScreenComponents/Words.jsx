import React from "react";
import styles from "./Words.module.css";
import { getWords, wordChosen } from "../../hooks/useWords";
import { useState, useEffect } from "react";
export default function Words({ numberOfOptions }) {
  const [words, setWords] = useState([]);
  useEffect(() => {
    // requests words from server
    async function askWords() {
      const wordsTaken = await getWords(numberOfOptions);
      console.log(wordsTaken);

      if (wordsTaken) {
        setWords(wordsTaken);
      } else {
        console.log("ERROR");
      }
    }
    askWords();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.title}>Choose Word To Draw</div>
      <div className={styles.wordContainer}>
        {words.map((word) => (
          <div
            className={styles.word}
            key={word}
            onClick={() => {
              wordChosen(word);
            }}
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  );
}
