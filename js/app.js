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
// Three Corona charts side-by-side
//
function plotCoronaDeaths3(elmt, url, refCountry, countries, cumulative, suggestedMax) {
  //console.log("Ref:", refCountry, "Countries:", countries)
  function makeChart(elementId) {
    return new Chart(document.getElementById(elementId), {
      type: 'bar',
      options: {
        responsive: true,
        aspectRatio: 1,
        legend: {
          display: true,
          reverse: false,
          position: 'top',
          labels: {
            boxWidth: 8,
            fontSize: 14
          },
        },
        tooltips: {
          intersect: false,
          mode: 'index',
          callbacks: {
            label: function (tooltipItem, data) {
              let t = data.datasets[tooltipItem.datasetIndex].tooltipText;
              t = (t === undefined) || (t === null) ? '' : t;
              t0 = Array.isArray(t) && t.length > 0 ? t[0] : t;
              t1 = Array.isArray(t) && t.length > 1 ? t[1] : '';
              return t0 + Math.round(tooltipItem.yLabel) + t1;
            }
          }
        },
        scales: {
          xAxes: [{
            offset: true,
            type: 'time',
            time: {
              unit: 'day'
            }
          }],
          yAxes: [{
            id: 'L',
            position: 'left',
            ticks: {
              suggestedMax: suggestedMax,
              fontColor: 'rgb(40,80,150)'
            }
          }, {
            id: 'R',
            position: 'right',
            ticks: {
              max: 100,
              min: 0,
              fontColor: mkColorArray(2)[0],
              fontSize: 10,
              callback: v => v ? v + '%' : v
            },
            gridLines: {
              display: false
            }
          }]
        }
      }
    });
  }
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('Covid deaths:', results.data.length);
      //insertSourceAndLink(results, elementSource, url);
      let c = mkColorArray(2);
      let charts = [];
      elmt.forEach(e => charts.push(makeChart(e)))
      let chIndex = 0

      // Process each country
      while (countries.length) {
        let cName = countries.shift(); // country name
        console.log(cName)
        let x = results.data.find(x => x.country === cName);
        if (x === undefined) {
          console.log("Warning:", cn, " not found")
          continue;
        }
        /*
        let d = x.data;

        // Create a smoothed array of daily cases
        let smooth = [];
        for (let i = 0; i < d.length; i++) {
          let e = {
            t: d[i].t,
            y: 0, // cumulative 
            d: 0, // daily
            c: 0 // change in percent
          }
          if (i === 0) {
            e.y = d[i].y;//(d[i].y + d[i+1].y) / 2;
          } else if (i === d.length - 1) {
            e.y = d[i].y;//(d[i-1].y +d[i].y) / 2;
          } else {
            e.y = (d[i - 1].y + d[i].y + d[i + 1].y) / 3;
          }
          smooth[i] = e;
        }
        // Calculate growth based on smoothed daily numbers
        for (let i = 0; i < smooth.length; i++) {
          if (i === 0) {
            smooth[i].c = 0;
            smooth[i].d = 0;
          } else if (i === smooth.length - 1) {
            smooth[i].d = d[i].y - d[i - 1].y;
            smooth[i].c = 100 * smooth[i].d / smooth[i - 1].y;
          } else {
            smooth[i].d = (smooth[i].y - smooth[i - 1].y)
            smooth[i].c = 100 * smooth[i].d / smooth[i - 1].y;
          }
        }
        */
        // Push the ba chart of cases per day
        charts[chIndex].data.datasets.push({
          yAxisID: 'L',
          label: x.country,
          barPercentage: 0.8,
          backgroundColor: 'rgba(40,80,150,0.4)', //c[1],
          categoryPercentage: 1,
          tooltipText: 'Cases per day: ',
          data: x.data.map(x => ({
            t: x.t,
            y: cumulative ? x.y : x.d
          }))
        });
        // Push the line chart of smoothed daily change
        charts[chIndex].data.datasets.push({
          yAxisID: 'R',
          type: 'line',
          label: 'Daily increase',
          categoryPercentage: 1,
          fill: false,
          borderColor: c[0],
          backgroundColor: c[0],
          borderWidth: 2,
          tooltipText: ['Daily increase: ', '%'],
          data: x.data.map(x => ({
            t: x.t,
            y: x.y > 100 ? x.c : null
          }))/*smooth.map(x => ({
            t: x.t,
            y: x.y > 100 ? x.c : null
          }))*/
        });
        chIndex++;
      }
      charts.forEach(x => x.update());
    })
    .catch(err => console.log(err));
}

