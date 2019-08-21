const express = require('express');
const path = require('path');
const app = express();
const authList = require('./googleDrive').authList;

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// An api endpoint that returns a short list of items
app.get('/api/getList', (req,res) => {
    // var list = ["item1", "item2", "item3"];
    const files = authList();
    res.json(files);
    console.log('Sent list of items', files);
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
