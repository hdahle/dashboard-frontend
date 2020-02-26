//
// app.js
//
// H. Dahle
//

// Create color array for charts
// 'color' is base color, 'num' is how many colors to create
// Resulting colors have hues evenly spaced in HSL color space
function mkColorArray(num, color) {
  // Color array for #222c3c: Use #db7f67 (coolors red in the palette)
  // Alternatively a little bit darker c8745e
  let c = d3.hsl(color === undefined ? '#c8745e' : color);
  let r = [];
  for (i = 0; i < num; i++) {
    r.push(c + "");
    c.h += (360 / num);
  }
  return r;
}

// Helpers for fetch() 
function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function json(response) {
  return response.json()
}

// Chart.js global settings
Chart.defaults.global.defaultFontFamily = "'Roboto', sans-serif";
Chart.defaults.global.elements.point.radius = 0;
Chart.defaults.global.elements.line.borderWidth = 2;
Chart.defaults.global.animation.duration = 0;
Chart.defaults.global.tooltips.backgroundColor = '#3f5270';// '#5e79a5';//'#222c3c';
Chart.defaults.global.tooltips.intersect = false;
Chart.defaults.global.tooltips.axis = 'x';
Chart.defaults.global.legend.labels.boxWidth = 10;
Chart.defaults.global.legend.display = true;
Chart.defaults.global.aspectRatio = 1;
Chart.defaults.global.responsive = true;

Chart.plugins.unregister(ChartDataLabels);
//Chart.defaults.global.plugins.crosshair.line.color = '#3f5270';

//
// Circularity
//
function plotCircularity(elmt, url) {
  let id = insertAccordionAndCanvas(elmt);
  let myChart = new Chart(document.getElementById(id.canvasId), {
    type: 'doughnut',
    plugins: [ChartDataLabels],
    options: {
      title: {
        display: true,
        fontSize: 14,
        position: 'bottom',
        fontColor: '#222c3c',
        fontStyle: 'normal',
        padding: 0
      },
      plugins: {
        crosshair: false,
        datalabels: {
          labels: {
            title: {
              align: 'top', offset: 8,
              color: '#3f5270',
              font: {
                size: 14,
              },
              formatter: (value, ctx) => ctx.dataset.label[ctx.dataIndex],
            },
            value: {
              color: '#3f5270',
              font: {
                size: 18,
                weight: 'bold'
              },
              formatter: (val) => val + ' Gt',
            }
          }
        }
      },
      legend: {
        display: false
      }
    }
  });
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('Circularity:', results.data.length);
      insertSourceAndLink(results, id, url);
      let d = results.data.pop();
      let c = mkColorArray(d.data[0].values.length);
      myChart.data.datasets.push({
        label: d.data[0].legend,
        data: d.data[0].values,
        backgroundColor: c,
      });
      myChart.data.labels = d.data[0].legend;
      myChart.options.title.text = 'Resources consumed: 100.6 Gt (billion tons)';//d.data[0].title;
      myChart.update();
    })
}

//
// Glacier length
//
function plotGlaciers(elmt) {
  let id = insertAccordionAndCanvas(elmt, true);
  let glaciers = ['Styggedalsbreen', 'Bondhusbrea', 'Boyabreen', 'Buerbreen',
    'Hellstugubreen', 'Storbreen', 'Stigaholtbreen', 'Briksdalsbreen',
    'Rembesdalskaaka', 'Engabreen', 'Faabergstolsbreen', 'Nigardsbreen', 'Lodalsbreen'
  ];
  let colors = mkColorArray(glaciers.length);
  let myChart = makeMultiLineChart(id.canvasId, { callback: (v) => v ? v + 'm' : v }, {}, true, 'right', 'linear', 2);
  let myChartMobile = makeMultiLineChart(id.canvasIdMobile, { callback: (v) => v ? v + 'm' : v }, {}, false);
  glaciers.forEach(x => {
    let url = 'https://api.dashboard.eco/glacier-length-nor-' + x;
    fetch(url)
      .then(status)
      .then(json)
      .then(results => {
        console.log('Glaciers:', results.data.length);
        insertSourceAndLink(results, id, url);
        let col = colors.pop();
        let dataset = {
          data: results.data,
          fill: false,
          borderColor: col,
          backgroundColor: col,
          showLine: true,
          label: results.glacier
        };
        myChart.data.datasets.push(dataset);
        myChartMobile.data.datasets.push(dataset);
        myChart.update();
        myChartMobile.update();
      })
      .catch(err => console.log(err));
  })
}

