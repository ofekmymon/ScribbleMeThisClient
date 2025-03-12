import React from "react";
import styles from "./EndSession.module.css";
import { useEffect, useState } from "react";
import { socket } from "../../socket";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
export default function EndSession() {
  const [countdown, setCountdown] = useState("-");
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socket.on("update-countdown", (countdown) => {
      setCountdown(countdown);
    });
    return () => {
      socket.off("update-countdown");
    };
  });

  useEffect(() => {
    socket.emit("get-score-sorted-players");
    socket.once("players-sorted-by-score", (players) => {
      setPlayers(players);
    });
    return () => socket.off("players-sorted-by-score");
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        This Session Has Ended! Here Are The Winners:
      </div>
      <div className={styles.winnerList}>
        {players[1] ? <Player player={players[1]} key={players[1].id} /> : ""}
        {players[0] ? <Player player={players[0]} key={players[0].id} /> : ""}
        {players[2] ? <Player player={players[2]} key={players[2].id} /> : ""}
      </div>
      <div className={styles.playerList}>
        {players?.length > 3
          ? players
              .slice(3)
              .map((player, index) => (
                <Player player={player} key={player.id} />
              ))
          : ""}
      </div>
      <div className={styles.countdown}>Next game in: {countdown}</div>
    </div>
  );
}
const Player = ({ player }) => {
  const color =
    player.rank === 1
      ? "gold"
      : player.rank === 2
      ? "silver"
      : player.rank === 3
      ? "brown"
      : "white";
  return (
    <div
      className={
        player.rank > 3 ? styles.playerContainer : styles.winnerContainer
      }
    >
      <div className={styles.avatarContainer}>
        {/* for case that has is empty */}
        {player.hat !== "empty" ? (
          <img
            className={styles.hat}
            src={`${SERVER_URL}/images/Hats/${player.hat}`}
            alt="hat"
          ></img>
        ) : (
          <div className={styles.hat}></div>
        )}
        <img
          src={`${SERVER_URL}/images/Characters/${player.avatar}`}
          className={styles.avatar}
          alt="avatar"
        ></img>
      </div>
      <div style={{ color: color }} className={styles.details}>
        <div>{player.name}</div>
        <div>Total Score: {player.score}</div>
        <div>Rank: {player.rank}#</div>
      </div>
    </div>
  );
};
