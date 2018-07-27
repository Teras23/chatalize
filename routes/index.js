let express = require('express');
let fs = require('fs');
let path = require('path');
let router = express.Router();

const messagesFolder = 'messages';

/* GET home page. */
router.get('/', (req, res, next) => {
    fs.readdir(messagesFolder, (err, fileNames) => {
        renderChatNamesList(res, fileNames);
    });
});

router.get('/chat/:chatName', (req, res) => {
    console.log(req.params);
    res.render('chat', {test: req.params['chatName']});
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
            fs.readFile(path.join(messagesFolder, fileNames[i], 'message.json'), 'utf-8', (err, fileData) => {
                if (err === null) {
                    let chatJson = JSON.parse(fileData);
                    chatNames.push(chatJson['title']);
                    console.log(chatJson['title'], i);
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

function readChat(folder) {
    fs.readFile(path.join(messagesFolder, folder, 'message.json'), 'utf-8', (err, file) => {
        console.log(file);
    });
}

module.exports = router;