//
// Covid / Coronavirus Top 20 Countries
//
function plotCorona(elmt, url) {
  let id = insertAccordionAndCanvas(elmt, true);
  function makeChart(id, mobile = false) {
    return new Chart(document.getElementById(id), {
      type: 'line',
      options: {
        responsive: true,
        aspectRatio: mobile ? 0.9 : 2,
        legend: {
          display: true,
          reverse: false,
          position: 'right',
          labels: {
            boxWidth: 8,
            padding: 6,
            fontSize: mobile ? 10 : 12
          },
        },
        tooltips: {
          intersect: false,
          mode: 'index'
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'day'
            }
          }]
        }
      }
    });
  }
  let myChart = makeChart(id.canvasId);
  let myChartMobile = makeChart(id.canvasIdMobile, true);
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      //console.log('Covid:', results.data.length);
      insertSourceAndLink(results, id, url);
      let d = results.data.sort((a, b) => b.data[b.data.length - 1].y - a.data[a.data.length - 1].y);
      // just get top20
      d = d.slice(0, 21);
      let c = mkColorArray(d.length);
      while (d.length) {
        let x = d.shift();
        if (x.country === 'World') continue;
        let tmp = {
          label: x.country === 'Others' ? 'Diamond Princess' : x.country,
          fill: false,
          borderColor: c[0],
          backgroundColor: c[0],
          data: x.data
        };
        c.shift();
        myChart.data.datasets.push(tmp);
        myChartMobile.data.datasets.push(tmp);
      }
      myChart.update();
      myChartMobile.update();
    })
    .catch(err => console.log(err));
}

//
// Corona cases by capita
//
function plotCoronaByCapita(elmt, url) {
  let id = insertAccordionAndCanvas(elmt);
  let myChart = new Chart(document.getElementById(id.canvasId), {
    type: 'horizontalBar',
    options: {
      responsive: true,
      aspectRatio: 1,
      legend: {
        display: false,
      },
      scales: {
        yAxes: [{
          gridLines: {
            display: false
          }
        }]
      },
      tooltips: {
        intersect: false,
        mode: 'index',
        displayColors: false,
        callbacks: {
          label: function (tooltipItem, data) {
            let n = myChart.data.datasets[tooltipItem.datasetIndex].data2[tooltipItem.index];
            return [tooltipItem.xLabel + ' per million', n + '  total'];
          }
        }
      },
    }
  });
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      //console.log('Covid:', results);
      insertSourceAndLink(results, id, url);
      // Create array of { country, cases }
      let data = results.data.map(d => ({
        country: d.country,
        ypm: d.data.slice(-1)[0].ypm,
        y: d.data.slice(-1)[0].y
      }));
      // Remove 'others'
      data = data.filter(x => x.country !== 'Others' && x.country !== 'Diamond Princess');
      // Sort array
      data = data.sort((a, b) => b.ypm - a.ypm);
      // Extract top 20
      data = data.slice(0, 20);
      let col = mkColorArray(data.length * 2);
      // Plot it    
      myChart.data.datasets.push({
        backgroundColor: col,
        borderColor: 'rgba(0,0,0,0)',
        borderWidth: 2,
        categoryPercentage: 0.5,
        data: data.map(x => x.ypm),
        data2: data.map(x => x.y)
      });
      myChart.data.labels = data.map(x => x.country);
      myChart.update();
    })
    .catch(err => console.log(err));
}

