import { render } from "react-dom";
import React, { useState, useRef } from "react";
import { Stage, Layer, Line } from "react-konva";

function Canvas() {
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState();
  const [isMouseClicked, setIsMouseClicked] = useState();
  const stageRef = useRef(null);
  const handleMouseMove = () => {
    if (!isDrawing || !isMouseClicked) {
      return;
    }
    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    if (lines.length) {
      let lastLine = lines[lines.length - 1];
      lastLine = lastLine.concat([point.x, point.y]);
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    }
  };

  return (
    <div>
      <p>
        Click on Start Drawing to draw with mouse. You can drag the drawing
        around.
      </p>
      <button onClick={() => setIsDrawing(true)}>Start drawing</button>
      <button onClick={() => setIsDrawing()}>Stop drawing</button>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onContentMousedown={() => {
          if (!isDrawing) {
            return;
          }
          setIsMouseClicked(true);
          setLines([...lines, []]);
        }}
        onContentMousemove={handleMouseMove}
        onContentMouseup={() => {
          setIsDrawing(false);
          setIsMouseClicked(false);
        }}
        ref={stageRef}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line key={i} points={line} draggable stroke="black" />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

render(<Canvas />, document.getElementById("root"));

export default Canvas;
