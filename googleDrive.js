const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

function authList() {
  let credentials;
  return new Promise(function(resolve, reject) {
    fs.readFile("credentials.json", function(err, content) {
      if (err) reject("Error loading client secret file:", err);
      else resolve(content);
    });
  })
    .then(content => {
      credentials = JSON.parse(content);
      return authorize();
    })
    .then(token => {
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );
      oAuth2Client.setCredentials(JSON.parse(token));
      return oAuth2Client;
    });
}

function authorize() {
  // Check if we have previously stored a token.
  return new Promise(function(resolve) {
    fs.readFile(TOKEN_PATH, function(err, token) {
      // TODO: test
      if (err) resolve(getAccessToken(oAuth2Client, callback));
      else resolve(token);
    });
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("Enter the code from that page here: ", code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function uploadFile(auth, name, base64) {
  const data = base64.replace(/^data:image\/\w+;base64,/, "");
  const draftFileId = "1DZCNW_D6et1DuzI5oWGYtldTn6Oh-rNF";
  const fileName = name || "filename.jpg";
  return new Promise(function(resolve, reject) {
    fs.writeFile(fileName, data, { encoding: "base64" }, function(err) {
      if (err) reject(err);
      else resolve(data);
    });
  }).then(() => {
    return new Promise(function(resolve, reject) {
      const drive = google.drive({ version: "v3", auth });
      const fileMetadata = {
        name: fileName,
        parents: [draftFileId]
      };
      const media = {
        mimeType: "image/jpeg",
        body: fs.createReadStream(fileName)
      };
      drive.files.create(
        {
          resource: fileMetadata,
          fileId: draftFileId,
          media: media,
          fields: "id"
        },
        (err, file) => {
          if (err) {
            // reject might not be defined here?
            reject("error from upload file", err);
          } else {
            // delete the file
            fs.unlinkSync(fileName);
            resolve(file.data.id);
          }
        }
      );
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
  const sketchFolderId = "1DrDgaLNaKtBh4cHJIuSwMdIuLFibvgj4";
  return new Promise(function(resolve, reject) {
    const drive = google.drive({ version: "v3", auth });
    drive.files.list(
      {
        pageSize: 10,
        fileId: sketchFolderId,
        fields:
          "nextPageToken, files(id, name, parents, mimeType, modifiedTime)",
        q: `'${sketchFolderId}' in parents`
      },
      (err, res) => {
        if (err) reject("The google drive API returned an error: " + err);
        const files = res.data.files;
        if (files.length) {
          resolve(files);
        } else {
          console.log("No files found.");
          resolve([]);
        }
      }
    );
  });
}

module.exports = { authList, listFiles, uploadFile };
