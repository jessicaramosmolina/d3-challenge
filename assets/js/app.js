    // @TODO: YOUR CODE HERE!
// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {    
    // Define SVG area dimensions
    var svgWidth = 1800;
    var svgHeight = 900;

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
            // console.log(data);
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
        // .attr("transform", `translate(0, ${height})`)
        .call(yAxis);

        // append circles
        var circlesGroup = chartGroup.selectAll("circle")
        .data(dataFile)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "red")
        .attr("stroke-width", "1")
        // .attr("stroke", "black");

        // add State abbreviation 
        chartGroup.selectAll()
        .data(dataFile)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .text(d => d.abbr)
        .attr("font-size", "10")
        .style("fill", "white") 
        .classed("stateText", true)
        .attr("opacity", 0.75);


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
        circlesGroup.on("click", function(d) {
        toolTip.show(d, this);
        })
        // Step 4: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(d) {
            toolTip.hide(d);
        });

        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left + 5)
        .attr("x", 0 - (height / 2))
        .attr("dy", "16px")
        .attr("class", "axisText")
        .classed("active", true)
        .text("Lacks Healthcare (%)");

        chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + chartMargin.top + 7})`)
      .attr("class", "axisText")
      .attr("dx", "16px")
      .text("In Poverty (%)");
        // .text("In Poverty (%)");

    }).catch(function(error) {
        console.log(error)
    });
}

makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);