TODO:

- load images from google drive
- save images to google drive

problems:
- load from json: text
// obj is the exported json
const texts = obj.children[0].children.filter((child) => child.className === 'Group').filter((group) => group.children[0].className === 'Text').map((group) => group.children[0].attrs)

- load from json: images: POST to google, get drive link, get base64 from that, then load into frame
- 

react-image-crop
- can load files from file picker, auto-loads from sample file in /src
- press button to save selected image as a blob

