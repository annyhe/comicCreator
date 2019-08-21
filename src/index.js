import React, { useState, useEffect } from "react";
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
      x={props.x || 100}
      y={props.y || 100}
      name={props.url || "lion"}
      image={image}
    />
  );
};

function App() {
  const [blobs, setBlob] = useState([]);
  const [blobMap, setBlobMap] = useState({});
  const [texts, setTexts] = useState([]);

  useEffect(() => {
    const {pathname} = window.location;
    const doGET = pathname.startsWith('/comics/');
    if (doGET) {
      const comicID = pathname.split('/').pop();
      fetch('/comics?id=' + comicID)
      .then(function(response) {
        return response.json();
      })
      .then(loadStage);      
    }
  }, []);
  // TODO: test with and without json param
  const loadStage = (optionalJSON) => {
    const str = typeof optionalJSON === 'string' ? optionalJSON : localStorage.getItem("konva");
    if (str) {
      const obj = JSON.parse(str);
      const texts = obj.children[0].children
        .filter(child => child.className === "Group")
        .filter(group => group.children[0].className === "Text")
        .map(group => group.children[0].attrs);
      setTexts(texts);
      const imageObjects = obj.children[0].children
        .filter(child => child.className === "Image")
        .map(obj => obj.attrs);

      // TODO: test base64 is in imageObjects[0]);
      setBlob(imageObjects);
    }
  };
  return (
    <div>
      <button>Load from Google Drive</button>
      <Crop
        setBlobMapping={([key, value]) => {
          blobMap[key] = value;
          setBlobMap(blobMap);
        }}
        saveCroppedImage={croppedImageUrl =>
          setBlob([...blobs, { url: croppedImageUrl }])
        }
      />
      <KonvaStage
        blobMap={blobMap}
        loadStage={loadStage}
        addText={() => setTexts([...texts, { text: "hi" }])}
      >
        {texts.map((textObject, index) => (
          <EditableText
            key={index}
            textValue={textObject.text}
            x={textObject.x || 100}
            y={textObject.y || 100}
          />
        ))}
        {blobs.map((blob, index) => {
          console.log(blob);
          return (
            <LionImage
              key={index}
              url={blob.name || blob.url}
              x={blob.x || 100}
              y={blob.y || 100}
              alt={"cropped image " + index}
            />
          );
        })}
      </KonvaStage>
    </div>
  );
}

render(<App />, document.getElementById("root"));
