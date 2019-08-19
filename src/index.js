import React, { Component, useState } from "react";
import { render } from "react-dom";
import Portal from "./Portal"; // to render DOM nodes in Konva
import Handler from "./Handler"; // to resize image
import {
  Stage,
  Layer,
  Image,
  Rect,
  Group,
  Text
} from "react-konva";
import useImage from "use-image";
import Crop from "./Crop";
import EditableText from "./EditableText";
import toCrop from './toCrop.png';

const LionImage = props => {
  const [image] = useImage(props.url || toCrop);
  return <Image style={{ maxWidth: "100%" }} draggable name={props.url || 'lion'} image={image} />;
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

class KonvaStage extends Component {
  state = {
    selectedShapeName: ""
  };
  handleStageClick = e => {
    this.setState({
      selectedShapeName: e.target.name()
    });
  };

  handleExportClick = () => {
    const dataURL = this.stageRef.getStage().toDataURL();
    downloadURI(dataURL, "stage.png");
  };
  render() {
    return (
      <div>
        <button onClick={this.handleExportClick}>Save to image</button>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onClick={this.handleStageClick}
          ref={node => {
            this.stageRef = node;
          }}
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
            {/* <LionImage /> */}
            {this.props.children}
            <Handler selectedShapeName={this.state.selectedShapeName} />
            <EditableText textValue="how are you?" />
          </Layer>
        </Stage>
      </div>
    );
  }
}

class App extends Component {
  state = {
    blobs: []
  };
  saveCroppedImage = croppedImageUrl => {
    this.setState({ blobs: [...this.state.blobs, croppedImageUrl] });
  };

  render() {
    const { blobs } = this.state;
    const images = blobs.map((blob, index) => (
      <LionImage key={index} url={blob} alt={"cropped image " + index} />
    ));
    return (
      <div>
        <Crop saveCroppedImage={this.saveCroppedImage} />
        <KonvaStage>{images}</KonvaStage>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
