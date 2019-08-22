FEATURES
- post comic panels to cloudinary
- save to salesforce: create new comic record with name, json, and url from cloudinary 
- from salesforce record, click on button to edit comic 
- load sketches from google drive to edit 

TODO
- image for cropping needs be in base64, use npm package image-to-base64
- image loaded from json needs to have transformer, to make it bigger/smaller
- on edit text: textarea is very far from the 
- save image needs to save rectangle, instead of the entire stage. Saving the entire stage exceeds POST size
- button to remove all from the rectangle/stage
- button to mirror the image, where does it go? 3 places
- name the panel: use einstein object detection for suggestions? goal: minimize typing while being descriptive
- multi-panel: how to model that in Salesforce?
- clean up Salesforce org

BUGS
- for text only: load stage, change something, load stage, expect to revert to loaded state, yet nothing changed