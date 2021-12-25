d3.queue()
	.defer(d3.json, pieChartDataUrl)
    .defer(d3.json, barChartDataUrl)
    .await(ready);

function ready(error, dataset, datasetBarChart) {
    d3PieChart(dataset, datasetBarChart);
    d3BarChart(datasetBarChart);
}