const express = require('express');
const fl = require('../bin/file_loader');
const an = require('../bin/analizer');

let router = express.Router();

const chatData = fl.chatData;

/* GET home page. */
router.get('/', (req, res, next) => {
    an.addParticipantsObject(chatData);
    let infoList = an.chatDataToList(chatData);

    infoList.sort((first, second) => {
        return first.messageCount < second.messageCount ? 1 : first.messageCount > second.messageCount ? -1 : 0;
    });

    res.render('index', {title: "Chats", files: infoList});
});

router.get('/chat/:chatName', (req, res) => {
    const chatName = req.params['chatName'];

    let messageCount = an.getMessageCount(chatData[chatName]);
    let totalByPerson = an.getTotalByPerson(chatData[chatName]);
    res.render('chat', {
        fileName: chatName,
        chatName: chatData[chatName]['title'],
        messageCount: messageCount,
        messages: chatData[chatName]['messages'],
        totalByPerson: totalByPerson
    });
});

router.get('/chat/:chatName/data', (req, res) => {
    const chatName = req.params['chatName'];
    res.send(an.analizeList(chatData[chatName]));
});

module.exports = router;
