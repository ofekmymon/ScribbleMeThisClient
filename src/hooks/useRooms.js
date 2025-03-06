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

export function sendCanvas(data) {
  // sends to server current drawing path
  socket.emit("update-canvas", data);
}

export function useCanvas() {
  //gets the current drawing path from server
  const [drawing, setDrawing] = useState(undefined);

  useEffect(() => {
    socket.emit("get-drawing");

    socket.on("update-drawing", (data) => {
      console.log(data);
      setDrawing(data);
    });
    return () => {
      socket.off("update-drawing");
    };
  }, []);

  return drawing;
}
