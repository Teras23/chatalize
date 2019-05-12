const express = require('express');
const fl = require('../bin/file_loader');
const an = require('../bin/analizer');

let router = express.Router();

const chatData = fl.chatData;

/* GET home page. */
router.get('/', (req, res, next) => {
    an.addParticipantsObject(chatData.messages);
    let infoList = an.chatDataToList(chatData.messages);

    infoList.sort((first, second) => {
        return first.messageCount < second.messageCount ? 1 : first.messageCount > second.messageCount ? -1 : 0;
    });

    res.render('index', {title: "Chats", files: infoList});
});


router.get('/chat/:chatName', (req, res) => {
    const chatName = req.params['chatName'];

    let messageCount = an.getMessageCount(chatData.messages[chatName]);
    let totalByPerson = an.getTotalByPerson(chatData.messages[chatName]);
    let conversationStarters = an.getConversationStarters(chatData.messages[chatName]);
    let longestTime = an.longestTimeBetweenConversations(chatData.messages[chatName]);
    let averageWords = an.averageMessageLength(chatData.messages[chatName]);

    res.render('chat', {
        fileName: chatName,
        chatName: chatData.messages[chatName]['title'],
        messageCount: messageCount,
        messages: chatData.messages[chatName]['messages'],
        messagesSnippet: chatData.messages[chatName]['messages'].slice(0, 25).reverse(),
        totalByPerson: totalByPerson,
        conversationStarters: conversationStarters,
        longestTime: longestTime,
        averageWords: averageWords,
        ownerName: chatData.ownerName
    });
});

router.get('/chat/:chatName/data', (req, res) => {
    const chatName = req.params['chatName'];
    res.send(an.analizeList(chatData.messages[chatName]));
});

module.exports = router;
