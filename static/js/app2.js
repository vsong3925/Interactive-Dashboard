
var api_key = "wJwp9NFb-QWNy3d1f9_w";

// Placeholder:
var start_date = "2008-01-01";
var end_date = "2010-01-01"

// Placehoder: 
var stock1 = "PFE"
var stock2 = "AMZN"

// ---------------------------------------------- Dropdowns ----------------------------------------
// ********************************************
// *********** 1st Dropdown Value *************
// ********************************************

d3.json('/tickerlist').then(data => {

    // ******** Sectors **********
    var sectors = [];
   
    sectors.push(data[0].Industry)
    sectors.push(data[23].Industry)
    sectors.push(data[48].Industry)
    sectors.push(data[74].Industry)
    sectors.push(data[96].Industry)
    sectors.push(data[118].Industry)
    sectors.push(data[123].Industry)
    sectors.push(data[147].Industry)
    sectors.push(data[172].Industry)
    sectors.push(data[190].Industry)
    sectors.push(data[215].Industry)

    var sector1 = d3.select("#sector1")
    var sector2 = d3.select("#sector2")

    sectors.forEach(sector => {
        sector1.append('option').append('value', sector).text(sector)
        sector2.append('option').append('value', sector).text(sector)
    })
})

// ********************************************
// *********** Update Stock One *************
// ********************************************

function updateStockOne() {
    selector1 = d3.select("#sector1").property("value")
    
    // ******** Stocks **********
    d3.json('/tickerlist').then(data => {
        
        var tickers1 = [];
        
        var filteredData1 = data.filter(d => d.Industry == selector1)
        console.log(filteredData1)

        for (key in filteredData1) {
            tickers1.push(filteredData1[key].Ticker)
        }

        var selector3 = d3.select("#stock1")

        selector3.html('')

        tickers1.forEach(t => {
            selector3.append('option').append('value', t).text(t)
        }) 
    })
}

// ********************************************
// *********** Update Stock Two *************
// ********************************************

function updateStockTwo() {
    selector2 = d3.select("#sector2").property("value")
    
    // ******** Stocks **********
    d3.json('/tickerlist').then(data => {
        
        var tickers2 = [];
        
        var filteredData2 = data.filter(d => d.Industry == selector2)
        console.log(filteredData2)

        for (key in filteredData2) {
            tickers2.push(filteredData2[key].Ticker)
        }

        var selector4 = d3.select("#stock2")

        selector4.html('')

        tickers2.forEach(t => {
            selector4.append('option').append('value', t).text(t)
        }) 
    })
}

// *********************************************************
// ************* Secotrs Dropdown Selects  *****************
// *********************************************************

var selector1 = d3.select("#sector1")
selector1.on("change", updateStockOne)

var selector2 = d3.select("#sector2")
selector2.on("change", updateStockTwo)

// *****************************************************
// ************* Grab Value Functions  *****************
// *****************************************************

function valueStockOne() {
    stock1 = d3.select("#stock1").property("value")
    console.log(stock1)
    return stock1
}

function valueStockTwo() {
    stock2 = d3.select("#stock2").property("value")
    console.log(stock2)
    return stock2
}

// ********************************************************
// ************* Stocks Dropdown Selects  *****************
// ********************************************************

var selector3 = d3.select("#stock1")
selector3.on("change", valueStockOne)

var selector4 = d3.select("#stock2")
selector4.on("change", valueStockTwo)

// -------------------------------------------------- Stock Key Unpdate ----------------------------------------




// ---------------------------------------------- Submit Button Handler ----------------------------------------
// ****************************************
// ******** Submit button handler *********
// ****************************************

function handleSubmit() {
    // Prevent the page from refreshing
    Plotly.d3.event.preventDefault();
  
    // // Select the input value from the form
    // var stock1 = Plotly.d3.select("#stock1").node().value;
    // var stock2 = Plotly.d3.select("#stock2").node().value;
    valueStockOne()
    valueStockTwo()
  
    // // clear the input value
    // Plotly.d3.select("#stock1").node().value = "";
    // Plotly.d3.select("#stock2").node().value = "";
  
    // Build the plot with the new stock
    buildPlot(stock1, stock2);
}

/**
 * Helper function to select stock data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * index 0 - Date
 * index 1 - Open
 * index 2 - High
 * index 3 - Low
 * index 4 - Close
 * index 5 - Volume
 */
function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
}

// ---------------------------------------------- Plots ----------------------------------------

// ***********************************************
// ************* Correlation Plot  ***************
// ***********************************************

