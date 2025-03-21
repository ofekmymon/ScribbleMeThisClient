import React from "react";
import styles from "./Players.module.css";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
export default function Players({ players, playerId }) {
  return (
    <div className={styles.container}>
      {players?.map((player) => (
        <Player
          player={player}
          you={player.id === playerId}
          youTurn={players[0].id === player.id && players.length > 1}
          key={player.id}
        />
      ))}
    </div>
  );
}

const Player = ({ player, youTurn, you }) => {
  return (
    <div className={`${styles.playerContainer}`}>
      <div className={styles.playerDetails}>
        <div className={styles.detail}>{player.name}</div>
        <div className={styles.detail}>Score:{player.score}</div>
        <div className={styles.detail}>{player.rank}#</div>
      </div>
      <div className={`${styles.avatarContainer} ${you ? styles.you : ""}`}>
        {player.hat !== "empty" ? (
          <img
            className={styles.hat}
            src={`${SERVER_URL}/images/Hats/${player.hat}`}
            alt="hat"
          ></img>
        ) : (
          ""
        )}
        <img
          className={styles.avatar}
          src={`${SERVER_URL}/images/Characters/${player.avatar}`}
          alt="avatar"
        ></img>
        {youTurn ? (
          <img
            src={`${SERVER_URL}/images/canvas.png`}
            className={styles.canvas}
            alt="His Turn"
          ></img>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
