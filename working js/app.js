var api_key = "wJwp9NFb-QWNy3d1f9_w";

// ***********************************************
// ********* industry dropdown select ************
// ***********************************************
// Multi-select from the sectors and multi-select from the stocks
// The list of sectors and stocks are from a csv file
// Better ways or data for this?

// function selectIndustry() {
//     d3.json("/tickerlist").then(function(data) {
//         console.log(data)

//         //var industry = 
//     }) 
// }

// temperory placeholder
var ticker = "EOD/WMT";

// url = `https://www.quandl.com/api/v3/datasets/${ticker}?start_date=${start_date}&api_key=${api_key}`

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
  
// ***********************************************
// ************* Get Month Function **************
// ***********************************************

var start_date1 = "2007-01-01";
var end_date1 = "2009-01-01"

function getMonthlyData() {

var queryUrl = `https://www.quandl.com/api/v3/datasets/${ticker}.json?start_date=${start_date1}&collapse=monthly&api_key=${api_key}`; 
// var queryUrl = `https://www.quandl.com/api/v3/datasets/${ticker}.json?start_date=${start_date}&collapse=monthly&api_key=${api_key}`; 

d3.json(queryUrl).then(function(data) {
    var dates = unpack(data.dataset.data, 0);
    var openPrices = unpack(data.dataset.data, 1);
    var highPrices = unpack(data.dataset.data, 2);
    var lowPrices = unpack(data.dataset.data, 3);
    var closingPrices = unpack(data.dataset.data, 4);
    var volume = unpack(data.dataset.data, 5);
    buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume);
});
}

// ***********************************************
// ************* Get Table Function **************
// ***********************************************
// select a range of dates, like "2008-2010"
// sort the date, like "2008 to 2010" or "2010-2008"
// select highest, lowest price within the range of dates



// ***********************************************
// ************* Get Table Function **************
// ***********************************************

function buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume) {
    var table = d3.select("#summary-table");
    var tbody = table.select("tbody");
    var trow;

    for (var i = 0; i < 12; i++) {
        trow = tbody.append("tr");
        trow.append("td").text(dates[i]);
        trow.append("td").text(openPrices[i]);
        trow.append("td").text(highPrices[i]);
        trow.append("td").text(lowPrices[i]);
        trow.append("td").text(closingPrices[i]);
        trow.append("td").text(volume[i]);
    }
}
 
// ***********************************************
// ************* Build Plot Function *************
// ***********************************************

var start_date1 = "2007-01-01";
var end_date1 = "2009-01-01"

function buildPlot1() {
var url = `https://www.quandl.com/api/v3/datasets/${ticker}.json?start_date=${start_date1}&end_date${end_date1}&api_key=${api_key}`;

d3.json(url).then(function(data) {

    // Grab values from the response json object to build the plots
    var name = data.dataset.name;
    var stock = data.dataset.dataset_code;
    var startDate = data.dataset.start_date;
    var endDate = data.dataset.end_date;
    var dates = unpack(data.dataset.data, 0);
    var openingPrices = unpack(data.dataset.data, 1);
    var highPrices = unpack(data.dataset.data, 2);
    var lowPrices = unpack(data.dataset.data, 3);
    var closingPrices = unpack(data.dataset.data, 4);

    getMonthlyData();

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

    var trace1 = {
    type: "scatter",
    mode: "lines",
    name: name,
    x: dates,
    y: closingPrices,
    line: {
        color: "#17BECF"
    }
    };

    // Candlestick Trace
    var trace2 = {
    type: "candlestick",
    x: dates,
    high: highPrices,
    low: lowPrices,
    open: openingPrices,
    close: closingPrices
    };

    var data = [trace1, trace2];

    var layout = {
    title: `${stock} closing prices`,
    xaxis: {
        range: [startDate, endDate],
        rangeselector: selectorOptions,
        rangeslider: {},
        type: "date"
    },
    yaxis: {
        autorange: true,
        type: "linear"
    },
    showlegend: false
    };

    Plotly.newPlot("plot1", data, layout);

});
}

buildPlot1();


var start_date2 = "2005-01-01";
var end_date2 = "2006-01-01"


