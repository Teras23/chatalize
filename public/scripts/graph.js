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

function search(messages) {
	var chatBox = document.getElementById("chatContainer");
	var searchBox = document.getElementById("searchContainer");	
	var found = 0;
	var lis = [];
	var searchWord = document.getElementById("searchBar").value
	for(var i=0; i<messages.length; i++){
		if (messages[i].content !== undefined){			
			if (messages[i].content.toLowerCase().includes(searchWord)){
				lis.push(messages[i]);
				found++;
			} 			
		}	
	}
	chatBox.style.display = "none";
	searchBox.style.display = "block";
	if (found==0) {
		document.getElementById('results').innerHTML = 'No results found.';
	} else{
		document.getElementById('results').innerHTML = 'Found ' + found + ' results.';
		var ol = document.getElementById("searchList");
		for(var i=0; i<lis.length; i++){
			var li = document.createElement("li");
			ol.appendChild(li);
    		li.innerHTML += convert(lis[i].timestamp_ms) + "<br />" + "<button class='button-link' onclick='newList()'>" + lis[i].content + "</button>";
		}		
	}
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
