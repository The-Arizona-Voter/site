
//  
var margin = {top: 10, right: 10, bottom: 10, left: 10},
            width =  100 - margin.left  -  margin.right,
            height = 300 - margin.top   - margin.bottom;

var xScale = d3.scaleLinear().domain([-0.2, 6.2]).range([0, 500]);
var yScale = d3.scaleLinear().domain([1, 0]).range([300, 0]);

d3.csv("feelings.csv", steamPlot);
      
function steamPlot(data) {
  
  var Tooltip = d3.select("#viz")
.append("div")
.style("opacity", 1)
.attr("id", "tooltip")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "5px")
.style("border-radius", "5px")
.style("padding", "5px")

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(d) {
  Tooltip
    .style("opacity", 0)
    .transition()
    .duration(1000)
 }
 var mousemove = function(d) {
  Tooltip
    .style("opacity", 0.5)
    .transition()
    .duration(100)
 }       
 var mouseleave = function(d) {
  Tooltip
    .style("opacity", 0)
    .transition()
    .duration(1000)
 }


  // Declare the legend stuff
  var feelings = ["Feeling_Democrat","Feeiling_Republican","Feeling_Biden","Feeling_Trump","Feeling_Ordinary_Democrats","Feeling_Ordinary_Republicans"];
  
  var fillScale = d3.scaleOrdinal()
    .domain(["Democrats", "Republicans", "Biden", "Trump", "Ordinary Democrats", "Ordinary Republicans"])
    .range(["blue", "red", "darkblue", "darkred", "lightblue", "green"]);

  var legendA = d3.legendColor().scale(fillScale).labelFormat(d3.format(".0f")).title("Relative Orientation Towards:");

  var fillScale = d3.scaleOrdinal()
      .domain(feelings)
      .range(["blue", "red", "lightblue", "darkred", "green", "purple"])
  
// Set the stack layout
  stackLayout = d3.stack()
      .keys(feelings);
  
  var stackArea = d3.area()
      .x((d, i) => xScale(i))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]));
  
stackLayout.offset(d3.stackOffsetSilhouette).order(d3.stackOrderInsideOut)
stackArea.curve(d3.curveCardinal);

yScale
.domain([2,-2])
.range([ height, 0]);
// append the svg object to the body of the page

d3.select("svg").selectAll("#viz")
      .append("svg")
      .data(stackLayout(data))
      .enter()
      .append("path")
      .style("fill", d => fillScale(d.key))
      .attr("d",     d => stackArea(d))
      .style("opacity", 0.88)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
;

  d3.select("svg")
    .style("width", "900px")
    .append("g")
    .attr("transform", "translate(600, 70)")
    .style("font-size", "18px")
    .call(legendA)

    var yAxis = d3.axisRight()
    .scale(yScale)
    .ticks(10)
    .tickSize(10);
    
    d3.select("svg").append("g")
    .attr("id", "yAxisG")
    .style("font-family", "didot")
    .style("font-size", 12)
    // .call(yAxis)
console.log(data)

}

let tickLabels = ['Strong D','Democrat','Lean R', "Independent", "Lean R", "Republican", "Strong R"];

var xAxis = d3.axisBottom()
          .scale(xScale)
          .tickSize(10)
          .tickValues([0,1,2,3,4,5,6 ])
          .tickFormat((d,i) => tickLabels[i]);

d3.select("svg").append("g")
.attr("id", "xAxisG")
.style("font-family", "didot")
.style("font-size", 12)
.attr("transform", "translate(0," + (height) + ")")
.call(xAxis)

.selectAll("text")
.attr("transform", "rotate(45)")
.style("text-anchor", 'start')


