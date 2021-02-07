    // @TODO: YOUR CODE HERE!
// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {    
    // Define SVG area dimensions
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    // Define the chart's margins as an object
    var chartMargin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
    };

    // Define dimensions of the chart area
    var width = svgWidth - chartMargin.left - chartMargin.right;
    var height = svgHeight - chartMargin.top - chartMargin.bottom;

    // Select body, append SVG area, and set the dimensions
    var svg = d3
    .select("body")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

    // Append group element
    var chartGroup = svg
    .append("g")
    .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")")
    .attr("class","main");

    // Read CSV
    d3.csv("assets/data/data.csv").then(function(dataFile) {
        // console.log(dataFile);

        // parse data
        dataFile.forEach(function(data) {
            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;
        });

        // create scales
        var xLinearScale = d3.scaleLinear()
            .domain(d3.extent(dataFile, d => d.poverty))
            .range([0, width]);
        
        var yLinearScale = d3.scaleLinear()
            .domain(d3.extent(dataFile, d => d.healthcare))
            .range([height, 0]);

        // create axes
        var xAxis = d3.axisBottom(xLinearScale);
        var yAxis = d3.axisLeft(yLinearScale).ticks(12);

        // append axes
        chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

        chartGroup.append("g")
        .call(yAxis);

        // append circles
        var circlesGroup = chartGroup.selectAll("circle")
        .data(medalData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "gold")
        .attr("stroke-width", "1")
        .attr("stroke", "black");

        // Step 1: Initialize Tooltip
        var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([-10, -60])
        .html(function(d) {
        return (`<strong>${d.poverty}<strong><hr>${d.healthcare}`);
        });

        // Step 2: Create the tooltip in chartGroup.
        chartGroup.call(toolTip);

        // Step 3: Create "mouseover" event listener to display tooltip
        circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
        })
        // Step 4: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(d) {
            toolTip.hide(d);
        });

    }).catch(function(error) {
        console.log(error)
    });
}

makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);