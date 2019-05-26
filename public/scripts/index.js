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

function showDirects() {
	var checkBox = document.getElementById("DirectMessages");
    var text = document.getElementsByClassName("directs");
    if (checkBox.checked == true){
    	for (i = 0; i < text.length; i++) { 
      	  text[i].style.display = "block";
        }
    } else {
 	   for (i = 0; i < text.length; i++) { 
 	      text[i].style.display = "none";
       }
    }
}


function showGroups() {
	var checkBox = document.getElementById("GroupMessages");
    var text = document.getElementsByClassName("groups");
    if (checkBox.checked == true){
    	for (i = 0; i < text.length; i++) { 
        	text[i].style.display = "block";          
        }
    } else {
    	for (i = 0; i < text.length; i++) { 
      		text[i].style.display = "none";
        }
    }
}
    
function sortList(){
	value = document.getElementById("sort").value;
    valueAsc = document.getElementById("asc").value;
      
    ul = document.getElementById("list");
    var new_ul = ul.cloneNode(false);
      
    var lis = [];
    for(var i = ul.childNodes.length; i--;){
    	if(ul.childNodes[i].childNodes[0].nodeName === 'LI'){
        	lis.push(ul.childNodes[i]);
        }
    }
    if(value=="title"){
    	lis.sort(function (a, b) {
        	if (valueAsc === "desc"){          
            	if (a > b){
                	return -1;
              	}
            } else{
            	if (a < b){
                	return -1;
              	}
            }
        });
	} else {
    	lis.sort(function (a, b) {   
            if (valueAsc === "desc"){                 
            	if (parseInt(a.childNodes[0].childNodes[0].textContent) > parseInt(b.childNodes[0].childNodes[0].textContent)){
                	return -1;
              	}
            }else{
            	if (parseInt(a.childNodes[0].childNodes[0].textContent) < parseInt(b.childNodes[0].childNodes[0].textContent)){
                	return -1;
              	}
            }
      	});
	}
	  
	for(var i = 0; i < lis.length; i++)
		new_ul.appendChild(lis[i]);
	ul.parentNode.replaceChild(new_ul, ul);
}
    
function sortListAsc(){      
	ul = document.getElementById("list");
    var new_ul = ul.cloneNode(false);
      
    var lis = [];
    for(var i = ul.childNodes.length; i--;){
    	if(ul.childNodes[i].childNodes[0].nodeName === 'LI'){
        	lis.push(ul.childNodes[i]);
        }
	}
    lis.sort(function(a, b){
    	return parseInt(b.childNodes[0].data , 10) - 
                parseInt(a.childNodes[0].data , 10);
    });

	for(var i = 0; i < lis.length; i++)
    	new_ul.appendChild(lis[i]);
	ul.parentNode.replaceChild(new_ul, ul);
}
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
