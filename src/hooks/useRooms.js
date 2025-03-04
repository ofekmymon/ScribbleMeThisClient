// import axios from "axios";
import { useState, useEffect } from "react";
import { socket } from "../socket";

export function enterQuickPlay(player) {
  socket.emit("quick-play", player);
}
export function useRooms() {
  const [currentRoom, setCurrentRoom] = useState(null);

  useEffect(() => {
    //listens for changes in room

    // sets the room for the first time
    socket.emit("get-room");

    socket.on("room-update", (room) => {
      setCurrentRoom(room);
    });
    return () => {
      socket.off("room-update");
    };
  }, []);
  console.log(currentRoom);

  return { currentRoom };
}
export function useTurnEnded() {
  const [turnEnded, setTurnEnded] = useState(false);

  useEffect(() => {
    socket.on("turn-ended", () => {
      setTurnEnded(true);
    });
    socket.on("change-turn", () => {
      setTurnEnded(false);
    });

    return () => {
      socket.off("turn-ended");
      socket.off("change-turn");
    };
  }, []);

  return turnEnded;
}

// export function usePlayers() {
//   const [players, setPlayers] = useState([]);

//   useEffect(() => {
//     socket.on("update-players", (players) => {
//       setPlayers(players);
//     });

//     return () => {
//       socket.off("update-players");
//     };
//   });
//   return players;
// }
