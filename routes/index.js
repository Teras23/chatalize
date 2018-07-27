let express = require('express');
let fs = require('fs');
let path = require('path');
let router = express.Router();

const messagesFolder = 'messages';

let chatToFileNames = [];

/* GET home page. */
router.get('/', (req, res, next) => {
    fs.readdir(messagesFolder, (err, fileNames) => {
        renderChatNamesList(res, fileNames);
    });
});

router.get('/chat/:chatName', (req, res) => {
    const chatName = req.params['chatName'];

    console.log(chatName);
    console.log(chatToFileNames);

    readChat(chatToFileNames[chatName], (err, fileData) => {
        let chatJson = JSON.parse(fileData);
        let messageCount = getMessageCount(chatJson);
        console.log(chatToFileNames);
        console.log(messageCount);
        res.render('chat', {chatName: chatName, messageCount: messageCount});
    });
});

function renderChatNamesList(res, fileNames) {
    getChatNames(fileNames, (chatNames) => {
        res.render('index', {title: 'Chats', files: chatNames});
    });
}

function getChatNames(fileNames, callback) {
    let chatNames = [];

    function addChatName(i) {
        if(i < fileNames.length) {
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

function readChat(chatName, callback) {
    fs.readFile(path.join(messagesFolder, chatName, 'message.json'), 'utf-8', (err, fileData) => {
        callback(err, fileData);
    });
}

function getMessageCount(chatJson) {
    return chatJson['messages'].length;
}

module.exports = router;
