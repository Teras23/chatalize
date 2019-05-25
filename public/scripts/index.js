var xhr = new XMLHttpRequest();
xhr.open('GET', '/data');
xhr.onreadystatechange = () => {
    var DONE = 4;
    var OK = 200;
    if (xhr.readyState === DONE && xhr.status === OK) {
        let data = JSON.parse(xhr.responseText);
        console.log(data);
        drawChart(data);
    }
};
xhr.send();

function drawChart(rawData) {
    var ctx = document.getElementById("canvas");

    var data = rawData.map(d => {
            return {
                t: new Date(d.date),
                y: d.count
            };
        }
    );

    data.reverse();

    var labels = rawData.map(d => new Date(d.date));

    labels.reverse();

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
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
