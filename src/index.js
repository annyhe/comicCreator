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
      onDragStart={el => {
        el.target.moveToTop();
      }}
      name={props.url || "lion"}
      image={image}
    />
  );
};

function App() {
  const [blobs, setBlob] = useState([]);
  const [texts, setTexts] = useState([]);
  const loadStage = () => {
    const str = localStorage.getItem("konva");
    if (str) {
      const texts = JSON.parse(str).children[0].children.filter((child) => child.className === 'Group').filter((group) => group.children[0].className === 'Text').map((group) => group.children[0].attrs)
      console.log('texts', texts);  
      setTexts(texts)          
    }
  }  
  return (
    <div>
      <Crop
        saveCroppedImage={croppedImageUrl =>
          setBlob([...blobs, croppedImageUrl])
        }
      />
      <KonvaStage loadStage={loadStage}
        addText={() => setTexts([...texts, {text: "hi"}])}>
        {texts.map((textObject, index) => (
          <EditableText key={index} textValue={textObject.text} x={textObject.x || 100} y={textObject.y || 100} />
        ))}
        {blobs.map((blob, index) => (
          <LionImage key={index} url={blob} alt={"cropped image " + index} />
        ))}
      </KonvaStage>
    </div>
  );
}

render(<App />, document.getElementById("root"));
