import React, { Component, useState } from "react";
import { render } from "react-dom";
import {
  Stage,
  Layer,
  Image,
  Rect,
  Transformer,
  Group,
  Text, Tag
} from "react-konva";
import useImage from "use-image";
import Crop from "./cropIndex";

const LionImage = props => {
  const [image] = useImage(props.url || "https://konvajs.org/assets/lion.png");
  return <Image draggable image={image} />;
}; 
class EditableText extends Component {
  state = {
    selectedShapeName: "",
    textEditVisible: false,
    textX: 0,
    textY: 0,
    textValue: "Hello"
  };
  handleTextDblClick = e => {
    const absPos = e.target.getAbsolutePosition();
    this.setState({
      textEditVisible: true,
      textX: absPos.x,
      textY: absPos.y
    });
  };
  handleTextEdit = e => {
    this.setState({
      textValue: e.target.value
    });
  };
  handleTextareaKeyDown = e => {
    if (e.keyCode === 13) {
      this.setState({
        textEditVisible: false
      });
    }
  };
 
  render() {
    return (
      <div>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={this.handleStageMouseDown}
        >
          <Layer>

              <Text
                draggable
                name="text"
                text={this.state.textValue}
                x={225}
                y={295}
                fontSize={20}
                onDblClick={this.handleTextDblClick}
                fontSize={16}
                fontFamily="Calibri"
                fill="black"
                width={220}
                padding={15}
                align="center"
              />
          </Layer>
        </Stage>
        <textarea
          value={this.state.textValue}
          style={{
            display: this.state.textEditVisible ? "block" : "none",
            position: "absolute",
            top: this.state.textY + "px",
            left: this.state.textX + "px"
          }}
          onChange={this.handleTextEdit}
          onKeyDown={this.handleTextareaKeyDown}
        />
      </div>
    );
  }
}

class KonvaStage extends Component {
  render() {
    return (
      <div>
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer>
            <Rect
              x={100}
              y={100}
              width={400}
              height={600}
              stroke="black"
              draggable
              fill="white"
            />
            {this.props.children}
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
        <KonvaStage>
            {images}
            {/* <EditableText /> */}
            </KonvaStage>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
