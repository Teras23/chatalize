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

router.get('/data', (req, res) => {
    res.send(an.anayizeAll(chatData.messages));
});

router.get('/chat/:chatName', (req, res) => {
    const chatName = req.params['chatName'];

    let messageCount = an.getMessageCount(chatData.messages[chatName]);
    let totalByPerson = an.getTotalByPerson(chatData.messages[chatName]);
    let conversationStarters = an.getConversationStarters(chatData.messages[chatName]);
    let longestTime = an.longestTimeBetweenConversations(chatData.messages[chatName]);
    let averageWords = an.averageMessageLength(chatData.messages[chatName]);

    for (let i = 0; i < chatData.messages[chatName]['messages'].length; i++) {
        let date = new Date(chatData.messages[chatName]['messages'][i].timestamp_ms);
        chatData.messages[chatName]['messages'][i].timestamp = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDay() + 1) + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }

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

router.get('/chat/:chatName/messages', (req, res) => {
    let startTime = parseInt(req.query.start);
    let endTime = parseInt(req.query.end);
    let message = req.query.msg;
    const chatName = req.params['chatName'];

    let messages = chatData.messages[chatName]['messages'];

    startTime = isNaN(startTime) ? undefined : startTime;
    endTime = isNaN(endTime) ? undefined : endTime;
    console.log(startTime, endTime, message);

    messages = messages.filter(msg => {
        return msg["content"] !== undefined
    });

    if (startTime !== undefined) {
        messages = messages.filter(msg => {
            return msg["timestamp_ms"] >= startTime
        });
    }

    if (endTime !== undefined) {
        messages = messages.filter(msg => {
            return msg["timestamp_ms"] <= endTime
        });
    }

    if (message !== undefined) {
        messages = messages.filter(msg => {
            return msg["content"].search(new RegExp(message, "i")) !== -1
        });
    }

    for (let i = 0; i < messages.length; i++) {
        let date = new Date(messages[i].timestamp_ms);
        messages[i].timestamp = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDay() + 1) + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }

    res.send({
        messages: messages.reverse(),
        ownerName: chatData.ownerName
    });
});

router.get('/chat/:chatName/data', (req, res) => {
    const chatName = req.params['chatName'];
    res.send(an.analizeList(chatData.messages[chatName]));
});

module.exports = router;
