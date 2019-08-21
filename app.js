const express = require('express');
const path = require('path');
const app = express();
const authList = require('./googleDrive').authList;
const listFiles = require('./googleDrive').listFiles;
const uploadFile = require('./googleDrive').uploadFile;

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// get google drive sketchobook folder files
app.get('/api/getList', (req,res) => {
    authList()
    .then((oAuth2Client) => listFiles(oAuth2Client))
    .then((files) => {
            res.json(files);
    })
});

app.post('/api/postImage', (req,res) => {
    authList()
    .then((oAuth2Client) => uploadFile(oAuth2Client))
    .then((fileID) => {
        if (fileID) {
            res.json(fileID);
        }
    })
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
