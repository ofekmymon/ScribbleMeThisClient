import React, { useState, useRef, useEffect } from "react";
import styles from "./Canvas.module.css";
import { ReactSketchCanvas } from "@xjamundx/react-sketch-canvas";
import { FaPaintBrush } from "react-icons/fa";
import { FaEraser } from "react-icons/fa6";
import { FaUndo } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { sendCanvas, useCanvas } from "../../hooks/useRooms";
import { socket } from "../../socket";

export default function Canvas({ youTurn }) {
  const [brushColor, setBrushColor] = useState("black");
  const [brushSlider, setBrushSlider] = useState(false);
  const [eraserSlider, setEraserSlider] = useState(false);
  const [brushValue, setBrushValue] = useState(4);
  const [eraserValue, setEraserValue] = useState(4);
  const canvasRef = useRef(null);
  const drawing = useCanvas(); // the updated canvas

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

  async function handleUndo() {
    try {
      await canvasRef.current.undo();
      const drawing = await canvasRef.current.exportPaths();
      socket.emit("update-canvas", drawing);
    } catch (e) {
      console.log(e);
    }
  }
  async function handleRedo() {
    try {
      await canvasRef.current.redo();
      const drawing = await canvasRef.current.exportPaths();
      socket.emit("update-canvas", drawing);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    // updates canvas
    async function updateCanvas() {
      if (drawing) {
        await canvasRef.current.clearCanvas();
        await canvasRef?.current.loadPaths(drawing);
      }
    }
    if (!youTurn) {
      updateCanvas();
    }
  }, [drawing, youTurn]);

  useEffect(() => {
    // listens for drawing actions.
    socket.on("reset-canvas", () => {
      if (canvasRef.current) {
        canvasRef.current.clearCanvas();
      }
    });
    return () => {
      socket.off("reset-canvas");
    };
  }, [canvasRef]);

  return (
    <div className={styles.container}>
      <ReactSketchCanvas
        ref={canvasRef}
        strokeWidth={brushValue}
        eraserWidth={eraserValue}
        strokeColor={brushColor}
        withViewBox={true}
        viewBoxHeight={800}
        viewBoxWidth={800}
        height="100%"
        width="100%"
        readOnly={!youTurn} //disable if its not your turn
        className={styles.canvas}
        onStroke={async () => {
          if (youTurn) {
            sendCanvas(await canvasRef.current.exportPaths());
          }
        }}
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
                  onClick={() => socket.emit("clear-canvas")}
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
                  onClick={async () => {
                    await handleUndo();
                  }}
                />
              </button>
            </div>
            <div className={styles.buttonWrapper}>
              <p className={styles.buttonText}>Redo</p>
              <button
                className={styles.buttonContainer}
                onClick={async () => {
                  await handleRedo();
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