function buildPlot2() {
    var url = `https://www.quandl.com/api/v3/datasets/${ticker}.json?start_date=${start_date2}&end_date=${end_date2}&api_key=${api_key}`;
    
    d3.json(url).then(function(data) {
    
        // Grab values from the response json object to build the plots
        var name = data.dataset.name;
        var stock = data.dataset.dataset_code;
        var startDate = data.dataset.start_date;
        var endDate = data.dataset.end_date;
        var dates = unpack(data.dataset.data, 0);
        var openingPrices = unpack(data.dataset.data, 1);
        var highPrices = unpack(data.dataset.data, 2);
        var lowPrices = unpack(data.dataset.data, 3);
        var closingPrices = unpack(data.dataset.data, 4);
    
        getMonthlyData();
    
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
    
        var trace1 = {
        type: "scatter",
        mode: "lines",
        name: name,
        x: dates,
        y: closingPrices,
        line: {
            color: "#17BECF"
        }
        };
    
        // Candlestick Trace
        var trace2 = {
        type: "candlestick",
        x: dates,
        high: highPrices,
        low: lowPrices,
        open: openingPrices,
        close: closingPrices
        };
    
        var data = [trace1, trace2];
    
        var layout = {
        title: `${stock} closing prices`,
        xaxis: {
            range: [startDate, endDate],
            rangeselector: selectorOptions,
            rangeslider: {},
            type: "date"
        },
        yaxis: {
            autorange: true,
            type: "linear"
        },
        showlegend: false
        };
    
        Plotly.newPlot("plot2", data, layout);
    
    });
    }
    
    buildPlot2();


    var start_date3 = "2020-01-01";
    var end_date3 = "2021-01-01"

    function buildPlot3() {
        var url = `https://www.quandl.com/api/v3/datasets/${ticker}.json?start_date=${start_date3}&end_date=${end_date3}&api_key=${api_key}`;
        
        d3.json(url).then(function(data) {
        
            // Grab values from the response json object to build the plots
            var name = data.dataset.name;
            var stock = data.dataset.dataset_code;
            var startDate = data.dataset.start_date;
            var endDate = data.dataset.end_date;
            var dates = unpack(data.dataset.data, 0);
            var openingPrices = unpack(data.dataset.data, 1);
            var highPrices = unpack(data.dataset.data, 2);
            var lowPrices = unpack(data.dataset.data, 3);
            var closingPrices = unpack(data.dataset.data, 4);
        
            getMonthlyData();
        
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
        
            var trace1 = {
            type: "scatter",
            mode: "lines",
            name: name,
            x: dates,
            y: closingPrices,
            line: {
                color: "#17BECF"
            }
            };
        
            // Candlestick Trace
            var trace2 = {
            type: "candlestick",
            x: dates,
            high: highPrices,
            low: lowPrices,
            open: openingPrices,
            close: closingPrices
            };
        
            var data = [trace1, trace2];
        
            var layout = {
            title: `${stock} closing prices`,
            xaxis: {
                range: [startDate, endDate],
                rangeselector: selectorOptions,
                rangeslider: {},
                type: "date"
            },
            yaxis: {
                autorange: true,
                type: "linear"
            },
            showlegend: false
            };
        
            Plotly.newPlot("plot3", data, layout);
        
        });
        }
        
        buildPlot3();


var start_date4 = "2020-08-01";
// var end_date3 = "2021-01-01"

function buildPlot4() {
var url = `https://www.quandl.com/api/v3/datasets/${ticker}.json?start_date=${start_date4}&api_key=${api_key}`;

d3.json(url).then(function(data) {

    // Grab values from the response json object to build the plots
    var name = data.dataset.name;
    var stock = data.dataset.dataset_code;
    var startDate = data.dataset.start_date;
    var endDate = data.dataset.end_date;
    var dates = unpack(data.dataset.data, 0);
    var openingPrices = unpack(data.dataset.data, 1);
    var highPrices = unpack(data.dataset.data, 2);
    var lowPrices = unpack(data.dataset.data, 3);
    var closingPrices = unpack(data.dataset.data, 4);

    getMonthlyData();

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

    var trace1 = {
    type: "scatter",
    mode: "lines",
    name: name,
    x: dates,
    y: closingPrices,
    line: {
        color: "#17BECF"
    }
    };

    // Candlestick Trace
    var trace2 = {
    type: "candlestick",
    x: dates,
    high: highPrices,
    low: lowPrices,
    open: openingPrices,
    close: closingPrices
    };

    var data = [trace1, trace2];

    var layout = {
    title: `${stock} closing prices`,
    xaxis: {
        range: [startDate, endDate],
        rangeselector: selectorOptions,
        rangeslider: {},
        type: "date"
    },
    yaxis: {
        autorange: true,
        type: "linear"
    },
    showlegend: false
    };

    Plotly.newPlot("plot4", data, layout);

});
}

buildPlot4();
  


