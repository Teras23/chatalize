var xhr = new XMLHttpRequest();
var fileName = document.head.querySelector("[property=fileName]").content;
xhr.open('GET', '/chat/' + fileName + '/data');
xhr.onreadystatechange = () => {
    var DONE = 4;
    var OK = 200;
    if (xhr.readyState === DONE && xhr.status === OK) {
        let data = JSON.parse(xhr.responseText);
        console.log(data);
        drawTotalGraph(data);
        drawMonthlyGraph(data);
        drawTimeBetween(data);
    }
};
xhr.send();

function drawTotalGraph(obj) {
    console.log("drawing graph");
    var svg = d3.select(".svg");
    var margin = {top: 40, right: 20, bottom: 50, left: 50};
    var width = 200 + margin.left - margin.right;
    var height = 150 + margin.top - margin.bottom;
    var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var parseTime = d3.timeParse('%Y-%m-%d');

    var data = obj.totalCount;

    data.forEach((d) => {
        d.date = parseTime(d.date);
        d.data = +d.total;
    });

    var x = d3.scaleTime()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var line = d3.line()
        .x((d) => {
            return x(d.date);
        })
        .y((d) => {
            return y(d.data);
        });

    x.domain(d3.extent(data, (d) => {
        return d.date
    }));

    y.domain(d3.extent(data, (d) => {
        return d.data
    }));

    g.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

    g.append('g')
        .call(d3.axisLeft(y));

    g.append('path')
        .data([data])
        .attr('class', 'line')
        .attr('d', line);

    g.append('text')
        .attr('x', width / 2)
        .attr('y', 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Total messages over time");
}

function drawMonthlyGraph(obj) {
    console.log("drawing graph");
    var svg = d3.select("#monthly");
    var margin = {top: 40, right: 20, bottom: 50, left: 50};
    var width = 200 + margin.left - margin.right;
    var height = 150 + margin.top - margin.bottom;
    var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var parseTime = d3.timeParse('%Y-%m');

    var data = obj.monthlyCount;

    data.forEach((d) => {
        d.date = parseTime(d.date);
        d.data = +d.count;
    });

    var x = d3.scaleTime()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var line = d3.line()
        .x((d) => {
            return x(d.date);
        })
        .y((d) => {
            return y(d.data);
        });

    x.domain(d3.extent(data, (d) => {
        return d.date
    }));

    y.domain(d3.extent(data, (d) => {
        return d.data
    }));

    g.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

    g.append('g')
        .call(d3.axisLeft(y));

    g.append('path')
        .data([data])
        .attr('class', 'line')
        .attr('d', line);

    g.append('text')
        .attr('x', width / 2)
        .attr('y', 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Frequency of messages by month");
}

function drawTimeBetween(obj) {
    console.log("drawing graph");
    var svg = d3.select("#timeBetween");
    var margin = {top: 40, right: 20, bottom: 50, left: 50};
    var width = 200 + margin.left - margin.right;
    var height = 150 + margin.top - margin.bottom;
    var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var parseTime = d3.timeParse('%s');

    var data = obj.timeBetween;

    data.forEach((d) => {
        d.date = +d.time;
        d.data = +d.count;
    });

    var x = d3.scaleLinear()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var line = d3.line()
        .x((d) => {
            return x(d.date);
        })
        .y((d) => {
            return y(d.data);
        });

    x.domain(d3.extent(data, (d) => {
        return d.date
    }));

    y.domain(d3.extent(data, (d) => {
        return d.data
    }));

    g.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

    g.append('g')
        .call(d3.axisLeft(y));

    g.append('path')
        .data([data])
        .attr('class', 'line')
        .attr('d', line);

    g.append('text')
        .attr('x', width / 2)
        .attr('y', 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Time between messages log seconds");
}