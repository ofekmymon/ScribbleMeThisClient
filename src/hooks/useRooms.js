// import axios from "axios";
import { useState, useEffect } from "react";
import { socket } from "../socket";

export function enterQuickPlay(player) {
  socket.emit("quick-play", player);
}

export function createPrivate(player) {
  socket.emit("create-private", player);
}

export function joinPrivate(player, code) {
  socket.emit("request-to-join", player, code);
}

export function useRooms() {
  const [currentRoom, setCurrentRoom] = useState(null);

  useEffect(() => {
    //listens for changes in room
    // sets the room for the first time
    socket.emit("get-room");

    socket.on("room-update", (room) => {
      setCurrentRoom(room);
      console.log("room updated");
    });
    return () => {
      socket.off("room-update");
    };
  }, []);
  return currentRoom;
}
export function useTurnEnded() {
  const [turnEnded, setTurnEnded] = useState(false);

  useEffect(() => {
    socket.on("turn-ended", () => {
      setTurnEnded(true);
    });
    socket.on("continue-game", () => {
      setTurnEnded(false);
    });

    return () => {
      socket.off("turn-ended");
      socket.off("continue-game");
    };
  }, []);

  return turnEnded;
}

export function useSessionEnded() {
  const [sessionEnded, setSessionEnded] = useState(false);

  useEffect(() => {
    socket.on("end-session", () => {
      setSessionEnded(true);
    });
    socket.on("continue-game", () => {
      setSessionEnded(false);
    });

    return () => {
      socket.off("session-ended");
      socket.off("continue-game");
    };
  }, []);

  return sessionEnded;
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
      setDrawing(data);
    });
    return () => {
      socket.off("update-drawing");
    };
  }, []);

  return drawing;
}
