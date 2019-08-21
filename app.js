const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cloudinary = require("cloudinary");
const authList = require("./googleDrive").authList;
const listFiles = require("./googleDrive").listFiles;
const uploadFile = require("./googleDrive").uploadFile;
const loginAndCreateComic = require("./jsforce").loginAndCreateComic;
const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// parse request body
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

// cloud = [cloudinary, salesforce]
app.post("/api/saveToCloud", (req, res) => {
  const { name, data, json } = req.body;
  return new Promise(function(resolve, reject) {
    cloudinary.v2.uploader.upload(
      data,
      {
        overwrite: true,
        invalidate: true
      },
      function(error, result) {
        if (result) {
          let cloudinaryImageURL = result.secure_url;
          console.log("cloudinary url", cloudinaryImageURL);
          resolve(loginAndCreateComic(name, json, cloudinaryImageURL));
        } else if (error) {
          console.log("Error from saveToCloudinary", error);
          reject(error);
        }
      }
    );
  }).then(recordID => {
    console.log("created record with ID", recordID);
    res.json(recordID);
  });
});

// get google drive sketchobook folder files
app.get("/api/getList", (req, res) => {
  authList()
    .then(oAuth2Client => listFiles(oAuth2Client))
    .then(files => {
      res.json(files);
    });
});

function postToGoogleDrive(name, data) {
    authList()
    .then(oAuth2Client => uploadFile(oAuth2Client, name, data))
    .then(fileID => {
      if (fileID) {
        res.json(fileID);
      }
    });
}

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log("App is listening on port " + port);
