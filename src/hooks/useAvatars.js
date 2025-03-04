// Handles all interactions with server in relation to the avatars
import axios from "axios";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
export async function getAllAvatars() {
  try {
    const request = await axios.get(`${SERVER_URL}/api/get-avatars`);
    const response = request.data;
    return response;
  } catch (error) {
    console.error("Error Getting Avatars ", error);
  }
}

export async function getAllHats() {
  try {
    const request = await axios.get(`${SERVER_URL}/api/get-hats`);
    const response = request.data;
    return response;
  } catch (error) {
    console.error("Error Getting Hats ", error);
  }
}