// 
// Plot scatter data. Used by several sections in HTML
//
function plotScatter(elmt, urls, labels, xTicks = {}, yTicks = {}, xAxesType = 'linear') {
  let id = insertAccordionAndCanvas(elmt);
  var myChart = new Chart(document.getElementById(id.canvasId), {
    type: 'scatter',
    options: {
      plugins: {
        crosshair: {
          sync: { enabled: false },
          zoom: { enabled: false },
          line: { color: '#3f5270' },
        }
      },
      scales: {
        xAxes: [{
          ticks: xTicks,
          type: xAxesType
        }],
        yAxes: [{
          ticks: yTicks
        }]
      }
    }
  });
  let c = mkColorArray(urls.length);
  while (urls.length && labels.length) {
    let url = urls.shift();
    let lbl = labels.shift();
    fetch(url)
      .then(status)
      .then(json)
      .then(results => {
        //console.log('plotUrls:', url, results.data.length);
        insertSourceAndLink(results, id, url);
        let col = c.pop();
        myChart.data.datasets.push({
          data: results.data,
          fill: false,
          borderColor: col,
          backgroundColor: col,
          showLine: true,
          label: lbl
        });
        myChart.update();
      })
      .catch(err => console.log(err));
  }
}


function makeStackedLineChart(canvas, xTicks, yTicks) {
  return new Chart(document.getElementById(canvas), {
    type: 'line',
    options: {
      plugins: {
        crosshair: {
          sync: { enabled: false },
          zoom: { enabled: false },
          line: { color: '#3f5270' }
        }
      },
      legend: {
        reverse: true,
        position: 'right',
      },
      scales: {
        yAxes: [{
          stacked: true,
          ticks: yTicks // { callback: (v) => (v / 1000) + ' Gt' }
        }],
        xAxes: [{
          type: 'linear',
          ticks: xTicks // { min: 1959, max: 2018, callback: (x) => x === 1960 ? null : x}
        }]
      }
    }
  });
}
//
// CO2 by region
//
function plotEmissionsByRegion(elmt) {
  let id = insertAccordionAndCanvas(elmt);
  let url = 'https://api.dashboard.eco/emissions-by-region';
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('CO2 Emissions by region:', results.data.length);
      insertSourceAndLink(results, id, url);
      let myChart = makeStackedLineChart(id.canvasId,
        { min: 1959, max: 2018, callback: (x) => x === 1960 ? null : x },
        { callback: (v) => (v / 1000) + ' Gt' }
      );
      let c = mkColorArray(results.data.length);
      while (results.data.length) {
        let d = results.data.pop();
        switch (d.country) {
          case 'EU28':
            continue;
          case 'World':
            if (myChart.options.scales.yAxes[0].stacked)
              continue;
          case 'Central America':
            d.country = 'C America';
            break;
          case 'South America':
            d.country = 'S America';
            break;
          case 'North America':
            d.country = 'N America';
            break;
          case 'Middle East':
            d.country = 'Midl East';
            break;
          case 'Bunkers':
            d.country = 'Transport';
            break;
        }
        col = c.pop();
        myChart.data.datasets.push({
          label: d.country,
          fill: true,
          borderColor: col,
          backgroundColor: col,
          data: d.data
        });
      }
      myChart.update();
    })
    .catch(err => console.log(err));
}

//
// Norway Annual GHG Emissions
//
function plotEmissionsNorway(elmt) {
  let id = insertAccordionAndCanvas(elmt);
  let url = 'https://api.dashboard.eco/emissions-norway';
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('Norway:', results.data.length);
      insertSourceAndLink(results, id, url);
      let myChart = makeStackedLineChart(id.canvasId,
        { max: 2018 },
        { callback: (value) => Math.trunc(value / 1000) + " Mt" }
      );
      let c = mkColorArray(results.data.length - 1);
      // Plot all datasets except 0 which is the Total
      for (let i = 1; i < results.data.length; i++) {
        myChart.data.datasets.push({
          data: results.data[i].values.map(x => ({ x: x.t, /* + "-12-31"*/ y: x.y })),
          backgroundColor: c[0],
          borderColor: c[0],
          label: results.data[i].name
        })
        c.shift();
      }
      myChart.update();
    })
    .catch(err => console.log(err))
}

//
// Arctic Ice Extent
//
function plotArcticIce(elmt) {
  let id = insertAccordionAndCanvas(elmt);
  let url = 'https://api.dashboard.eco/ice-nsidc';
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('ICE NSIDC:', results.data.length);
      insertSourceAndLink(results, id, url);
      let myChart = makeMultiLineChart(id.canvasId, {}, {}, true, 'right', 'category');
      myChart.data.labels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
      let yrs = [];
      // for (let i = 1979; i < 2021; i++) yrs.push(i);
      yrs = [2020, 2019, 2018, 2017, 2016, 2015, 2010, 2005, 2000, 1995, 1990, 1985, 1979];
      let c = mkColorArray(yrs.length).reverse();
      while (yrs.length) {
        let year = yrs.pop();
        // Extract a subset of data for a particular year
        let tmp = results.data.filter(x => x.year === year);
        // Then create a table that only contains the datapoints
        let resval = tmp.map(x => x.extent);
        myChart.data.datasets.push({
          data: resval,
          label: year,
          fill: false,
          borderColor: c[0],
          pointColor: c[0],
          backgroundColor: c[0],
          pointRadius: year == 2020 ? 2 : 0,
        });
        c.shift();
        myChart.update();
      }
    })
    .catch(err => console.log(err));
}

