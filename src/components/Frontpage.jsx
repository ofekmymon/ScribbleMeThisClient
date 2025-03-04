import React from "react";
// import Player from "../classes/Players";
import styles from "./Frontpage.module.css";
import { getAllAvatars, getAllHats } from "../hooks/useAvatars";
import { useEffect, useState } from "react";
import Player from "../classes/Players";
import { enterQuickPlay } from "../hooks/useRooms";
import { socket } from "../socket";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function Frontpage() {
  const [avatar, setAvatar] = useState("");
  const [hat, setHat] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function handleQuickPlay() {
    // sends a request to the server to connect the player to the socket, and find/create him a room.
    const player = new Player(socket.id, name, avatar, hat);
    const flag = nameValidator();
    if (flag) {
      enterQuickPlay(player);
    }
  }

  function nameValidator() {
    if (name.length < 2) {
      setError("Name needs to be longer than a letter");
      return false;
    } else {
      setError("");
      return true;
    }
  }

  return (
    <div className={styles.container}>
      <img className={styles.logo} src="./logo.png" alt="SCRIBBLE LOGO" />
      <div className={styles.details}>
        <div className={styles.characterContainer}>
          <div>{<HatSlider setUserHat={setHat} />}</div>
          <div>{<AvatarSlider setUserAvatar={setAvatar} />}</div>
        </div>
        {error.length > 0 ? <div className={styles.error}>{error}</div> : ""}
        <input
          type="text"
          className={styles.name}
          placeholder="Name"
          maxLength={15}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className={styles.buttonContainer}>
        <button
          onClick={handleQuickPlay}
          className={`${styles.button} ${styles.play}`}
        >
          Play
        </button>
        <button className={`${styles.button} ${styles.private}`}>
          Private Room
        </button>
      </div>
    </div>
  );
}

const AvatarSlider = ({ setUserAvatar }) => {
  const audio = new Audio("./changeAvatar.wav");
  const [avatars, setAvatars] = useState([]);
  const [avatarIndex, setAvatarIndex] = useState(0);
  useEffect(() => {
    async function getAvatars() {
      const avatars = await getAllAvatars();
      setAvatars(avatars);
      const randomIndex = Math.floor(Math.random() * avatars.length);
      setAvatarIndex(randomIndex);
      setUserAvatar(avatars[randomIndex]);
    }
    getAvatars();
  }, [setUserAvatar]);

  function handleRightArrow() {
    // if above length go to the first avatar
    audio.play();

    const newIndex = avatarIndex + 1 === avatars.length ? 0 : avatarIndex + 1;
    setAvatarIndex(newIndex);
    setUserAvatar(avatars[newIndex]);
  }

  function handleLeftArrow() {
    // if below 0 go to the last avatar
    audio.play();
    const newIndex =
      avatarIndex - 1 <= -1 ? avatars.length - 1 : avatarIndex - 1;
    setAvatarIndex(newIndex);
    setUserAvatar(avatars[newIndex]);
  }

  return (
    <div className={styles.slidingContainer}>
      <div
        onClick={() => {
          handleLeftArrow();
        }}
        className={`${styles.arrowLeft} ${styles.arrow}`}
      >
        ◄
      </div>

      {avatars && avatars.length > 0 ? (
        <div className={styles.avatarSlider}>
          <img
            className={styles.image}
            src={`${SERVER_URL}/images/Characters/${avatars[avatarIndex]}`}
            alt={`Avatar ${avatars[avatarIndex]}`}
          />
        </div>
      ) : (
        <p>Loading friends...</p>
      )}
      <div
        onClick={(e) => {
          handleRightArrow();
        }}
        className={`${styles.arrowRight} ${styles.arrow}`}
      >
        ►
      </div>
    </div>
  );
};

const HatSlider = ({ setUserHat }) => {
  const audio = new Audio("./changeAvatar.wav");
  const [hats, setHats] = useState([]);
  const [hatIndex, setHatIndex] = useState(0);
  useEffect(() => {
    async function getHats() {
      const hats = await getAllHats();
      const hatsFull = [...hats, "empty"];
      setHats(hatsFull);
      const randomIndex = Math.floor(Math.random() * hatsFull.length);
      setHatIndex(randomIndex); // first time is random
      setUserHat(hatsFull[randomIndex]); // set the data to send
    }
    getHats();
  }, [setUserHat]);

  function handleRightArrow() {
    // if above length go to the first avatar
    audio.play();
    const newIndex = hatIndex + 1 === hats.length ? 0 : hatIndex + 1;
    setHatIndex(newIndex);
    setUserHat(hats[newIndex]);
  }

  function handleLeftArrow() {
    // if below 0 go to the last avatar
    audio.play();
    const newIndex = hatIndex - 1 <= -1 ? hats.length - 1 : hatIndex - 1;
    setHatIndex(newIndex);
    setUserHat(hats[newIndex]);
  }

  return (
    <div className={`${styles.slidingContainer} ${styles.hatContainer}`}>
      <div
        onClick={() => {
          handleLeftArrow();
        }}
        className={`${styles.arrowLeft} ${styles.arrow}`}
      >
        ◄
      </div>

      {hats && hats.length > 0 ? (
        <div className={styles.hatSlider}>
          <img
            className={`${styles.image} ${styles.hatImage} ${
              hats[hatIndex] === "empty" ? styles.empty : ""
            }`}
            src={
              hats[hatIndex] !== "empty"
                ? `${SERVER_URL}/images/Hats/${hats[hatIndex]}`
                : null
            }
            alt={`Hat ${hats[hatIndex]}`}
          />
        </div>
      ) : (
        <p>Loading hats...</p>
      )}
      <div
        onClick={() => {
          handleRightArrow();
        }}
        className={`${styles.arrowRight} ${styles.arrow}`}
      >
        ►
      </div>
    </div>
  );
};
