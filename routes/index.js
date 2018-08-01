let express = require('express');
let fs = require('fs');
let path = require('path');
const utf8 = require('utf8');
let router = express.Router();

const messagesFolder = 'messages';

let chatData;
let chatToFileNames = [];

/* GET home page. */
router.get('/', (req, res, next) => {
    fs.readdir(messagesFolder, (err, fileNames) => {
        updateChatData(fileNames, (chatData) => {

            let infoList = chatDataToList(chatData);

            infoList.sort((first, second) => {
                return first.messageCount < second.messageCount ? 1 : first.messageCount > second.messageCount ? -1 : 0;
            });

            res.render('index', {title: "Chats", files: infoList});
        });
    });
});

router.get('/chat/:chatName', (req, res) => {
    const chatName = req.params['chatName'];

    readChat(chatName, (err, fileData) => {
        let chatJson = JSON.parse(fileData);
        let messageCount = getMessageCount(chatJson);
        res.render('chat', {chatName: chatName, messageCount: messageCount, messages: chatData[chatName]['messages']});
    });
});

function updateChatData(fileNames, callback) {
    chatData = [];

    function updateData(i) {
        if (i < fileNames.length) {
            readChat(fileNames[i], (err, fileData) => {
                if(err === null) {
                    chatData[fileNames[i]] = JSON.parse(utf8.decode(JSON.stringify(JSON.parse(fileData))));
                }

                updateData(i + 1);
            });
        }
        else {
            callback(chatData);
        }
    }

    updateData(0);
}

function chatDataToList(cd) {
    let list = [];
    for (let key in cd) {
        list.push({
            fileName: key,
            title: cd[key]['title'],
            messageCount: cd[key]['messages'].length
        });
    }
    return list;
}

function readChat(chatName, callback) {
    let filePath = path.join(messagesFolder, chatName, 'message.json');
    fs.readFile(filePath, 'utf-8', (err, fileData) => {
        callback(err, fileData);
    });
}

function getMessageCount(chatJson) {
    return chatJson['messages'].length;
}

module.exports = router;
