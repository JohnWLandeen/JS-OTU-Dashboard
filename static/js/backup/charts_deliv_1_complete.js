function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/data/samples.json").then((data) => {
    console.log(data)
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);


  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}


// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/data/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}


// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/data/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples_array = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var desired_obj_num = samples_array.filter(Obj => Obj.id == sample);
    // 5. Create a variable that holds the first sample in the array.
    var first_sample = desired_obj_num[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = first_sample.otu_ids;
    var labels = first_sample.otu_labels;
    var sample_vals = first_sample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 


    //xticks looks good
    var sliced_vals = sample_vals.slice(0,10);
    var reversed_vals = sliced_vals.reverse()
    var xticks = reversed_vals

    yticks = ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
        x: xticks,
        y: yticks,
        type: "bar",
        orientation: "h"
  }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: "OTUS",
        margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 100
        }
      };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("plot", barData, barLayout);
  });
}