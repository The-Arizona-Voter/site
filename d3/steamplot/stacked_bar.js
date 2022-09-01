
//  
var margin = {top: 0, right: 30, bottom: 200, left: 10},
            width =  50 - margin.left  -  margin.right,
            height = 100 - margin.top   - margin.bottom;

var xScale = d3.scaleLinear().domain([0, 6]).range([0, 500]);
var yScale = d3.scaleLinear().domain([0, 10]).range([340, 0]);
var heightScale = d3.scaleLinear().domain([0, 10]).range([0, 1000]);
            
d3.csv("feelings.csv", stackedBar);
      
function stackedBar(data) {
  
  // Declare the legend stuff
  var feelings = ["Feeling_Democrat","Feeiling_Republican","Feeling_Biden","Feeling_Trump","Feeling_Ordinary_Democrats","Feeling_Ordinary_Republicans"];
  

// Set the stack layout
stackLayout = d3.stack()
      .keys(feelings);

var fillScale = d3.scaleOrdinal()
      .domain(feelings)
      .range(["blue", "red", "darkblue", "darkred", "lightblue", "green"])
    

      d3.select("svg").selectAll("#stacked_bar")
      .data(stackLayout(data))
      .enter()
      .append("g")
        .attr("class", "bar")
        .each(function(d) {
          d3.select(this).selectAll("rect")
            .data(d)
            .enter()
            .append("rect")
              .attr("x", (p,q) => xScale(q) + 30)
              .attr("y", p => yScale(p[1]))
              .attr("height", p => heightScale(p[1] - p[0]))
              .attr("width", "100")
              .style("fill", fillScale(d.key));
        });
  ;

let tickLabels = ['Strong D','Democrat','Lean R', "Independent", "Lean R", "Republican", "Strong R"];

var xAxis = d3.axisBottom()
          .scale(xScale)
          .tickSize(530)
          .tickValues([0,1,2,3,4,5,6 ])
          .tickFormat((d,i) => tickLabels[i])

d3.select("svg")
//  .append("g").attr("transform", "translate(0," + (height) + ")")
 .attr("id", "xAxisG")
 .style("font-family", "didot")
 .style("font-size", 12)
 .call(xAxis)
 .selectAll("text")
 .attr("transform", "rotate(45)")
 .style("text-anchor", 'start')

 var yAxis = d3.axisRight()
 .scale(yScale)
 .ticks(10)
 .tickSize(530);
d3.select("svg").append("g").attr("id", "yAxisG").call(yAxis);

}

