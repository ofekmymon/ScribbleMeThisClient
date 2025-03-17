import { useEffect } from "react";
import styles from "./GameScreen.module.css";
import Players from "./GameScreenComponents/Players/Players";
import Chat from "./GameScreenComponents/Chat/Chat";
import RoundsCounter from "./GameScreenComponents/RoundsCounter/RoundsCounter";
import WordToGuess from "./GameScreenComponents/WordToGuess/WordToGuess";
import Canvas from "./GameScreenComponents/Canvas/Canvas";
import Words from "./GameScreenComponents/Words/Words";
import TurnEnded from "./GameScreenComponents/TurnEnded/TurnEnded";
import EndSession from "./GameScreenComponents/EndSession/EndSession";
import SetSettings from "./GameScreenComponents/SetSettings/SetSettings";
import { useRooms, useTurnEnded, useSessionEnded } from "../hooks/useRooms";
import { socket } from "../socket";

export default function GameScreen() {
  const currentRoom = useRooms();
  const turnEnded = useTurnEnded();
  const sessionEnded = useSessionEnded();
  console.log(currentRoom);

  useEffect(() => {
    socket.emit("player-joined");
  }, []);

  if (!currentRoom) return <p>Loading room...</p>;

  // some important values
  const youTurn =
    socket.id === currentRoom.players[0].id && currentRoom.players.length > 1; // checks if its this clients turn
  const wordChosen = currentRoom.wordChosen;
  const didGuess = currentRoom.guessers.some((id) => id === socket.id);

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
          {!wordChosen && !turnEnded && !sessionEnded ? (
            <div className={styles.status}>
              {`${currentRoom.players[0].name} is choosing a word!`}{" "}
            </div>
          ) : (
            <WordToGuess
              word={wordChosen}
              youTurn={youTurn}
              didGuess={didGuess}
            />
          )}
        </div>
      </div>
      <div className={styles.gameWrap}>
        <div className={styles.players}>
          <Players players={currentRoom.players} playerId={socket.id} />
        </div>
        <div className={styles.canvasContainer}>
          {/* Displays the current state of the game */}
          {currentRoom.state === "private/settings" ? (
            <SetSettings
              owner={currentRoom.owner === socket.id}
              room={currentRoom}
            />
          ) : turnEnded ? (
            <TurnEnded wordChosen={wordChosen} />
          ) : sessionEnded ? (
            <EndSession />
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
