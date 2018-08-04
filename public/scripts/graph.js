var data = [
    {
        date: '2007',
        data: 40
    },
    {
        date: '2008',
        data: 50
    },
    {
        date: '2009',
        data: 100
    }
];

var svg = d3.select(".svg");
var margin = {top: 20, right: 20, bottom: 30, left: 50};
var width = 200 + margin.left - margin.right;
var height = 150 + margin.top - margin.bottom;
var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var parseTime = d3.timeParse('%Y');

data.forEach((d) => {
    d.date = parseTime(d.date);
    d.data = +d.data;
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