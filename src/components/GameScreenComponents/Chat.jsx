import React, { useEffect } from "react";
import styles from "./Chat.module.css";
import { useState } from "react";
import { socket } from "../../socket";

export default function Chat() {
  const [messageToSend, setMessageToSend] = useState("");
  const [messages, setMessages] = useState([]);

  function handleSendingMessage() {
    if (messageToSend.trim().length >= 1) {
      socket.emit("send-message", messageToSend);
      setMessageToSend("");
    }
  }

  useEffect(() => {
    const audio = new Audio("./correctGuess.wav");

    socket.on("get-message", (newMessage) => {
      // listens for new messages and updates the state
      setMessages((prev) => [...prev, newMessage]);
      if (
        newMessage.type === "notification" &&
        newMessage.content === "Has Guessed The Word"
      ) {
        audio.play();
      }
    });

    return () => socket.off("get-message");
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.chat}>
        {messages.map((message, i) => (
          <Message message={message} key={i} />
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          className={styles.input}
          value={messageToSend}
          maxLength={30}
          onChange={(e) => {
            setMessageToSend(e.target.value);
          }}
          placeholder="Enter your guess here"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendingMessage();
            }
          }}
        />
        <button
          onClick={() => handleSendingMessage()}
          className={styles.enterButton}
        >
          Enter
        </button>
      </div>
    </div>
  );
}

const Message = ({ message }) => {
  if (message.type === "message") {
    return (
      <div
        className={`${styles.messageContainer} ${
          message.didGuess ? styles.guessed : ""
        }`}
      >
        <div className={styles.messageSender}>{message.sender}:</div>
        <div className={styles.messageContent}>{message.content}</div>
      </div>
    );
  } else {
    return (
      <div
        className={styles.notification}
      >{`${message.sender} ${message.content}`}</div>
    );
  }
};