// Calculate a rolling correlation for two arrays
function rollingCorrelation(arr1, arr2, windowPeriod = 10) {
    // correlation array to return
        var corrs = [];
        for (var i = 0; i < arr1.length - windowPeriod; i++) {
            // windows of data to perform correlation on
            var win1 = [];
            var win2 = [];
            for (var j = 0; j < windowPeriod; j++) {
            win1.push(arr1[i + j]);
            win2.push(arr2[i + j]);
            }
            // calculate correlation between two arrays
            corrs.push(ss.sampleCorrelation(win1, win2));
        }
    return corrs;
}

// ***********************************************
// ***************** Plots  **********************
// ***********************************************

function buildPlot(stock1, stock2) {
    
    var url1 = `https://www.quandl.com/api/v3/datasets/WIKI/${stock1}.json?start_date=${start_date}&end_date=${end_date}&api_key=${api_key}`;
    var url2 = `https://www.quandl.com/api/v3/datasets/WIKI/${stock2}.json?start_date=${start_date}&end_date=${end_date}&api_key=${api_key}`;

    Plotly.d3.json(url1, function(err1, response1) {

        if (err1) return console.warn(err1);

        Plotly.d3.json(url2, function(err2, response2) {
        if (err2) return console.warn(err2);

        // Grab values from the response json object to build the plots
        var name1 = response1.dataset.name;
        var name2 = response2.dataset.name;
        var stock1 = response1.dataset.dataset_code;
        var stock2 = response2.dataset.dataset_code;
        var startDate = response1.dataset.start_date;
        var endDate = response1.dataset.end_date;
        var dates = unpack(response1.dataset.data, 0);
        var closingPrices1 = unpack(response1.dataset.data, 1);
        var closingPrices2 = unpack(response2.dataset.data, 1);

        // Correlation Plot
        var period = 10;
        var corrs = rollingCorrelation(closingPrices1, closingPrices2, period);
        var trace1 = {
            type: "scatter",
            mode: "lines",
            name: `${name1} vs ${name2}`,
            x: dates.slice(period),
            y: corrs,
            line: {
            color: "#17BECF"
            }
        };

        var data = [trace1];

        var layout = {
            title: `${stock1} ${stock2} Correlation Plot`,
            xaxis: {
            type: "date"
            },
            yaxis: {
            autorange: true,
            type: "linear"
            }
        };

        Plotly.newPlot("plot1", data, layout);


        // Comparison Plot
        var selectorOptions = {
            buttons: [{
                step: 'month',
                stepmode: 'backward',
                count: 1,
                label: '1m'
            }, {
                step: 'month',
                stepmode: 'backward',
                count: 6,
                label: '6m'
            }, {
                step: 'year',
                stepmode: 'todate',
                count: 1,
                label: 'YTD'
            }, {
                step: 'year',
                stepmode: 'backward',
                count: 1,
                label: '1y'
            }, {
                step: 'all',
            }],
            };

        trace_stock_1 = {
            type: 'line',
            mode: 'lines',
            name: stock1,
            x: dates,
            y: closingPrices1
        }

        trace_stock_2 = {
            type: 'line',
            mode: 'lines',
            name: stock2,
            yaxis: 'y2',
            x: dates,
            y: closingPrices2
        }

        var duallayout = {
            title: `${stock1} ${stock2} Comparison Plot`,
            xaxis: {
                range: [startDate, endDate],
                rangeselector: selectorOptions,
                rangeslider: {},
                type: "date"
            },
            yaxis: {title: stock1},
            yaxis2: {
            title: stock2,
            overlaying: 'y',
            side: 'right'
            }
        };
        
        comparisonData = [trace_stock_1, trace_stock_2];

        Plotly.newPlot('plot2', comparisonData, duallayout);
        });
    });
}

buildPlot(stock1, stock2)


// // *********************************************************
// // ************* Secotrs Dropdown Selects  *****************
// // *********************************************************

// var selector1 = d3.select("#sector1")
// selector1.on("change", updateStockOne)

// var selector2 = d3.select("#sector2")
// selector2.on("change", updateStockTwo)

// // *****************************************************
// // ************* Grab Value Functions  *****************
// // *****************************************************

// function valueStockOne() {
//     stock1 = d3.select("#stock1").property("value")
//     console.log(stock1)
//     return stock1
// }

// function valueStockTwo() {
//     stock2 = d3.select("#stock2").property("value")
//     console.log(stock2)
//     return stock2
// }

// // ********************************************************
// // ************* Stocks Dropdown Selects  *****************
// // ********************************************************

// var selector3 = d3.select("#stock1")
// selector3.on("change", valueStockOne)

// var selector4 = d3.select("#stock2")
// selector4.on("change", valueStockTwo)


// // ****************************************************
// // ************* Final Submit Handle  *****************
// // ****************************************************

Plotly.d3.select("#submit").on("click", handleSubmit);








