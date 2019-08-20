import React, { useState, useRef } from "react";
import { Stage, Layer, Line, Rect } from "react-konva";
import Handler from "./Handler"; // to resize image
const SHORT = 360;
const LONG = 510;
// function from https://stackoverflow.com/a/15832662/512042
function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function KonvaStage(props) {
  const stageRef = useRef(null);
  const [selectedShapeName, setSelectedShapeName] = useState([]);
  const [width, setWidth] = useState(SHORT);
  const [height, setHeight] = useState(LONG);
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState();
  const [isMouseClicked, setIsMouseClicked] = useState();
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
      <div className="stage">
        <button onClick={() => setIsDrawing(true)}>Start drawing</button>
        <button onClick={() => setIsDrawing()}>Stop drawing</button>
        <button onClick={props.addText}>Add text</button>
        <button
          onClick={() => {
            const dataURL = stageRef.current.toDataURL();
            downloadURI(dataURL, "stage.png");
          }}
        >
          Save to image
        </button>
        <button
          onClick={() => {
            setWidth(LONG);
            setHeight(SHORT);
          }}
        >
          Landscape
        </button>
        <button
          onClick={() => {
            setWidth(SHORT);
            setHeight(LONG);
          }}
        >
          Portrait
        </button>
      </div>
      <button
        onClick={() => {
            console.log('set to json');
            const json = stageRef.current.toJSON();
            localStorage.setItem("konva", json);            
        }}
      >
        Save JSON to browser
      </button>
      <Stage
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
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={e => setSelectedShapeName(e.target.name())}
        ref={stageRef}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              onDragStart={el => {
                el.target.moveToTop();
              }}
              points={line}
              draggable
              stroke="black"
            />
          ))}
          <Rect
            x={100}
            y={100}
            width={width}
            height={height}
            stroke="black"
            fill="white"
          />
          {props.children}
          <Handler selectedShapeName={selectedShapeName} />
        </Layer>
      </Stage>
    </div>
  );
}

export default KonvaStage;