//
// World Population
//
function plotWorldPopulation(elmt) {
  let id = insertAccordionAndCanvas(elmt);
  let url = 'https://api.dashboard.eco/WPP2019_TotalPopulationByRegion';
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('Population:', results.data.length);
      insertSourceAndLink(results, id, url);
      let myChart = makeMultiLineChart(id.canvasId, {}, { callback: v => v / 1000 + ' bn' }, true, 'right');
      let c = mkColorArray(results.data.length);
      while (results.data.length) {
        let x = results.data.pop();
        x.region = x.region.replace('Latin America and the Caribbean', 'S America');
        x.region = x.region.replace('Northern America', 'N America');
        myChart.data.datasets.push({
          label: x.region,
          data: x.data,
          borderColor: c[0],
          backgroundColor: c[0],
          fill: false
        });
        c.shift();
      }
      myChart.update();
    })
    .catch(err => console.log(err));
}


function makeMultiLineChart(canvas, xTicks, yTicks, showLegend, pos, category, aspect) {
  return new Chart(document.getElementById(canvas), {
    type: 'line',
    options: {
      plugins: {
        crosshair: (category === 'category') ? false : {
          sync: { enabled: false },
          zoom: { enabled: false },
          line: { color: '#3f5270' }
        }
      },
      aspectRatio: aspect === undefined ? 1 : aspect,
      legend: {
        display: showLegend === undefined ? true : showLegend,
        position: pos === undefined ? 'top' : pos,
      },
      scales: {
        yAxes: [{
          ticks: yTicks
        }],
        xAxes: [{
          type: category === undefined ? 'linear' : category,
          ticks: xTicks
        }]
      }
    }
  });
}

//
// Global Oil Production
//
function plotEiaFossilFuelProduction(elmt, url) {
  let id = insertAccordionAndCanvas(elmt);
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('EIA:', results.series.length);
      insertSourceAndLink(results, id, url);
      let myChart = makeMultiLineChart(id.canvasId, {}, { callback: v => v / 1000 }, true);
      let c = mkColorArray(results.series.length - 6);
      while (results.series.length) {
        let d = results.series.pop();
        // Don't plot these...too much detail
        if (['EU28', 'USA', 'Japan', 'China', 'Russia', 'India'].indexOf(d.region) !== -1) {
          continue;
        }
        let col = c.pop();
        myChart.data.datasets.push({
          label: d.region,
          data: d.data,
          borderColor: col,
          backgroundColor: col,
          fill: false
        });
      }
      myChart.update();
    })
    .catch(err => console.log(err));
}

//
// Emissions by fuel-type
//
function plotEmissionsByFuelType(elmt) {
  let id = insertAccordionAndCanvas(elmt);
  let url = 'https://api.dashboard.eco/emissions-by-fuel-type';
  let myChart = makeMultiLineChart(id.canvasId, {
    min: 1959,
    max: 2018,
    callback: x => x === 1960 ? null : x
  }, {
    callback: v => (v / 1000) + ' Gt'
  }, true);
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('Emissions by type:', results.data.length);
      insertSourceAndLink(results, id, url);
      let c = mkColorArray(results.data.length - 1);
      while (results.data.length) {
        let d = results.data.shift();
        if (d.fuel === 'Per Capita') continue;
        let col = c.pop();
        myChart.data.datasets.push({
          label: d.fuel,
          fill: false,
          borderColor: col,
          backgroundColor: col,
          data: d.data
        });
      }
      myChart.update();
    })
    .catch(err => console.log(err));
}

//
// Ozone Hole Southern Hemisphere
//
function plotOzoneHole(elmt) {
  plotScatter(elmt,
    ['https://api.dashboard.eco/ozone-nasa'],
    ["Ozone hole in million sq km"],
    { max: 2019, autoSkip: true, maxTicksLimit: 8 },
    {}
  );
}

//
// Global Temperature Anomaly
//
function plotGlobalTemp(elmt) {
  plotScatter(elmt,
    ["https://api.dashboard.eco/global-temperature-anomaly", "https://api.dashboard.eco/global-temperature-hadcrut", "https://api.dashboard.eco/global-temperature-uah"],
    ["NASA dataset", "HadCRUT dataset", "UAH dataset"],
    { max: 2020, autoSkip: true, maxTicksLimit: 8 },
    { callback: value => Math.round(value * 10) / 10 + "\u00b0" + "C" }
  );
}

