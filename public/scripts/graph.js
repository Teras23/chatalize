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

document.getElementById('searchBar').onkeypress = search;

function search() {
    var xhr = new XMLHttpRequest();
    var searchValue = document.getElementById("searchBar").value;

    if(searchValue.length < 3) {
        return;
    }

    xhr.open('GET', '/chat/' + fileName + '/messages?msg=' + searchValue);
    xhr.onreadystatechange = () => {
        var DONE = 4;
        var OK = 200;
        if (xhr.readyState === DONE && xhr.status === OK) {
            let data = JSON.parse(xhr.responseText);
            createMessageBubbles(data);
            drawTimeBetween(data);
        }
    };
    xhr.send();
}

function createMessageBubbles(data) {
    var searchBox = document.getElementById("chatContainer");
    var content = "";
    for (var i = 0; i < data["messages"].length; i++) {
        var message = data["messages"][i]["content"];
        var timestamp_ms = data["messages"][i]["timestamp_ms"];
        var sender_name = data["messages"][i]["sender_name"];

        var spanClass= "message-left";

        if (sender_name === data.ownerName) {
            spanClass= "message-right";
        }

        content += '<div class="row"><div class="col"><span class="' + spanClass + '"><span>' + message + '</span></span></div></div>'
    }
    searchBox.innerHTML = content;
    var chat = document.getElementById("chatContainer");
    chat.scrollTop = chat.scrollHeight;
}

function newList(){ //this function was intended to show the searched chatpiece, unfinished
	var chatBox = document.getElementById("chatContainer");
	var searchBox = document.getElementById("searchContainer");
	chatBox.style.display = "block";
	searchBox.style.display = "none";
}

function backToChat(){
	var chatBox = document.getElementById("chatContainer");
	var searchBox = document.getElementById("searchContainer");
	chatBox.style.display = "block";
	searchBox.style.display = "none";
}

function convert(timestamp) {
  var date = new Date(
    parseInt(
      timestamp
    )
  );
  return [
    ("0" + date.getDate()).slice(-2),
    ("0" + (date.getMonth()+1)).slice(-2),
    date.getFullYear()
  ].join('/');
}


function drawTimeBetween(rawData) {
    var ctx = document.getElementById("canvas");

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
