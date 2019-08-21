const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cloudinary = require("cloudinary");
const app = express();
const authList = require("./googleDrive").authList;
const listFiles = require("./googleDrive").listFiles;
const uploadFile = require("./googleDrive").uploadFile;
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

app.post("/api/saveToCloudinary", (req, res) => {
  console.log(req.body);
  const { name, data } = req.body;

  cloudinary.v2.uploader.upload(
    data,
    {
      overwrite: true,
      invalidate: true
    },
    function(error, result) {
      if (result) {
        res.json(result.secure_url);
      } else if (error) {
        console.log("Error from saveToCloudinary", error);
      }
    }
  );
});

// get google drive sketchobook folder files
app.get("/api/getList", (req, res) => {
  authList()
    .then(oAuth2Client => listFiles(oAuth2Client))
    .then(files => {
      res.json(files);
    });
});

app.post("/api/postImage", (req, res) => {
  console.log(req.body);
  const { name, data } = req.body;
  authList()
    .then(oAuth2Client => uploadFile(oAuth2Client, name, data))
    .then(fileID => {
      if (fileID) {
        res.json(fileID);
      }
    });
});

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log("App is listening on port " + port);
