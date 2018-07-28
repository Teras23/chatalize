let express = require('express');
let fs = require('fs');
let path = require('path');
let stripBom = require('strip-bom');
let router = express.Router();

const messagesFolder = 'messages';

let chatNames = undefined;
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

        // renderChatNamesList(res, fileNames);
    });
});

router.get('/chat/:chatName', (req, res) => {
    const chatName = req.params['chatName'];

    console.log(chatName);
    console.log(chatToFileNames);

    readChat(chatToFileNames[chatName], (err, fileData) => {
        let chatJson = JSON.parse(fileData);
        let messageCount = getMessageCount(chatJson);
        console.log(messageCount);
        res.setEncoding('utf16');
        res.render('chat', {chatName: chatName, messageCount: messageCount});
    });
});

function renderChatNamesList(res, fileNames) {
    getChatNames(fileNames, (chatNames) => {
        res.render('index', {title: 'Chats', files: chatNames});
    });
}

function updateChatData(fileNames, callback) {
    chatData = [];

    function updateData(i) {
        if (i < fileNames.length) {
            readChat(fileNames[i], (err, fileData) => {
                if (err === null) {
                    chatData[fileNames[i]] = JSON.parse(fileData);
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

function getChatNames(fileNames, callback) {
    if (chatNames === undefined) {

        chatNames = [];

        function addChatName(i) {
            if (i < fileNames.length) {
                readChat(fileNames[i], (err, fileData) => {
                    if (err === null) {
                        let chatJson = JSON.parse(fileData);
                        chatNames.push(chatJson['title']);
                        chatToFileNames[chatJson['title']] = fileNames[i];
                    }
                    addChatName(i + 1);
                });
            }
            else {
                // TODO: cache chat list?
                callback(chatNames);
            }
        }

        addChatName(0);
    }
    else {
        callback(chatNames);
    }
}

function chatDataToList(cd) {
    let list = [];
    for (let key in cd) {
        list.push({
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
