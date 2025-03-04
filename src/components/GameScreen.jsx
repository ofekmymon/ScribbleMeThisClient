import React, { useState } from "react";
import styles from "./GameScreen.module.css";
import Players from "./GameScreenComponents/Players";
import Chat from "./GameScreenComponents/Chat";
import RoundsCounter from "./GameScreenComponents/RoundsCounter";
import WordToGuess from "./GameScreenComponents/WordToGuess";
import Canvas from "./GameScreenComponents/Canvas";
import Words from "./GameScreenComponents/Words";
import TurnEnded from "./GameScreenComponents/TurnEnded";
import { useRooms, useTurnEnded } from "../hooks/useRooms";
import { socket } from "../socket";

export default function GameScreen({}) {
  const { currentRoom } = useRooms();
  const turnEnded = useTurnEnded();

  if (!currentRoom) return <p>Loading room...</p>;
  // some important values
  const youTurn =
    socket.id === currentRoom.players[0].id && currentRoom.players.length > 1; // checks if its this clients turn
  const wordChosen = currentRoom.wordChosen;
  const didGuess = currentRoom.guessers.some(
    (player) => player.id === socket.id
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {/* If only 1 player, hides the header */}
        {currentRoom.players.length === 1 ? (
          <div className={styles.notification}>
            Waiting for 1 more player to begin
          </div>
        ) : (
          ""
        )}
        <div className={styles.roundsContainer}>
          <RoundsCounter
            round={currentRoom.round}
            rounds={currentRoom.rounds}
          />
        </div>
        <div className={styles.wordsContainer}>
          {/* Alternates between status of game and the word to guess */}
          <WordToGuess
            word={wordChosen}
            youTurn={youTurn}
            didGuess={didGuess}
          />
        </div>
      </div>
      <div className={styles.gameWrap}>
        <div className={styles.players}>
          <Players players={currentRoom.players} />
        </div>
        <div className={styles.canvasContainer}>
          {/* Displays either the canvas or the screen where you choose the word from */}
          {turnEnded ? (
            <TurnEnded wordChosen={wordChosen} />
          ) : youTurn && !wordChosen ? (
            <Words numberOfOptions={currentRoom.wordsOptionNumber} />
          ) : (
            <Canvas youTurn={youTurn} />
          )}
        </div>
        <div className={styles.chat}>
          <Chat />
        </div>
      </div>
    </div>
  );
}
