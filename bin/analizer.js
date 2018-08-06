function analize(chatData) {
    let analized = {
        dailyCount: {},
        monthlyCount: {},
        totalCount: {},
        totalByPerson: {},
        timeBetweenMessages: {}
    };

    let total = chatData['messages'].length;

    let currentTime = new Date();
    let currentMonthlyDate = currentTime.toISOString().substr(0, 7);
    let currentDailyDate = currentTime.toISOString().substr(0, 10);

    if (analized.monthlyCount[currentMonthlyDate] === undefined) {
        analized.monthlyCount[currentMonthlyDate] = 0;
    }

    if (analized.dailyCount[currentDailyDate] === undefined) {
        analized.dailyCount[currentDailyDate] = 0;
    }

    analized.totalCount[currentDailyDate] = total;

    let lastTime = undefined;

    for (let i = 0; i < chatData['messages'].length; i++) {
        let time = new Date(chatData['messages'][i]['timestamp_ms']);
        let monthlyDate = time.toISOString().substr(0, 7);
        let dailyDate = time.toISOString().substr(0, 10);

        analized.dailyCount[dailyDate] =
            analized.dailyCount[dailyDate] ? analized.dailyCount[dailyDate] + 1 : 1;

        analized.monthlyCount[monthlyDate] =
            analized.monthlyCount[monthlyDate] ? analized.monthlyCount[monthlyDate] + 1 : 1;

        if (lastTime !== undefined) {
            let timeBetween = Math.ceil(Math.abs(lastTime - time) / 1000); // Seconds
            let timeBetweenLog = Math.round(Math.log10(timeBetween));

            if (timeBetweenLog >= 0) {
                analized.timeBetweenMessages[timeBetweenLog] =
                    analized.timeBetweenMessages[timeBetweenLog] ? analized.timeBetweenMessages[timeBetweenLog] + 1 : 1;
            }
        }

        analized.totalCount[dailyDate] = total;
        total--;
        lastTime = time;
    }

    return analized;
}

function analizeList(chatData) {
    const map = analize(chatData);
    let analized = {
        dailyCount: [],
        monthlyCount: [],
        totalCount: [],
        totalByPerson: [],
        timeBetween: []
    };

    for (const dc in map.monthlyCount) {
        analized.monthlyCount.push({
            date: dc,
            count: map.monthlyCount[dc]
        });
    }

    for (const dc in map.dailyCount) {
        analized.dailyCount.push({
            date: dc,
            count: map.dailyCount[dc]
        });
    }

    for (const dc in map.totalCount) {
        analized.totalCount.push({
            date: dc,
            total: map.totalCount[dc]
        });
    }

    for (const dc in map.timeBetweenMessages) {
        analized.timeBetween.push({
            time: dc,
            count: map.timeBetweenMessages[dc]
        });
    }

    return analized;
}

function getMessageCount(chatJson) {
    return chatJson['messages'].length;
}

function addParticipantsObject(chatJson) {
    for (let chat in chatJson) {
        let participantsString = "";
        let participants = chatJson[chat].participants;

        if (participants === undefined) {
            chatJson[chat].participantsString = "Unknown";
            continue;
        }

        for (let i = 0; i < participants.length; i++) {
            participantsString += participants[i];
            if (i + 1 < participants.length) {
                participantsString += ", "
            }
        }
        chatJson[chat].participantsString = participantsString;
    }
}

function chatDataToList(cd) {
    let list = [];
    for (let key in cd) {
        list.push({
            fileName: key,
            title: cd[key]['title'],
            messageCount: cd[key]['messages'].length,
            participants: cd[key].participantsString
        });
    }
    return list;
}

function getTotalByPerson(chatData) {
    let totalByPersonMap = {};
    for (let i = 0; i < chatData['messages'].length; i++) {
        let sender = chatData['messages'][i]['sender_name'];

        if (totalByPersonMap[sender] === undefined) {
            totalByPersonMap[sender] = 1;
        }
        else {
            totalByPersonMap[sender]++;
        }
    }

    let totalByPerson = [];

    for (const person in totalByPersonMap) {
        totalByPerson.push({
            sender: person,
            total: totalByPersonMap[person]
        })
    }

    totalByPerson.sort((first, second) => {
        return first.total < second.total ? 1 : first.total > second.total ? -1 : 0;
    });

    return totalByPerson;
}

function getConversationStarters(chatData) {

    let lastTime = undefined;

    for (let i = chatData['messages'].length-1; i > -1; i--) {
        let sender = chatData['messages'][i]['sender_name'];
        let time = new Date(chatData['messages'][i]['timestamp_ms']);

        if (lastTime !== undefined) {
            let timeBetween = Math.ceil(Math.abs(lastTime - time) / 1000); // Seconds
            if (timeBetween > 60 * 60) { // One hour
                conversationStartersMap[sender] =
                    conversationStartersMap[sender] ? conversationStartersMap[sender] + 1 : 1;
            }
        }

        lastTime = time;
    }

    let conversationStarters = [];

    for (const person in conversationStartersMap) {
        conversationStarters.push({
            sender: person,
            count: conversationStartersMap[person]
        })
    }

    conversationStarters.sort((first, second) => {
        return first.count < second.count ? 1 : first.count > second.count ? -1 : 0;
    });

    return conversationStarters;
}

module.exports = {
    analizeList,
    getMessageCount,
    chatDataToList,
    addParticipantsObject,
    getTotalByPerson,
    getConversationStarters
};
