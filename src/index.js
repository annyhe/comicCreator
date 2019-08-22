import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { Image } from "react-konva";
import useImage from "use-image";
import ImageGrid from "./Grid";
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
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [blobs, setBlob] = useState([]);
  const [googleImages, setGoogleImages] = useState([]);
  const [blobMap, setBlobMap] = useState({});
  const [texts, setTexts] = useState([]);
  const [showImageGrid, setImageGrid] = useState();

  useEffect(() => {
    const { pathname } = window.location;
    const doGET = pathname.startsWith("/comics/");
    if (doGET) {
      const comicID = pathname.split("/").pop();
      fetch("/comics?id=" + comicID)
        .then(function(response) {
          return response.json();
        })
        .then(loadStage);
    }
  }, []);
  // TODO: test with and without json param
  const loadStage = optionalJSON => {
    const str =
      typeof optionalJSON === "string"
        ? optionalJSON
        : localStorage.getItem("konva");
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
  const showGridWithData = () => {
    if (!googleImages || !googleImages.length) {
      fetch("/api/getList")
        .then(function(response) {
          return response.json();
        })
        .then(images => {
          const copyImages = images.map(image => {
            image.url = "http://drive.google.com/uc?export=view&id=" + image.id;
            return image;
          });
          setGoogleImages(copyImages);
          setImageGrid(true);
        });
    } else {
      setImageGrid(true);
    }
  };
  const getSelectedImageUrl = (e => {
    if (e && e.target.nodeName === "IMG") {
      const url = e.target.src;
      setSelectedImageUrl(url);
      console.log(url);
    }
  });

  return (
    <div>
      <button onClick={showGridWithData}>Load from Google Drive</button>
      {showImageGrid && (
        <ImageGrid
          getSelectedImageUrl={getSelectedImageUrl}
          images={googleImages}
          closeImageGrid={() => setImageGrid()}
        />
      )}
      <Crop
        imageToCropUrl={selectedImageUrl}
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
