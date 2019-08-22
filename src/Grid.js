import React from "react";
// inspired by https://codepen.io/AkinBilgic
function ImageGrid(props) {
  return (
    <div className="wrapper">
      <p className="cross">
        <button onClick={props.closeImageGrid}>Close</button>
      </p>
      <div
        onClick={props.getSelectedImageUrl}
        className="thumbnails grid"
      >
        {props.images.map(image => (
          <a key={image.id}  href="#">
            <img src={image.url} alt={"google image ID " + image.id} />
          </a>
        ))}
      </div>
    </div>
  );
}

export default ImageGrid;
