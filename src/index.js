import React, { useState } from "react";
import { render } from "react-dom";
import { Image } from "react-konva";
import useImage from "use-image";
import Crop from "./Crop";
import KonvaStage from "./KonvaStage";
import EditableText from "./EditableText";
import toCrop from "./toCrop.png";

const LionImage = props => {
  const [image] = useImage(props.url || toCrop);
  return (
    <Image
      style={{ maxWidth: "100%" }}
      draggable
      onDragStart={(el) => {el.target.moveToTop();}}
      name={props.url || "lion"}
      image={image}
    />
  );
};

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
