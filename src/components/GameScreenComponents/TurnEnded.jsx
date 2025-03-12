import React from "react";
import styles from "./TurnEnded.module.css";
import { useEffect, useState } from "react";
import { socket } from "../../socket";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
export default function TurnEnded({ wordChosen }) {
  const [players, setPlayers] = useState([]);
  const [countdown, setCountdown] = useState("-");

  useEffect(() => {
    socket.emit("get-player-scores");
    socket.once("player-scores", (scores) => {
      setPlayers(scores);
    });
    return () => socket.off("player-scores");
  }, []);

  useEffect(() => {
    socket.on("update-countdown", (countdown) => {
      setCountdown(countdown);
    });
    return () => {
      socket.off("update-countdown");
    };
  });

  // const testList = [
  //   {
  //     name: "ofek",
  //     score: 123,
  //     newScore: 12,
  //     avatar: "bear.png",
  //     hat: "crown_hat.png",
  //   },
  //   {
  //     name: "asda",
  //     score: 12311,
  //     newScore: 122,
  //     avatar: "dino.png",
  //     hat: "onfire_hat.png",
  //   },
  // ];

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Turn Ended, The word was : {wordChosen}
      </div>
      <div className={styles.playerList}>
        {players
          ? players.map((player) => (
              <div className={styles.playerContainer}>
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
                <div className={styles.details}>
                  <div> +{player.newScore}</div>
                  <div>Total Score: {player.score}</div>
                  <div>New Ranking: {player.rank}#</div>
                </div>
              </div>
            ))
          : ""}
      </div>
      <div className={styles.countdown}>Next turn in: {countdown}</div>
    </div>
  );
}
