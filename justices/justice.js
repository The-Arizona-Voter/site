// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// append the svg object to the body of the page
var svg = d3.select("#justice")
  .append("svg")
    .attr("width",  width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y");

var chiefs = [{year1: 1986, year2:2004, Chief: "Rehnquist Court"},
              {year1: 1969, year2:1985, Chief: "Burger Court"},
              {year1: 1953, year2:1969, Chief: "Warren Court"},
              {year1: 1946, year2:1953, Chief: "Vinson Court"},
              {year1: 1941, year2:1946, Chief: "Stone Court"},
              {year1: 1930, year2:1941, Chief: "Hughes Court"}]

// for(var i = 0; i < chiefs.length; i++){
//   console.log(chiefs[i])
// }
//Read the data, declare variables
d3.csv("justices.csv", data =>{
    data.forEach(d =>{
        d.years = parseTime(d.term);
        //The DV
        d.ideo  = parseFloat(d.post_med);
    })

console.log
var Tooltip = d3.select("#justice")
.append("div")
.style("opacity", 0)
.attr("id", "tooltip")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "5px")
.style("border-radius", "5px")
.style("padding", "5px")



var domain = d3.extent(data, d => d.years);
// Define the scales
var x = d3.scaleTime()
    .domain([domain[0], domain[1]])
    .range([15, width ]);

svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Add Y axis
var y = d3.scaleLinear()
  .domain([-10, 5])
  .range([ height, 0]);

// For the lines
var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.justiceName;})
    .entries(data);
var res = sumstat.map(function(d){ return d.key }) // list of group names

var color = d3.scaleOrdinal()
.domain(res)
.range(d3.schemeCategory10);

svg.append("g")
  .call(d3.axisLeft(y));


       
// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(d) {
 Tooltip
   .style("opacity", 1)
   .transition()
   .duration(100)

}
var mousemove = function(d) {
 Tooltip
      .html( "<p> Supreme Court Justice :"+ d.justiceName +"</p>" +
             "<p> Ideology Score :" + d.post_med +"</p>" );
  Tooltip.transition()
             .duration(10000)
          
   .style("left", (d3.mouse(this)[0]+70) + "px")
   .style("top", (d3.mouse(this)[1]) + "px")

  }
var mouseleave = function(d) {
 Tooltip
   .style("opacity", 0.5)
   .transition()
   .duration(2000)
}

svg.append('g')
  .selectAll("dot")
  .data(data)
  .enter()
  .append("circle")
  .style('fill', function(d,i) {
    return color(d.justiceName);
   })
   .attr("opacity", 0.4) // --> this should be changed. I guess
   .attr("r", (d) => 5)
  .attr("cx", function (d) { return x(d.years); } )
  .attr("cy", function (d) { return y(d.post_med); } )
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave)
  


  var linearGen = d3.line()
                    .x( (d, i) => d.years)
                    .y( (d, i) => d.post_med)
                    .curve();
                   // https://github.com/d3/d3/blob/master/API.md
 
          
               
svg.selectAll("#lines")
    .data(sumstat)
    .enter()
    .append("path")
      .attr("fill", "none")
      .attr("stroke", function(d){return color(d.key) })
      .attr("stroke-width", 2)
      .attr("d", function(d){
        return d3.line()
          .x(function(d) { return x(d.years); })
          .y(function(d) { return y(d.post_med); })
          (d.values)})

   var xScale = d3.scaleBand().range ([0, width]).padding(0.4)
   console.log(xScale.bandwidth())
         
    })
