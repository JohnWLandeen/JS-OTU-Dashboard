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

//Deliv 1
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/data/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples_array = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var desired_obj_num = samples_array.filter(Obj => Obj.id == sample);

    // Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata_array = data.metadata.filter(Obj => Obj.id == sample);

    // 5. Create a variable that holds the first sample in the array.
    var first_sample = desired_obj_num[0];

    //Create a variable that holds the first sample in the metadata array.
    var first_meta = metadata_array[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = first_sample.otu_ids;
    var labels = first_sample.otu_labels;
    var sample_vals = first_sample.sample_values;

    // Create a variable that holds the washing frequency.
    var wash_freq = first_meta.wfreq;
    var float_wash_freq = parseFloat(wash_freq)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var sliced_vals = sample_vals.slice(0,10);
    var reversed_vals = sliced_vals.reverse()
    var xticks = reversed_vals

    yticks = ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
        x: xticks,
        y: yticks,
        text: labels,
        type: "bar",
        orientation: "h"
  }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 100
        }
      };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("plot", barData, barLayout);

    //Deliv 2/3
    // 1. Create the trace for the bubble chart.
    var bubbleData = [
          {
            x: ids,
            y: sample_vals,
            text: labels,
            mode: "markers",
            marker: {
              size: sample_vals,
              color: ids,
              colorscale: "Earth"
            }
          }
        ];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
          title: "Bacteria Cultures Per Sample",
          margin: { t: 0 },
          hovermode: "closest",
          xaxis: { title: "OTU ID" },
          margin: { t: 30}
        };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
          {
            domain: { x: [0, 1], y: [0, 1] },
		        value: float_wash_freq,
		        title: { text: "Belly Button Washing Frequency" },
		        type: "indicator",
		        mode: "gauge+number",
            gauge: {
              axis: {range: [0,10] },
              steps: [
                { range:[0,2], color: "red"},
                { range:[2,4], color: "orange"},
                { range:[4,6], color: "yellow"},
                { range:[6,8], color: "lime"},
                { range:[8,10], color: "green"}
              ],
              bar: { color: "black"}
            }
          }
       ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
          width: 600,
          height: 500, 
          margin: { t: 0, b: 0 }
        };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

