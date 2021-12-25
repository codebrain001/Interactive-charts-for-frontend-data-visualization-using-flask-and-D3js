const bins = "All";
const margin = {top: 20, right: 10, bottom: 20, left: 20},
width = 500 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom,
colorBar = d3.scaleOrdinal(d3.schemeAccent),
barPadding = 0.5,
graph_misc = {ylabel: 5, xlabelH : 5, title:10};


function get_percentage(bins, datasetBarChart){
    const _ = [];
    for (instance in datasetBarChart){
        if (datasetBarChart[instance].group==bins){
            _.push(datasetBarChart[instance])
        }
    } return _;
}

function d3BarChart(datasetBarChart){
    defaultBarChart = get_percentage(bins, datasetBarChart);

    const xScale = d3.scaleLinear()
        .domain([0, defaultBarChart.length])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(defaultBarChart, function(d) { return d.measure; })])
        .range([height, 0]);

    const bar = d3.select('#barChart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('id', 'barChartPlot');

    //Adding barchart title
    bar.append('text')
        .attr('x', (width + margin.left + margin.right)/2)
        .attr('y', graph_misc.title)
        .attr('class','title')				
        .attr('text-anchor', 'middle')
        .text('Tenure group for churned customers');

    const vis = bar.append('g')
        .attr("transform", "translate(" + margin.left + "," + (margin.top + graph_misc.ylabel) + ")");

    vis.selectAll("rect")
        .data(defaultBarChart)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return xScale(i);
        })
        .attr("width", width / defaultBarChart.length - barPadding)   
        .attr("y", function(d) {
            return yScale(d.measure);
        })  
        .attr("height", function(d) {
            return height-yScale(d.measure);
        })
        .attr("fill", "#757077");
    

    //Adding  barchart labels
    vis.selectAll('text')
        .data(defaultBarChart)
        .enter()
        .append("text")
        .text(function(d) {
                return d.measure;
        })
        .attr("text-anchor", "middle")

        .attr("x", function(d, i) {
                return (i * (width / defaultBarChart.length)) + ((width / defaultBarChart.length - barPadding) / 2);
        })
        .attr("y", function(d) {
                return (yScale(d.measure) - graph_misc.ylabel);
        })
        .attr("class", "yAxis");
    

    const xLabels = bar
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + (margin.top + height + graph_misc.xlabelH)  + ")");

    xLabels.selectAll("text.xAxis")
        .data(defaultBarChart)
        .enter()
        .append("text")
        .text(function(d) { return d.category;})
        .attr("text-anchor", "middle")
        .attr("x", function(d, i) {
            return (i * (width / defaultBarChart.length)) + ((width / defaultBarChart.length - barPadding) / 2);
        })
        .attr("y", 15)
        .attr("class", "xAxis"); 		    




}

