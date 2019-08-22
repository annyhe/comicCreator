import React, { useState, useEffect } from "react";

function ImageGrid(props) {
  return (
    <div className="wrapper">
      <p className="cross">
        <button onClick={props.closeImageGrid}>Close</button>
      </p>
      <div
        onClick={e => {
          if (e && e.target.nodeName === "IMG") {
            console.log(e.target.alt);
          }
        }}
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
