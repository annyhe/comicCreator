# Create comics with JavaScript and Salesforce

Ever wanted to create comics with JavaScript, with 1 click button backup and distribution? Find out how in this presentation! I'll demo my work flow, from selecting sketches from google drive, to assembling images and text in a panel, to saving and publishing the comics.


### FEATURES
- post comic panels to cloudinary
- save to salesforce: create new comic record with name, json, and url from cloudinary 
- from salesforce record, click on button to edit comic 
- load sketches from google drive to edit 

### TODO
administrative
- update READme with screenshots of JS app and Salesforce

###### app
- text on "Load from google drive" to "close", or hide it when the image grid is open
- image loaded from json needs to have transformer, to make it bigger/smaller
- on edit text: textarea is very far from the text
- consider sending raw binary instead of base64 over to salesforce, as the data field was 199KB
- button to remove all from the rectangle/stage
- button to mirror the image, where does it go? 3 places
- name the panel: use einstein object detection for suggestions? goal: minimize typing while being descriptive

###### Salesforce 
- thumbnail status in Salesforce: on edit record, show the thumbnail in the JS app
- multi-panel: how to model that in Salesforce?
- clean up Salesforce org
- create Salesforce reports and dashboards to track productivity


