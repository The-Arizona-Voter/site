// set the dimensions and margins of the graph
var width = 450
    height = 450
    margin = 40

var radius = Math.min(width, height) / 2 - margin

var formatComma = d3.format(",");
var formatRound = d3.format(".2f")
    
var svg = d3.select("#pie2")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([0,-3])
    .direction("e")
    .html(function(d) {
        var total = parseInt(d.data.value.Republicans) + parseInt(d.data.value.Democrats) + parseInt(d.data.value.Independents) + parseInt(d.data.value.Greens) + parseInt(d.data.value.Libertarian);
        var partisan_tilt = formatRound(parseInt(d.data.value.Republicans)/ parseInt(d.data.value.Democrats)) 
        var swing = formatRound(parseInt(d.data.value.Independents)/(parseInt(d.data.value.Republicans)   + parseInt(d.data.value.Democrats)));
        return   "<p><strong>Congressional District</strong> " + "<span style='color:black background:yellow'>" + d.data.key + "</span> </p>"         
        + "<p>Partisan Tilt (Republicans/Democrats): " + "<span style='color:black background:yellow'>" +partisan_tilt + "</span></p>"
        + "<p>Swing (Independents/(Democrats + Republicans): " + "<span style='color:black background:yellow'>" + swing  + "</span></p>"
        +"<p>Republicans: " + "<span style='color:red'>"  + formatRound(parseInt(d.data.value.Republicans)/total)   + "</span> </p>"
        +"<p>Democrats: " + "<span style='color:blue'>" + formatRound(parseInt(d.data.value.Democrats)/total)     +"</span> </p>"
        +"<p>Independents: " + "<span style='color:purple'>" +formatRound(parseInt(d.data.value.Independents)/total)+"</span> </p>"
        +"<p>Greens: " + "<span style='color:green'>" + formatRound(parseInt(d.data.value.Greens)/total) + "</span> </p>"
        +"<p>Libertarians: " + "<span style='color:pink'>" +formatRound(parseInt(d.data.value.Libertarian)/total)+"</span> </p>"
    })

svg.call(tip);


//Radius and the arc
const arcPath = d3.arc()
                .outerRadius(radius)
                .innerRadius(0)

d3.csv("cds.csv").then(function(data) {
    data.forEach(d =>{
      d.swing         = formatRound(parseInt(d.Independents)/(parseInt(d.Republicans) + parseInt(d.Democrats)))
      d.partisan_tilt = formatRound((parseInt(d.Republicans) / parseInt(d.Democrats)))
    })
    

  // set the color scale
  
  // set the color scale
  var color = d3.scaleOrdinal()
    .domain(data)
    .range(["red", "white", "blue", "yellow", "purple", "green", "pink", "grey", "orange"])
    
    //  var swing = formatRound(parseInt(d.data.value.Independents)/(parseInt(d.data.value.Republicans) +   + parseInt(d.data.value.Democrats)));
  
    // Compute the position of each group on the pie:
  var pie = d3.pie()
    .value(function(d) {
      return d.value.partisan_tilt})
    
  var data_ready = pie(d3.entries(data))
  
  // shape helper to build arcs:
  var arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(radius)
  svg
    .selectAll('Slices')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.3)
    .on("mouseover", tip.show)
    .on("mouseout",  tip.hide)
    .transition()
    .duration(2000)
    .attrTween("d", arcAnimation)
    // Now add the annotation. Use the centroid method to get the best coordinates
  svg
  .selectAll('Slices')
  .data(data_ready)
  .enter()
  .append('text')
  .text(function(d){
          if(d.data.value.congressional_district<10){
                   return "CD :"  + d.data.value.congressional_district
      }}
      )
  .attr("transform", (d)  => "translate(" + arcGenerator.centroid(d) + ")")
  .style("text-anchor", "middle")
  .style("font-size", 17).transition().duration(10)
})
const arcAnimation = (d) => {
    var i = d3.interpolate(d.endAngle, d.startAngle);

    return function(t) {
        d.startAngle = i(t);
        return arcPath(d);
    }}




    

    