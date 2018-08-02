const fs = require('fs');
const path = require('path');
const utf8 = require('utf8');

const messagesFolder = 'messages';

let chatData = [];

async function convertFiles() {
    let folderNames;
    folderNames = fs.readdirSync(messagesFolder);

    for (let i = 0; i < folderNames.length; i++) {
        let filePath = path.join(messagesFolder, folderNames[i], 'message.json');
        let convertedFilePath = path.join(messagesFolder, folderNames[i], 'message_converted.json');
        if (fs.existsSync(filePath)) {
            let convertedData;
            if (!fs.existsSync(convertedFilePath)) {
                let data = fs.readFileSync(filePath);

                convertedData = utf8.decode(JSON.stringify(JSON.parse(data)));

                fs.writeFileSync(convertedFilePath, convertedData);
            }
            else {
                convertedData = fs.readFileSync(convertedFilePath);
            }

            chatData[folderNames[i]] = JSON.parse(convertedData);
        }
    }
}

module.exports = {
    convertFiles,
    chatData
};
