import React, { Component } from "react";
import { render } from "react-dom";
import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";
import Crop from "./cropIndex";

// the first very simple and recommended way:
const LionImage = () => {
  const [image] = useImage("https://konvajs.org/assets/lion.png");
  return <Image draggable image={image} />;
};
// VERY IMPORTANT NOTES:
// at first we will set image state to null
// and then we will set it to native image instance when it is loaded
class URLImage extends React.Component {
  state = {
    image: null
  };
  componentDidMount() {
    this.loadImage();
  }
  componentDidUpdate(oldProps) {
    if (oldProps.src !== this.props.src) {
      this.loadImage();
    }
  }
  componentWillUnmount() {
    this.image.removeEventListener("load", this.handleLoad);
  }
  loadImage() {
    // save to "this" to remove "load" handler on unmount
    this.image = new window.Image();
    this.image.src = this.props.src;
    this.image.addEventListener("load", this.handleLoad);
  }
  handleLoad = () => {
    // after setState react-konva will update canvas and redraw the layer
    // because "image" property is changed
    this.setState({
      image: this.image
    });
    // if you keep same image object during source updates
    // you will have to update layer manually:
    // this.imageNode.getLayer().batchDraw();
  };
  render() {
    return (
      <Image
        x={this.props.x}
        y={this.props.y}
        image={this.state.image}
        draggable
        ref={node => {
          this.imageNode = node;
        }}
      />
    );
  }
}

class Images extends Component {
  state = {
    blob: ''
  }

  handleInputChange = (e) => {
    this.setState({ blob: e.target.value});
  }
  render() {
    return (
      <div>
        <p>Blob: {this.state.blob}</p>
        <input onChange={this.handleInputChange} value={this.blob} />
        <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <URLImage src={this.state.blob || "https://konvajs.org/assets/yoda.jpg"} x={150} />
          <LionImage />
        </Layer>
      </Stage>

      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <Crop />
        <Images />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
