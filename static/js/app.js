function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    //find the sample selected
    var sample = d3.select("#selDataset").node().value;

    d3.json(`/metadata/${sample}`).then(function(x){
      
    // Use d3 to select the panel with id of `#sample-metadata`
   var sample_data = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    sample_data.html("");

    
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(x).forEach(([key, value]) => { //could use map
      sample_data.append("p").text(`${key}: ${value}`);
    });
  });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sample = d3.select("#selDataset").node().value;

  //var otu = asdf.map(y => y.otu_ids).limit(10);
  //console.log(otu);
  
  var data = d3.json(`/samples/${sample}`).then(function(x){
 
    // @TODO: Build a Bubble Chart using the sample data
    //populates the arrays for the graphs
    
    var otu_ids = x.otu_ids;
    var sample_vals = x.sample_values;
    var otu_labels = x.otu_labels;

    var ten_otu_ids = otu_ids.slice(0,10);
    var ten_sample_vals = sample_vals.slice(0,10);
    var ten_otu_labels = otu_labels.slice(0,10);

    var trace1 = {
      labels: ten_otu_ids,
      values: ten_sample_vals,
      text: ten_otu_labels,
      hoverinfo: 'label+value+text+percent',
      textinfo: 'percent',
      type: "pie"
    };

    var data = [trace1];
    
    var layout = {
      title: "Pie Chart"
    };

    Plotly.newPlot("pie", data, layout);


    //bubble chart
    trace2 = {
      x: otu_ids,
      y: sample_vals,
      text:otu_labels,
      mode: 'markers',
      marker: 
        {size: sample_vals, 
         color: otu_ids},
      hoverinfo: 'x+y+text'
    };

    var data2 = [trace2];
    layout2 = {
      title: "Bubble Chart",
      xaxis: {title: "OTU ID"}

    };
    Plotly.newPlot("bubble", data2, layout2);
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  });
  }

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
 
}

// Initialize the dashboard
init();

