import React, { Component, useState } from "react";
import { render } from "react-dom";
import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";
import Crop from "./cropIndex";

// the first very simple and recommended way:
const LionImage = (props) => {
  const [image] = useImage(props.url || "https://konvajs.org/assets/lion.png");
  return <Image draggable image={image} />;
}; 
class Images extends Component { 
  render() {
    const {blobs} = this.props;
    const images = blobs.map((blob, index) => 
    <LionImage key={index} url={blob} alt={'cropped image ' + index} />)
    return (
      <div>
        <p>Prop Blobs: {blobs}</p>
        <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          { images }
        </Layer>
      </Stage>
      </div>
    );
  }
}

class App extends Component {
  state = {
    blobs: []
  }

  saveCroppedImage = (croppedImageUrl) => {
    this.setState({ blobs: [...this.state.blobs, croppedImageUrl]});
  }
  
  render() {
    const {blobs} = this.state;
    return (
      <div>
        <Crop saveCroppedImage={this.saveCroppedImage} />
        <Images blobs={blobs} />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
