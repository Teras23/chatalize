function analize(chatData) {
    let analized = {
        dailyCount: {},
        monthlyCount: {},
        totalCount: {}
    };

    let total = chatData['messages'].length;

    for (let i = 0; i < chatData['messages'].length; i++) {
        let time = new Date(chatData['messages'][i]['timestamp_ms']);
        let monthlyDate = time.toISOString().substr(0, 7);
        let dailyDate = time.toISOString().substr(0, 10);

        const currentDailyCount = analized.dailyCount[dailyDate];
        const currentMonthlyCount = analized.dailyCount[dailyDate];

        if (currentDailyCount === undefined) {
            analized.dailyCount[dailyDate] = 1;
        }
        else {
            analized.dailyCount[dailyDate]++;
        }

        if (currentMonthlyCount === undefined) {
            analized.monthlyCount[monthlyDate] = 1;
        }
        else {
            analized.monthlyCount[monthlyDate]++;
        }

        analized.totalCount[dailyDate] = total;
        total--;
    }
    return analized;
}

function analizeList(chatData) {
    const map = analize(chatData);
    let analized = {
        dailyCount: [],
        monthlyCount: [],
        totalCount: []
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
    return analized;
}

module.exports = {
    analize,
    analizeList
};