//
// Svalbard - Arctic Temperature Development
//
function plotSvalbardTemp(elmt) {
  plotScatter(elmt,
    ['https://api.dashboard.eco/temperature-svalbard'],
    ["Svalbard Airport annual mean temperature"],
    { min: 1900, max: 2020, autoSkip: true, maxTicksLimit: 8 },
    { callback: (value) => Math.round(value * 10) / 10 + "\u00b0" + "C" }
  );
}

//
// Brazil Forest Fires
//
function plotBrazilFires(elmt) {
  let id = insertAccordionAndCanvas(elmt);
  let url = 'https://api.dashboard.eco/queimadas-brazil';
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('Brazil:', results.data.length);
      insertSourceAndLink(results, id, url);
      let myChart = makeMultiLineChart(id.canvasId, {}, {}, true, 'right', 'category');
      let c = mkColorArray(3);
      while (results.data.length) {
        let x = results.data.pop();
        let values = x.data;
        // Too much data here. Let us just look at 2019 and Average
        if (x.year != 2019 && x.year != 2020 && x.year != "Average") { // && x.year != "Maximum" && x.year != "Minimum") 
          continue;
        }
        let col = c.pop();
        myChart.data.datasets.push({
          data: values,
          label: x.year,
          pointRadius: x.year == 2020 ? 3 : 0,
          borderColor: col,
          pointBackgroundColor: col,
          fill: false
        });
      }
      myChart.data.labels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
      myChart.update();
    })
    .catch(err => console.log(err));
}

//
// Global Sea Level Rise
//
function plotGlobalSeaLevel(elmt) {
  plotScatter(elmt,
    ['https://api.dashboard.eco/CSIRO_Recons_2015', 'https://api.dashboard.eco/CSIRO_Alt_yearly'],
    ['Land-based measurements', 'Satellite measurements'],
    { autoSkip: true, maxTicksLimit: 8, min: 1880, max: 2020 },
    { callback: value => value ? value + 'mm' : value });
}

//
// CCS - Cabon Capture
//
function plotCCS(elmt) {
  plotBothCCS(elmt, 'https://api.dashboard.eco/operational-ccs')
}
function plotPlannedCCS(elmt) {
  plotBothCCS(elmt, 'https://api.dashboard.eco/planned-ccs')
}
function makeHorizontalBar(canvas, xTicks, yTicks) {
  return new Chart(document.getElementById(canvas), {
    type: 'horizontalBar',
    plugins: [],
    options: {
      plugins: {
        crosshair: false
      },
      scales: {
        xAxes: [{
          ticks: xTicks
        }],
        yAxes: [{
          ticks: yTicks,
          gridLines: {
            display: false
          }
        }]
      },
      tooltips: {
        axis: 'y'
      },
      legend: {
        display: false
      }
    }
  });
}

function plotBothCCS(elmt, url) {
  let id = insertAccordionAndCanvas(elmt);
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('CCS:', results.data.length);
      insertSourceAndLink(results, id, url);
      var myChart = makeHorizontalBar(id.canvasId, { callback: v => v + 'Mt' }, {});
      // remove any null projects, then sort it
      let d = results.data.filter(x => x.project != null).sort((a, b) => b.capacity - a.capacity);
      let lineColor = d.map(x => {
        return x.type === 'EOR' ? '#c8745e' : (x.type == 'Storage' ? '#5ec874' : '#777');
      });
      myChart.data.datasets.push({
        data: d.map(x => x.capacity),
        backgroundColor: lineColor,
        borderColor: lineColor,
        categoryPercentage: 0.5,
      });
      myChart.data.labels = d.map(x => x.project + ", " + x.country);
      myChart.update();
    })
    .catch(err => console.log(err));
}

function plotSafety(elmt) {
  let id = insertAccordionAndCanvas(elmt);
  let urls = ['https://api.dashboard.eco/mortality-electricity',
    'https://api.dashboard.eco/mortality-electricity-sovacool',
    'https://api.dashboard.eco/mortality-electricity-markandya'
  ];
  for (let i = 0; i < urls.length; i++) {
    url = urls[i];
    fetch(url)
      .then(status)
      .then(json)
      .then(results => {
        insertSourceAndLink(results, id, url);
        if (i > 0) return;
        console.log('Mort:', results.data.length);
        let myChart = makeHorizontalBar(id.canvasId, {}, {});
        let lineColor = results.data.map(x => x.deaths > 1 ? '#c8745e' : '#5ec874');
        myChart.data.datasets.push({
          data: results.data.map(x => x.deaths),
          backgroundColor: lineColor,
          borderColor: lineColor,
          minBarLength: 3,
          categoryPercentage: 0.5,
        });
        myChart.data.labels = results.data.map(x => x.resource);
        myChart.update();
      })
      .catch(err => console.log(err));
  }
}