import axios from "axios";
import { socket } from "../socket";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export async function getWords(numberOfWords) {
  const request = await axios.post(`${SERVER_URL}/api/get-words`, {
    numberOfWords,
  });
  const response = await request.data;
  console.log(response);

  if (response.status === "success") {
    return response.words;
  }
  throw request.message;
}

export function wordChosen(word) {
  socket.emit("word-chosen", word);
}
