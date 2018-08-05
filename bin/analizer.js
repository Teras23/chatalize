function analize(chatData) {
    let analized = {
        dailyCount: {},
        totalCount: {}
    };

    let total = chatData['messages'].length;

    for (let i = 0; i < chatData['messages'].length; i++) {
        let time = new Date(chatData['messages'][i]['timestamp_ms']);
        let date = time.toISOString().substr(0, 10);

        const currentDailyCount = analized.dailyCount[date];

        if(currentDailyCount === undefined) {
            analized.dailyCount[date] = 1;
        }
        else {
            analized.dailyCount[date]++;
        }

        analized.totalCount[date] = total;
        total--;
    }
    return analized;
}

function analizeList(chatData) {
    const map = analize(chatData);
    let analized = {
        dailyCount: [],
        totalCount: []
    };
    for(const dc in map.dailyCount) {
        analized.dailyCount.push({
            date: dc,
            count: map.dailyCount[dc]
        });
    }

    for(const dc in map.totalCount) {
        analized.totalCount.push({
            date: dc,
            total: map.totalCount[dc]
        });
    }
    return analized;
}

module.exports = {
    analize,
    analizeList
};