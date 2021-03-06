import React, { PureComponent } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import toCrop from './toCrop.png'; 
import "./App.css";

class Crop extends PureComponent { 
  state = {
    crop: '',
    croppedImageUrl: ''
  }
  // If you setState the crop in here you should return false.
  onImageLoaded = image => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop) => {
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      const base64Image = canvas.toDataURL('image/jpeg');
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        this.props.setBlobMapping([this.fileUrl, base64Image]);

        resolve(this.fileUrl);
      }, "image/jpeg");
    });
  }

  saveCroppedImage = () => {
    this.props.saveCroppedImage(this.state.croppedImageUrl);
  }

  render() {
    const { crop, croppedImageUrl } = this.state;
    const imageUrl = this.props.imageToCropUrl || toCrop;
    return (
      <div className="App">
        {imageUrl && (
          <ReactCrop
            src={imageUrl}
            crop={crop}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
        )}
        {croppedImageUrl && (
          <div><img alt="Crop" style={{ maxWidth: "100%" }} src={croppedImageUrl} />
          <button onClick={this.saveCroppedImage}>Add cropped image to panel</button>
          </div>
        )}
      </div>
    );
  }
}

export default Crop;