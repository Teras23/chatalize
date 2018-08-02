const express = require('express');
const fl = require('../bin/fileLoader');

let router = express.Router();

const chatData = fl.chatData;

/* GET home page. */
router.get('/', (req, res, next) => {
    let infoList = chatDataToList(chatData);

    infoList.sort((first, second) => {
        return first.messageCount < second.messageCount ? 1 : first.messageCount > second.messageCount ? -1 : 0;
    });

    res.render('index', {title: "Chats", files: infoList});
});

router.get('/chat/:chatName', (req, res) => {
    const chatName = req.params['chatName'];

    let messageCount = getMessageCount(chatData[chatName]);
    res.render('chat', {chatName: chatData[chatName]['title'], messageCount: messageCount, messages: chatData[chatName]['messages']});
});

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

function getMessageCount(chatJson) {
    return chatJson['messages'].length;
}

module.exports = router;
