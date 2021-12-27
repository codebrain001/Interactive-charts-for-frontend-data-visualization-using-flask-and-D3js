function d3PieChart(dataset, datasetBarChart){
    // Set up SVG dimensions and properties 
    const margin = {top:20, right:20, bottom:20, left:20};
    const width = 350 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom,
    outerRadius = Math.min(width, height) / 2, 
    innerRadius = outerRadius * .5,
    color = d3.scaleOrdinal(d3.schemeAccent); //color scheme

    // Selecting the div with id pieChart on the index.html template file
    const visualization = d3.select('#pieChart')
        .append("svg")      //Injecting an SVG element
        .data([dataset])    //Binding the pie chart data
        .attr("width", width)
        .attr("height", height) 
        .append("g")        //Grouping the various SVG components   
        .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")"); //Piechart tranformation and transition upon page loading

    const data = d3.pie()   //Creating the data object that will develop the various segment of the pie chart.
        .sort(null)
        .value(function(d){return d.value;})(dataset);    // Retrieve the pie chart data values from our Flask app, the pie chart where tied to a 'value' key of a JSON object.

    
    // Generate an arc generator that produces the circular chart (outer circle)
    const arc = d3.arc()    
        .outerRadius(outerRadius)
        .innerRadius(0);

     // Generate an arc generator that produces the circular chart (inner circle)
    const innerArc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    // Create pie chart slices based on the data object created
    const arcs = visualization.selectAll("g.slice")
        .data(data)                     
        .enter()    // creates the initial join of data to elements                       
        .append("svg:g")               
        .attr("class", "slice") 
    	.on("click", click);
    				
    arcs.append("svg:path")     // create path element 
        .attr("fill", function(d, i) { return color(i); } )     //Add color to slice
        .attr("d", arc)     // creates actual SVG path with associated data and the arc drawing function
		.append("svg:title")        // Add title to each piechart slice 
        .text(function(d) { return d.data.category + ": " + d.data.value+"%"; });			

    d3.selectAll("g.slice")     // select slices in the group SVG element (pirchart)
        .selectAll("path")
        .transition()           //Set piechart transition on loading
		.duration(200)
		.delay(5)
        .attr("d", innerArc);

    arcs.filter(function(d) { return d.endAngle - d.startAngle > .1; })     //Define slice labels at certain angles
        .append("svg:text")     //Insert text area in SVG
        .attr("dy", "0.20em")      //shift along the y-axis on the position of text content
        .attr("text-anchor", "middle")      //Position slice labels
        .attr("transform", function(d) { return "translate(" + innerArc.centroid(d) + ")"; }) //Positioning upon transition and transform
        .text(function(d) { return d.data.category; }); // Append category name on slices

    visualization.append("svg:text") //Append the title of chart in the middle of the pie chart
        .attr("dy", ".20em")
        .attr("text-anchor", "middle")
        .text("churned customers")
        .attr("class","title");		    

    // Function to update barchart when a piechart slice is clicked
    function click(d, i) {
        updateBarChart(d.data.category, color(i), datasetBarChart);
     }
}
