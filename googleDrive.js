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
  return new Promise(function(resolve, reject) {
    fs.readFile("credentials.json", function(err, content) {
      if (err) reject("Error loading client secret file:", err);
      else resolve(content);
    });
  }).then(content => {
    return authorize(JSON.parse(content));
  });
}

/**
 * Create an OAuth2 client with the given credentials
 * @param {Object} credentials The authorization client credentials.
 */
function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  return new Promise(function(resolve) {
    fs.readFile(TOKEN_PATH, function(err, token) {
      // TODO: test
      if (err) resolve(getAccessToken(oAuth2Client, callback));
      else resolve(token);
    });
  })
    .then(token => {
      oAuth2Client.setCredentials(JSON.parse(token));
      return listFiles(oAuth2Client);
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

const base64 =
  "data:image/jpeg;base64,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";
const fileId = "1DZCNW_D6et1DuzI5oWGYtldTn6Oh-rNF";
function uploadFile(auth) {
  const data = base64.replace(/^data:image\/\w+;base64,/, "");

  const fileName = "filename.jpg";
  new Promise(function(resolve, reject) {
    fs.writeFile(fileName, data, { encoding: "base64" }, function(err) {
      if (err) reject(err);
      else resolve(data);
    });
  }).then(() => {
    const drive = google.drive({ version: "v3", auth });
    const fileMetadata = {
      name: fileName,
      parents: [fileId]
    };
    const media = {
      mimeType: "image/jpeg",
      body: fs.createReadStream(fileName)
    };
    drive.files.create(
      {
        resource: fileMetadata,
        fileId, // why not putting it into folder?
        media: media,
        fields: "id"
      },
      (err, file) => {
        if (err) {
          console.error(err);
        } else {
          console.log(
            "File Id: ",
            "https://drive.google.com/file/d/" + file.data.id + "/view"
          );
          // delete the file
          fs.unlinkSync(fileName);
        }
      }
    );
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
  return new Promise(function(resolve, reject) {
    const drive = google.drive({ version: "v3", auth });
    drive.files.list(
      {
        pageSize: 10,
        fileId: fileId,
        fields:
          "nextPageToken, files(id, name, parents, mimeType, modifiedTime)",
        q: `'${fileId}' in parents`
      },
      (err, res) => {
        if (err) reject("The google drive API returned an error: " + err);
        const files = res.data.files;
        if (files.length) {
          console.log("Files:", files);
          resolve(files);
        } else {
          console.log("No files found.");
          resolve([]);
        }
      }
    );
  });
}

module.exports = { authList };
