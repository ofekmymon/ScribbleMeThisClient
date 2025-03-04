import React, { useState, useRef, useEffect } from "react";
import styles from "./Canvas.module.css";
import { ReactSketchCanvas, eraseMode } from "react-sketch-canvas";
import { FaPaintBrush } from "react-icons/fa";
import { FaEraser } from "react-icons/fa6";
import { FaUndo } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

export default function Canvas({ youTurn }) {
  const [brushColor, setBrushColor] = useState("black");
  const [brushSlider, setBrushSlider] = useState(false);
  const [eraserSlider, setEraserSlider] = useState(false);
  const [brushValue, setBrushValue] = useState(4);
  const [eraserValue, setEraserValue] = useState(4);
  const canvasRef = useRef(null);

  function colorsGenerator() {
    const colorsList = [
      "black",
      "white",
      "red",
      "blue",
      "lightgreen",
      "yellow",
      "purple",
      "pink",
      "gray",
      "brown",
    ];
    return colorsList.map((itemColor) => {
      return (
        <div
          style={{ backgroundColor: itemColor }}
          className={styles.color}
          key={itemColor}
          onClick={() => setBrushColor(itemColor)}
        ></div>
      );
    });
  }

  useEffect(() => {
    const undoShortcut = (e) => {
      if (e.ctrlKey && e.key === "z") {
        try {
          e.preventDefault();
          canvasRef.current?.undo();
        } catch (e) {
          console.log(e);
        }
      }
    };
    // const redoShortcut = (e) => {
    //   if (e.ctrlKey && e.key === "r") {
    //     e.preventDefault();
    //     canvasRef.current?.redo();
    //   }
    // };
    window.addEventListener("keydown", undoShortcut);
    // window.addEventListener("keydown", redoShortcut);

    return () => {
      window.removeEventListener("keydown", undoShortcut);
      // window.removeEventListener("keydown", redoShortcut);
    };
  }, []);

  return (
    <div className={styles.container}>
      <ReactSketchCanvas
        ref={canvasRef}
        strokeWidth={!youTurn ? 0 : brushValue}
        eraserWidth={eraserValue}
        strokeColor={brushColor}
        className={styles.canvas}
      />
      {/* only render tools if its your turn */}
      {youTurn ? (
        <div className={styles.tools}>
          <div className={styles.colorsAndTrash}>
            <div className={styles.trash}>
              <div className={styles.buttonWrapper}>
                Clear
                <button
                  className={styles.buttonContainer}
                  onClick={() => {
                    canvasRef.current?.clearCanvas();
                  }}
                >
                  <FaTrash className={styles.icon} />
                </button>
              </div>
            </div>
            <input
              onChange={(e) => setBrushColor(e.target.value)}
              type="color"
              className={styles.customColor}
            />

            <div className={styles.colors}>{colorsGenerator()}</div>
          </div>
          <div className={styles.buttons}>
            <div className={styles.buttonWrapper}>
              <p className={styles.buttonText}>Brush</p>
              {brushSlider ? (
                <Slider value={brushValue} setValue={setBrushValue} />
              ) : (
                ""
              )}
              <button
                className={styles.buttonContainer}
                onClick={() => {
                  setBrushSlider(!brushSlider);
                  setEraserSlider(false);
                  canvasRef.current?.eraseMode(false);
                }}
              >
                <FaPaintBrush className={styles.icon} />
              </button>
            </div>

            <div className={styles.buttonWrapper}>
              <p className={styles.buttonText}>Eraser</p>
              {eraserSlider ? (
                <Slider value={eraserValue} setValue={setEraserValue} />
              ) : (
                ""
              )}
              <button
                className={styles.buttonContainer}
                onClick={() => {
                  setEraserSlider(!eraserSlider);
                  setBrushSlider(false);
                  canvasRef.current?.eraseMode(true);
                }}
              >
                <FaEraser className={styles.icon} />
              </button>
            </div>
            <div className={styles.buttonWrapper}>
              <p className={styles.buttonText}>Undo</p>
              <button className={styles.buttonContainer}>
                <FaUndo
                  className={styles.icon}
                  onClick={() => {
                    canvasRef.current?.undo();
                  }}
                />
              </button>
            </div>
            <div className={styles.buttonWrapper}>
              <p className={styles.buttonText}>Redo</p>
              <button
                className={styles.buttonContainer}
                onClick={() => {
                  canvasRef.current?.redo();
                }}
              >
                <FaRedo className={styles.icon} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.tools}></div>
      )}
    </div>
  );
}

const Slider = ({ value, setValue }) => {
  return (
    <div className={styles.sliderContainer}>
      <input
        type="range"
        min="1"
        max="100"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
};
