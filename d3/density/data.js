
//Read in the CSV file asynchronously
d3.csv("distributions.csv")
    .row(function(d){
    //Convert the data to numeric values
            return{
            engagement_score: +d.engagement_probability
        };
    })
    .get(function(data){
     //Do stuff   
        
    }
     