import "./App.css";
import Frontpage from "./components/Frontpage";
import GameScreen from "./components/GameScreen.jsx";
import { socket } from "./socket.js";
import { useState, useEffect } from "react";
function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isInRoom, setIsInRoom] = useState(socket.rooms?.length > 0);
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onJoinRoom() {
      setIsInRoom(true);
      // socket.emit("player-joined");
    }

    function onLeaveRoom() {
      setIsInRoom(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("joined-room", () => {
      onJoinRoom();
    });
    socket.on("leave-room", onLeaveRoom);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("joined-room", onJoinRoom);
      socket.off("leave-room", onLeaveRoom);
    };
  }, []);

  function handleStates() {
    if (isInRoom) {
      return <GameScreen />;
    }
    return <Frontpage />;
  }

  return <div className="App">{handleStates()}</div>;
}

export default App;
