const fs = require('fs');
const path = require('path');
const utf8 = require('utf8');

const messagesFolder = 'messages';

let chatData = {
    messages: {},
    ownerName: null,
    participants: {}
};

async function convertFiles() {
    let folderNames;
    folderNames = fs.readdirSync(messagesFolder);

    for (let i = 0; i < folderNames.length; i++) {
        let filePath = path.join(messagesFolder, folderNames[i], 'message_1.json');
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

            chatData.messages[folderNames[i]] = JSON.parse(convertedData);
            for (let participant of chatData.messages[folderNames[i]].participants) {
                if (chatData.participants[participant.name] !== undefined) {
                    chatData.participants[participant.name] += 1
                }
                else {
                    chatData.participants[participant.name] = 1
                }
            }
        }
    }
    chatData.ownerName = Object.keys(chatData.participants).reduce(
        (a, b) => chatData.participants[a] > chatData.participants[b] ? a : b);
}

module.exports = {
    convertFiles,
    chatData
};
