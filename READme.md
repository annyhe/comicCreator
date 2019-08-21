DONE
- save images to google drive, with base64 from POST body
- post to cloudinary
- save to salesforce: create new comic record with name, json, and url from cloudinary 
- load editable comic from salesforce record

TODO
- change the salesforce record page: button should go to 
http://localhost:3000/comics/{recordID}
- load sketches, images to be edited from google drive
    

BUGS
- CORB on accessing google drive file from Salesforce, causing image broken if formula(googleDriveURL). alternatives
- use google drive connect https://gyansys.com/2017/06/integrating-salesforce-google-drive-using-files-connect/
- Lighting component: get file from google drive
- Store files in salesforce, instead of google drive :(
- store files in cloudinary instead of google drive??? :) can see the image. :( How to send sketches to cloudinary? upload via web app?

- for text only: load stage, change something, load stage, expect to revert to loaded state, yet nothing changed