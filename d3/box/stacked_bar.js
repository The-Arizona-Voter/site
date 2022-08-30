var formatRound = d3.format(".2f")

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 20, left: 50},
    width  = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#stacked_bar")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
   
var div = d3.select("body").append("div")	
.attr("class", "tooltip")				
.style("opacity", 0);

d3.csv("feelings.csv", stackedBar);
      
function stackedBar(data) {
  
  var Tooltip = d3.select("#stacked_bar")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "5x")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("border-height", "10px")
    .style("height", "50px")
    .style("width", "200px")
    .style("z-index", "1")
    .style("position","absolute")
    .style("opacity","50")

    var mouseover = function(d) {
      Tooltip
        .style("opacity", 1)
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
    var mousemove = function(e, d) {
      Tooltip
        .html("The feeling thermometer for this group is: " + formatRound((e[1] - e[0])) + "/10")
        .style("left", (d3.mouse(this)[0]) + "px")
        .style("top",  (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function(d) {
      Tooltip
        .style("opacity", 0.88)
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.88)
    }
  // Declare the legend stuff
  var feelings = ["Feeling_Democrat","Feeiling_Republican","Feeling_Biden","Feeling_Trump","Feeling_Ordinary_Democrats","Feeling_Ordinary_Republicans"];
  
  var subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function(d){return(d.pid_7)}).keys()

  // Add X axis
  var x = d3.scaleBand()
      .domain([1,2,3,4,5,6,7])
      .range([0,width])
      .padding([0.2])
  
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));

    var y = d3.scaleLinear()
    .domain([0,35])
    .range([ height,0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(groups)
    .range(["red", "darkblue", "blue", "lightblue", "crimson", "darkred"]);
    console.log(color)
  //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)
    (data)
    console.log(stackedData)
  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.pid_7); })
        .attr("y", function(d) { return y(d[1]); })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth())
        
  
    var feelings = ["Feeling_Democrat","Feeiling_Republican","Feeling_Biden","Feeling_Trump","Feeling_Ordinary_Democrats","Feeling_Ordinary_Republicans"];
  console.log(data)
  var fillScale = d3.scaleOrdinal()
    .domain(["Republicans", "Biden", "Democrats", "Ordinary Democrats", "Ordinary Republicans", "Trump"])
    .range(["red", "darkblue", "blue", "lightblue", "crimson", "darkred"]);

  var legendA = d3.legendColor().scale(fillScale).labelFormat(d3.format(".0f")).title("Relative Orientation Towards:");
  d3.select("svg")
  .style("width", "900px")
  .append("g")
  .attr("transform", "translate(600, 70)")
  .style("font-size", "18px")
  .call(legendA)

}


var xs = d3.scaleOrdinal()
.domain(["this", "That", "The Other", "this", "that", "other", "that"])
.range([0, width]);

svg
  .append("g")
  .attr("transform", "translate(100,100)")      // This controls the rotate position of the Axis
  .call(d3.axisBottom(xs))
  .selectAll("text")
    .attr("transform", "translate(-10,10)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", 20)
    .style("fill", "#69a3b2")