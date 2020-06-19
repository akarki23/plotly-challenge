// Function to create a bar chart with samples as its parameter
function barplot(samples) {

    // Define variables to store top10_values, top10_OTU, and labels
    var top10_values = samples.sample_values.slice(0, 10);
    var top10_OTU = (samples.otu_ids.slice(0, 10));
    var top10_OTU = top10_OTU.map(d => "OTU " + d)
    var labels = samples.otu_labels.slice(0, 10);

    // Define the layout for bar chart
    var layout = {
        title: "Top 10 Operational Taxonomic Units",
        height: 600,
        width: 800,
        yaxis: {
            autorange: "reversed",
            tickmode: "linear",
        },
    };

    // Define the data for bar chart
    var data = [{
        x: top10_values,
        y: top10_OTU,
        text: labels,
        marker: { color: '#50C878' },
        type: "bar",
        orientation: "h",
    }];

    // Use Plotly to build a bar chart
    Plotly.newPlot("bar", data, layout);
};

// Function to create a bubble chart with samples as its parameter
function bubbleplot(samples) {

    // Define the layout for bubble chart
    var layout = {
        title: "Operational Taxonomic Units ID",
        height: 600,
        width: 1000
    };

    // Define data for bubble chart
    var data = [{
        x: samples.otu_ids,
        y: samples.sample_values,
        mode: "markers",
        marker: {
            size: samples.sample_values,
            color: samples.otu_ids
        },
        text: samples.otu_labels
    }];

    // Use Plotly to build a bubble chart
    Plotly.newPlot("bubble", data, layout);
};

// Function to create demographic information table
function table(metadata) {

    // Select demographic information object to store data
    var demoginformation = d3.select("#sample-metadata");

    // Clear any existing data
    demoginformation.html("");

    // Add demographic information from the new sample
    Object.entries(metadata).forEach(([key, value]) => {

        // Append demographic information
        demoginformation.append("p").text(`${key}:${value}`);
    });
}

// Function to update the dashboard with sample as its parameter
function optionChanged(sample) {

    // Pull metadata and sample & filter by dropdown selection
    d3.json("static/js/data/samples.json").then((data) => {

        // Define variables for metadata & samples
        var metadata = data.metadata.filter(meta => meta.id.toString() === sample)[0];
        var samples = data.samples.filter(s => s.id.toString() === sample)[0];

        // Call function to build a bar chart
        barplot(samples);

        // Call function to build a bubble chart
        bubbleplot(samples);

        // Call function to build metadata chart
        table(metadata);
    });
};

// Function to initialize page using initial data
function init() {

    // Grab the dropdown menu and add choices from the dataset
    var dropdown = d3.select("#selDataset");

    // Create list of datasets for the dropdown
    d3.json("static/js/data/samples.json").then((data) => {

        // Loop through options using forEach
        data.names.forEach((name) => {

            // Append the new option
            dropdown.append("option").text(name).property("value");
        });

        // Initialize the plots with data from the first dataset
        optionChanged(data.names[0]);
    });
}

// Run the above function
init();