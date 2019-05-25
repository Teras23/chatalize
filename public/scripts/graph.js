var xhr = new XMLHttpRequest();
var fileName = document.head.querySelector("[property=fileName]").content;
xhr.open('GET', '/chat/' + fileName + '/data');
xhr.onreadystatechange = () => {
    var DONE = 4;
    var OK = 200;
    if (xhr.readyState === DONE && xhr.status === OK) {
        let data = JSON.parse(xhr.responseText);
        console.log(data);
        drawTimeBetween(data);
    }
};
xhr.send();

var chat = document.getElementById("chatContainer");
chat.scrollTop = chat.scrollHeight;

function drawTimeBetween(rawData) {
    var ctx = document.getElementById("totalcan");

    var data = rawData.totalCount.map(d => {
            return {
                t: new Date(d.date),
                y: d.total
            };
        }
    );

    data.reverse();

    var labels = rawData.totalCount.map(d => new Date(d.date));

    labels.reverse();

    var data2 = rawData.monthlyCount.map(d => {
            return {
                t: new Date(d.date),
                y: d.count
            };
        }
    );


    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Frequency of messages by month',
                    data: data2,
                    borderColor: "#c45850",
                    fill: false
                },
                {
                    label: 'Total messages over time',
                    data: data,
                    borderColor: "#3e95cd"
                }
            ]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    distribution: 'linear'
                }]
            }
        }
    });
}
