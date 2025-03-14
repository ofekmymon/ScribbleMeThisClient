import React, { useState, useEffect } from "react";
import styles from "./SetSettings.module.css";
import { socket } from "../../socket";

export default function SetSettings({ owner, room }) {
  // Local state for form values
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [maxRounds, setMaxRounds] = useState(3);
  const [turnTime, setTurnTime] = useState(120);
  const [wordOptions, setWordOptions] = useState(3);

  // Sync local state with `room` whenever `room` updates
  useEffect(() => {
    if (room) {
      console.log(room);

      setMaxPlayers(room.maxPlayers ?? 8);
      setMaxRounds(room.rounds ?? 3);
      setTurnTime(room.turnTime ?? 120);
      setWordOptions(room.wordsOptionNumber ?? 3);
    }
  }, [room]); // Runs whenever `room` updates

  useEffect(() => {
    if (owner) {
      const values = {
        maxPlayers: parseInt(maxPlayers),
        maxRounds: parseInt(maxRounds),
        turnTime: parseInt(turnTime),
        wordOptions: parseInt(wordOptions),
      };
      socket.emit("update-private-room", values);
    }
  }, [maxPlayers, maxRounds, turnTime, wordOptions, owner]);

  function handleUpdate() {
    const values = {
      maxPlayers: parseInt(maxPlayers),
      maxRounds: parseInt(maxRounds),
      turnTime: parseInt(turnTime),
      wordOptions: parseInt(wordOptions),
    };
    socket.emit("update-private-room", values);
  }

  function startRoom() {
    handleUpdate();
    socket.emit("initiate-private-room");
  }

  return (
    <div className={styles.container}>
      <div className={styles.optionContainer}>
        <div className={styles.option}>
          Max Players:{" "}
          <select
            value={maxPlayers} // Always controlled
            disabled={!owner}
            onChange={(e) => {
              setMaxPlayers(Math.max(e.target.value, room.players.length)); // cant go below current player length
            }}
          >
            {Array.from({ length: 19 }, (_, i) => (
              <option value={i + 2} key={i}>
                {i + 2}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.option}>
          Max Rounds:{" "}
          <select
            value={maxRounds}
            onChange={(e) => {
              setMaxRounds(e.target.value);
            }}
            disabled={!owner}
          >
            {Array.from({ length: 9 }, (_, i) => (
              <option value={i + 2} key={i}>
                {i + 2}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.option}>
          Turn Time (in seconds):{" "}
          <select
            value={turnTime}
            disabled={!owner}
            onChange={(e) => {
              setTurnTime(e.target.value);
            }}
          >
            {Array.from({ length: 20 }, (_, i) => (
              <option value={(i + 1) * 10} key={i}>
                {(i + 1) * 10}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.option}>
          Number of options:{" "}
          <select
            value={wordOptions}
            disabled={!owner}
            onChange={(e) => {
              setWordOptions(e.target.value);
            }}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option value={i + 1} key={i}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button onClick={startRoom} className={styles.button} disabled={!owner}>
        Start Game
      </button>
    </div>
  );
}
