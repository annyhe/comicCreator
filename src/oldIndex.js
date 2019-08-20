import React, { useRef, useState } from "react";
import { render } from "react-dom";
import Handler from "./Handler"; // to resize image
import { Stage, Layer, Image, Rect } from "react-konva";
import useImage from "use-image";
import Crop from "./Crop";
import EditableText from "./EditableText";
import toCrop from "./toCrop.png";

const LionImage = props => {
  const [image] = useImage(props.url || toCrop);
  return (
    <Image
      style={{ maxWidth: "100%" }}
      draggable
      name={props.url || "lion"}
      image={image}
    />
  );
};

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
  return (
    <div>
      <button onClick={props.addText}>Add text</button>
      <button
        onClick={() => {
          const dataURL = stageRef.getStage().toDataURL();
          downloadURI(dataURL, "stage.png");
        }}
      >
        Save to image
      </button>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={e => setSelectedShapeName(e.target.name())}
        ref={stageRef}
      >
        <Layer>
          <Rect
            x={100}
            y={100}
            width={400}
            height={500}
            stroke="black"
            draggable
            fill="white"
          />
          {props.children}
          <Handler selectedShapeName={selectedShapeName} />
        </Layer>
      </Stage>
    </div>
  );
}

function App() {
  const [blobs, setBlob] = useState([]);
  const [texts, setTexts] = useState([]);
  return (
    <div>
      <Crop
        saveCroppedImage={croppedImageUrl =>
          setBlob([...blobs, croppedImageUrl])
        }
      />
      <KonvaStage addText={() => setTexts([...texts, "hi"])}>
        {texts.map((textValue, index) => (
          <EditableText key={index} textValue={textValue} />
        ))}
        {blobs.map((blob, index) => (
          <LionImage key={index} url={blob} alt={"cropped image " + index} />
        ))}
      </KonvaStage>
    </div>
  );
}

render(<App />, document.getElementById("root"));
