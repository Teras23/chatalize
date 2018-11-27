# Chatalize
Node program to analyze your chats

## How to use
Currently only support Facebook chats.

### Downloading chats
To download your Facebook chats in the right format 
1. Got to [https://www.facebook.com/your_information/](https://www.facebook.com/your_information/).
2. Choose _download your information_
3. Data range: _All of my data_, Format: _JSON_, Media quility (not important): Low
4. Select only messages.
5. Create file
6. Facebook will take a couple of hours to collect and pack your data
7. Download the data

### Setting up the program
Make sure you have [node.js](https://nodejs.org/en/download/) and npm (should come with node) installed.
1. `git clone https://github.com/Teras23/chatalize.git`
2. `cd chatalize`
3. `npm install`
4. Move all the conversation forlders into `chatalize/messages` folder (from `messages/inbox` and `messages/archived_threads`)
5. The `messages` folder should have folders in it that contains your friend's names

### Running
1. `npm start`  
2. Might take a minute or two for the files to be converted
3. Go to `localhost:3000`