//
// CO2 vs GDP
//
function plotCO2vsGDP(elmt) {
  let id = insertAccordionAndCanvas(elmt, true);
  function makeBubbleChart(elmt, mobile = false) {
    return new Chart(document.getElementById(elmt), {
      type: 'bubble',
      options: {
        tooltips: {
          intersect: true,
          callbacks: {
            title: (i, d) => d.datasets[i[0].datasetIndex].label,
            label: (i, d) => {
              let data = d.datasets[i.datasetIndex].data[0];
              return [
                'GDP per capita: $' + data.x,
                'CO2 per capita: ' + data.y + ' kg',
                'Total CO2: ' + Math.trunc(data.r) / 5 + ' Gt'
              ]
            }
          }
        },
        responsive: true,
        aspectRatio: mobile ? 1 : 2,
        scales: {
          xAxes: [{
            ticks: {
              min: 0,
              max: 60000,
              callback: v => '$' + v
            },
            scaleLabel: {
              display: mobile ? false : true,
              labelString: 'GDP per capita, in USD (PPP)',
            }
          }],
          yAxes: [{
            ticks: {
              min: 0,
              max: 18000,
              callback: v => v ? v / 1000 + 't' : 0
            },
            scaleLabel: {
              display: mobile ? false : true,
              labelString: 'Emissions per capita',
            }
          }]
        },
        legend: {
          display: true,
          position: mobile ? 'top' : 'right',
          labels: {
            boxWidth: 10,
          },
          onClick: function (e, legendItem) {
            let index = legendItem.datasetIndex;
            let ci = this.chart;
            let m = ci.getDatasetMeta(index);
            // toggle hidden state
            m.hidden = (m.hidden === null) ? true : null;
            let country = ci.data.datasets[index].data[0];
            // no parent? done.
            if (country.p === null) {
              ci.update();
              return;
            }
            // add or subtract? hidden or visible
            let addsub = (m.hidden === true) ? 1 : -1;
            // hide country, add country values to parent
            ci.data.datasets.forEach(d => {
              if (country.p === d.data[0].l) {
                // update the parent
                d.data[0].gdp += addsub * country.gdp;
                d.data[0].pop += addsub * country.pop;
                d.data[0].co2 += addsub * country.co2;
                d.data[0].x = Math.trunc(1000000 * d.data[0].gdp / d.data[0].pop);
                d.data[0].y = Math.trunc(1000000 * d.data[0].co2 / d.data[0].pop);
                d.data[0].r = Math.trunc(d.data[0].co2 / 20) / 10;
              }
            });
            ci.update();
            return;
          },
        },
      }
    });
  }
  let myChart = makeBubbleChart(id.canvasId);
  let myChartMobile = makeBubbleChart(id.canvasIdMobile, true);
  let data = [{
    l: 'USA',
    partof: 'North America',
    gdp: 18962.24,
    co2: 5133.44,
    pop: 325511.2
  },/* { 
      l: 'EU28',
      partof: 'Europe',
      gdp: 20472.96,
      co2: 3767.43,
      pop: 511973.71
    },*/
  {
    l: 'China',
    partof: 'Asia&Oceania',
    gdp: 22424.11,
    co2: 10418.81,
    pop: 1421755
  }, {
    l: 'India',
    partof: 'Asia&Oceania',
    gdp: 9335.14,
    co2: 2312.06,
    pop: 1340510
  }, {
    l: 'Japan',
    partof: 'Asia&Oceania',
    gdp: 5264.93,
    co2: 1116.99,
    pop: 127461.2
  }, {
    l: 'Africa',
    partof: 'World',
    gdp: 6272.51,
    co2: 1308.81,
    pop: 1232977.03
  }, {
    l: 'Russia',
    partof: 'CIS',
    gdp: 3920.67,
    co2: 1782.24,
    pop: 145517.8
  }, {
    l: 'Latin America',
    partof: 'World',
    gdp: 7356.64,
    co2: 1400.09,
    pop: 511275.85
  }, {
    l: 'North America',
    partof: 'World',
    gdp: 23075.23 - 18962.24,
    co2: 6099.79 - 5133.44,
    pop: 487073.11 - 325511.2
  }, {
    l: 'Asia&Oceania',// exc. Chn/Ind/Jpn',
    partof: 'World',
    gdp: 52234.89 - 22424.11 - 9335.14 - 5264.93,
    co2: 17522.55 - 10418.81 - 2312.06 - 1116.99,
    pop: 4143775.33 - 1421755 - 1340510 - 127461.2
  }, {
    l: 'Middle East',
    partof: 'World',
    gdp: 6115.22,
    co2: 2207.26,
    pop: 248132.95
  }, {
    l: 'Europe',
    partof: 'World',
    gdp: 23743.54,
    co2: 4402.95,
    pop: 625071.09
  }, {
    l: 'CIS',
    partof: 'World',
    gdp: 5561.51 - 3920.67,
    co2: 2603.84 - 1782.24,
    pop: 288783.53 - 145517.8
  }/*, { 
      l: 'World',
      partof: null,
      gdp: 0,//124359.27,
      co2: 0,//35545.29,
      pop: 0,//7537088.89
    }*/
  ];
  // sort array in order to get nice labels
  data = data.sort((a, b) => b.gdp / b.pop - a.gdp / a.pop);
  let colors = mkColorArray(data.length);
  data.forEach(x => x.color = colors.pop());
  // prepare and scale data before charting
  data.map(x => ({
    x: Math.trunc(1000000 * x.gdp / x.pop),
    y: Math.trunc(1000000 * x.co2 / x.pop),
    r: Math.trunc(x.co2 / 20) / 10,
    l: x.l,
    p: x.partof,
    gdp: x.gdp,
    co2: x.co2,
    pop: x.pop,
    col: x.color
  })).forEach(item => {
    myChart.data.datasets.push({
      data: [item],
      label: item.l,
      backgroundColor: item.col.replace(')', ',0.7)'),
      borderColor: item.col.replace(')', ',1)')
    })
    myChartMobile.data.datasets.push({
      data: [item],
      label: item.l,
      backgroundColor: item.col.replace(')', ',0.7)'),
      borderColor: item.col.replace(')', ',1)')
    })
  });
  myChart.update();
  myChartMobile.update();
}

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
  let myChart = makeMultiLineChart(id.canvasId, {}, { callback: v => v ? v + 'm' : v }, true, 'right', 'linear', 2);
  let myChartMobile = makeMultiLineChart(id.canvasIdMobile, {}, { callback: v => v ? v + 'm' : v }, false);
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
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            return /*data.labels[tooltipItem.datasetIndex] + ' ' +*/ tooltipItem.xLabel + ': ' + tooltipItem.yLabel;
          }
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
        //console.log('URL:', url, results.data)
        myChart.data.labels.push(lbl);
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
          ticks: yTicks
        }],
        xAxes: [{
          type: 'linear',
          ticks: xTicks
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
        { min: 1959, max: 2018, callback: x => x === 1960 ? null : x },
        { callback: v => (v / 1000) + ' Gt' }
      );
      let c = mkColorArray(results.data.length - 2);
      while (results.data.length) {
        let d = results.data.pop();
        switch (d.country) {
          case 'EU28':
            continue;
          case 'World':
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
      myChart.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let yrs = [2020, 2019, 2018, 2017, 2016, 2015, 2010, 2005, 2000, 1995, 1990, 1985, 1979];
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
      let myChart = makeMultiLineChart(id.canvasId, {}, {}, true, 'top', 'category');
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
          //type: x.year === 'Average' ? 'line' : 'bar',
          data: values,
          label: x.year,
          pointRadius: x.year == 2020 ? 3 : 0,
          borderColor: col,
          //backgroundColor: col,
          pointBackgroundColor: col,
          fill: false
        });
      }
      myChart.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
// CCS - Carbon Capture
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