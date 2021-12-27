const urls = [pieChartDataUrl, barChartDataUrl];

Promise.all(urls.map(url => d3.json(url))).then(run);

function run(dataset) {
    d3PieChart(dataset[0], dataset[1]);
    d3BarChart(dataset[1]);
};