
const format = d3.format(".2f"); //Formatting numbers to two decimal place

function d3PieChart(dataset, datasetBarChart){
    const margin = {top:20, right:20, bottom:20, left:20};
    const width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    outerRadius = Math.min(width, height) / 2,
    innerRadius = outerRadius * .999,   
    innerRadiusFinal = outerRadius * .5,
    innerRadiusFinal3 = outerRadius* .45,
    color = d3.scaleOrdinal(d3.schemeAccent); // using the standard color scheme d3.schemeCategory10 for the categorical data

    const vis = d3.select('#pieChart')
        .append("svg")  
        .data([dataset])    
        .attr("width", width)
        .attr("height", height)
        .append("g")   
        .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
        
    const data = d3.pie() 
        .sort(null)
        .value(function(d){return d.measure;})(dataset);

    const arc = d3.arc()    
        .outerRadius(outerRadius)
        .innerRadius(0);

    const arcFinal = d3.arc()
        .innerRadius(innerRadiusFinal)
        .outerRadius(outerRadius);

    const arcFinal3 = d3.arc()
        .innerRadius(innerRadiusFinal3)
        .outerRadius(outerRadius); 

    const arcs = vis.selectAll("g.slice")
        .data(data)                     
        .enter()                       
        .append("svg:g")               
        .attr("class", "slice") 
        .on("mouseover", mouseover)
    	.on("mouseout", mouseout)
    	.on("click", up);
    				
    arcs.append("svg:path")
        .attr("fill", function(d, i) { return color(i); } ) 
        .attr("d", arc)     
		.append("svg:title") 
        .text(function(d) { return d.category + ": " + format(d.measure)+"%"; });			

    d3.selectAll("g.slice").selectAll("path").transition()
		.duration(750)
		.delay(10)
        .attr("d", arcFinal );
    
    
    arcs.filter(function(d) { return d.endAngle - d.startAngle > .1; })
    .append("svg:text")
    .attr("dy", "2px")
    .attr("text-anchor", "middle")
    .attr("transform", function(d) { return "translate(" + arcFinal.centroid(d) + ")"; })
    .text(function(d) { return d.data.category; });

    vis.append("svg:text")
        .attr("dy", ".20em")
        .attr("text-anchor", "middle")
        .text("churned customers")
        .attr("class","title");		    

    function mouseover() {
        d3.select(this).select("path").transition()
        .duration(750)
        .attr("d", arcFinal3);
    }

    function mouseout() {
        d3.select(this).select("path").transition()
        .duration(750)
        .attr("d", arcFinal);
    }

    function up(d, i) {
        updateBarChart(d.data.category, color(i), datasetBarChart);
     }

}
