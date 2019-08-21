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
  const saveToSalesforce = () => {
    const url = "/api/saveToCloud";
    const dataObject = {
      name: "example.jpg",
      json: stageRef.current.toJSON(),
      data: stageRef.current.toDataURL()
    };

    fetch(url, {
      method: "POST", // or 'PUT'
      body: JSON.stringify(dataObject), // data can be `string` or {object}!
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(recordID => console.log("Success:", 'https://choochoochoo-dev-ed.lightning.force.com/lightning/r/Comic__c/' + recordID + '/view'))
      .catch(error => console.error("Error:", error));
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
        <button onClick={saveToSalesforce}>Save to Salesforce</button>
      </div>
      <button
        onClick={() => {
          console.log("set to json");
          const { blobMap } = props;
          const json = stageRef.current.toJSON();
          const obj = JSON.parse(json);
          const childNodes = obj.children[0].children;
          // loop through and find image nodes. change their blob to base64
          childNodes.forEach(child => {
            if (child.className === "Image") {
              let { name } = child.attrs;
              if (blobMap[name]) {
                child.attrs.name = blobMap[name];
                console.log("success", name, child.attrs.name);
              }
            }
          });

          console.log("find blob url from here", obj);
          localStorage.setItem("konva", JSON.stringify(obj));
        }}
      >
        Save JSON to browser
      </button>
      <button onClick={props.loadStage}>Load Stage</button>
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
