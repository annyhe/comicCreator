import React, { useState, useEffect } from "react";

function ImageGrid(props) {
  return (
    <div className="wrapper">
      <p className="cross">
        <button onClick={props.closeImageGrid}>Close</button>
      </p>
      <div className="thumbnails grid">
        <a href="#">
          <img src="https://source.unsplash.com/featured/?man" alt="" />
        </a>
        <a href="#">
          <img src="https://source.unsplash.com/featured/?woman" alt="" />
        </a>
        <a href="#">
          <img src="https://source.unsplash.com/featured/?design" alt="" />
        </a>
        <a href="#">
          <img src="https://source.unsplash.com/featured/?sky" alt="" />
        </a>
        <a href="#">
          <img src="https://source.unsplash.com/featured/?tree" alt="" />
        </a>
        <a href="#">
          <img src="https://source.unsplash.com/featured/?cat" alt="" />
        </a>
        <a href="#">
          <img src="https://source.unsplash.com/featured/?dog" alt="" />
        </a>
        <a href="#">
          <img src="https://source.unsplash.com/featured/?office" alt="" />
        </a>
        <a href="#">
          <img src="https://source.unsplash.com/featured/?sea" alt="" />
        </a>
        <a href="#">
          <img src="https://source.unsplash.com/featured/?green" alt="" />
        </a>
        <a href="#">
          <img src="https://source.unsplash.com/featured/?fashion" alt="" />
        </a>
        <a href="#">
          <img
            src="https://source.unsplash.com/featured/?architecture"
            alt=""
          />
        </a>
        <a href="#">
          <img src="https://source.unsplash.com/featured/?art" alt="" />
        </a>
        <a href="#">
          <img src="https://source.unsplash.com/featured/?style" alt="" />
        </a>
        <a href="#">
          <img src="https://source.unsplash.com/featured/?animal" alt="" />
        </a>
        <a href="#">
          <img src="https://source.unsplash.com/featured/?home" alt="" />
        </a>
      </div>
    </div>
  );
}

export default ImageGrid;
