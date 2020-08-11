//
// app.js
//
// 2020 H. Dahle
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
function colorArrayToAlpha(arr, alpha) {
  return arr.map(x => x.replace('rgb', 'rgba').replace(')', ',' + alpha + ')'));
}
function colorArrayMix(arr) {
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    if (i % 2) {
      res.push(arr[i])
    } else {
      res.unshift(arr[i])
    }
  }
  return res;
}

// Chart.js global settings
Chart.defaults.global.defaultFontFamily = "'Roboto', sans-serif";
Chart.defaults.global.elements.point.radius = 0;
Chart.defaults.global.elements.line.borderWidth = 2;
Chart.defaults.global.animation.duration = 0;
Chart.defaults.global.tooltips.backgroundColor = 'rgba(63,82,112,0.75)';//'#3f5270';// '#5e79a5';//'#222c3c';
Chart.defaults.global.tooltips.intersect = false;
Chart.defaults.global.tooltips.axis = 'x';
Chart.defaults.global.legend.labels.boxWidth = 10;
Chart.defaults.global.legend.display = true;
Chart.defaults.global.aspectRatio = 1;
Chart.defaults.global.responsive = true;

Chart.plugins.unregister(ChartDataLabels);

//
// Plot Spain Electricity Consumption last 10 years
//
function plotSpainElectricity(elmt, json, urls, yUnit = '') {
  let id = insertAccordionAndCanvas(elmt, false);
  let myChart = new Chart(document.getElementById(id.canvasId), {
    type: 'line',
    options: {
      scales: {
        yAxes: [{
          ticks: {
            fontSize: 10,
            min: 0,
            callback: v => v + yUnit
          }
        }],
        xAxes: [{
          type: 'time',
          time: {
            parser: 'MM-DD',
            unit: 'week',
            displayFormats: {
              week: 'MMM D'
            }
          },
          gridLines: {
            display: false
          }
        }]
      },
      tooltips: {
        callbacks: {
          title: (tooltip) => moment(tooltip[0].xLabel, 'MM-DD').format('MMMM D')
        }
      }
    }
  });
  let cSolid = mkColorArray(json.length);
  let cAlpha = colorArrayToAlpha(cSolid, 0.3);
  let c2020 = cSolid[0];
  insertSourceAndLink(json[0], id, urls);

  while (json.length) {
    let results = json.pop();
    // Just plot the days since start of year until end of current month
    let d = results.data.slice(1, parseInt(moment().endOf('month').format('DDD')));
    let year = results.year;
    myChart.data.datasets.push({
      label: year,
      borderColor: year == 2020 ? c2020 : cAlpha.pop(),
      backgroundColor: year == 2020 ? c2020 : cSolid.pop(),
      showLine: true,
      fill: false,
      data: d
    });
  }
  myChart.update();
}

//
// Daily CO2 per year
//
function plotDailyCO2(elmt, url) {
  let id = insertAccordionAndCanvas(elmt, false);
  let myChart = new Chart(document.getElementById(id.canvasId), {
    type: 'line',
    options: {
      legend: {
        position: 'right'
      },
      scales: {
        yAxes: [{
          ticks: {
            callback: v => v + 'ppm'
          }
        }],
        xAxes: [{
          type: 'time',
          time: {
            parser: 'MM-DD',
            unit: 'month',
            displayFormats: {
              month: 'MMM'
            }
          }
        }]
      },
      tooltips: {
        mode: 'index',
        callbacks: {
          title: (tooltip) => {
            if (tooltip[0].datasetIndex === 0) {
              let diff = tooltip[0].value - tooltip[1].value;
              let chg = Math.floor(1000 * diff / tooltip[1].value) / 10;
              return [
                moment(tooltip[0].xLabel, 'MM-DD').format('MMMM D'),
                "2020 compared to " +
                myChart.data.datasets[tooltip[1].datasetIndex].label +
                ": " + (chg > 0 ? '+' : '') + chg + "%"
              ]
            }
            return moment(tooltip[0].xLabel, 'MM-DD').format('MMMM D')
          }
        }
      }
    }
  });

  let d = redisCO2Daily.data;
  let cSolid = mkColorArray(d.length);
  let cAlpha = colorArrayToAlpha(cSolid, 0.6);
  insertSourceAndLink(redisCO2Daily, id, url);
  // plot each year as a separate dataset
  while (d.length) {
    let x = d.shift();
    let cS = cSolid.pop();
    let cA = cAlpha.pop();
    myChart.data.datasets.push({
      label: x.year,
      borderColor: x.year == 2020 ? cS : cA,
      backgroundColor: cS,
      showLine: true,
      fill: false,
      data: x.data
    });
  }
  myChart.update();
}

//
// Three Corona charts side-by-side
//
function plotCoronaDeaths3(elmt, json, countries) {
  function makeChart(elementId) {
    return new Chart(document.getElementById(elementId), {
      type: 'bar',
      options: {
        aspectRatio: 1.3,
        tooltips: {
          mode: 'index',
          callbacks: {
            title: (tooltip) => {
              return moment(tooltip[0].xLabel, 'YYYY-MM-DD').format('MMMM D')
            },
            label: (tooltipItem, data) => {
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
              unit: 'week',
              displayFormats: {
                week: 'MMM D'
              }
            }
          }],
          yAxes: [{
            id: 'L',
            position: 'left',
            ticks: {
              suggestedMax: 100,
              min: 0
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
  console.log('Covid, countries:', json.data.length);
  //insertSourceAndLink(results, elementSource, url);
  let c = mkColorArray(2);
  let c0 = c[0];
  let c1 = c[1].replace('rgb', 'rgba').replace(')', ',0.6)');
  json.data.forEach(x => {
    if (!elmt.length) return;
    let ch = makeChart(elmt.pop());
    ch.data.datasets.push({
      yAxisID: 'L',
      label: x.country + ': ' + x.total + ' deaths',
      barPercentage: 0.8,
      backgroundColor: c1,
      categoryPercentage: 1,
      tooltipText: 'Deaths per day: ',
      data: x.data.map(x => ({
        t: x.t,
        y: x.d
      }))
    });
    // Push the line chart of smoothed daily change
    ch.data.datasets.push({
      yAxisID: 'R',
      type: 'line',
      label: 'Daily increase',
      categoryPercentage: 1,
      fill: false,
      borderColor: c0,
      backgroundColor: c0,
      tooltipText: ['Daily increase: ', '%'],
      data: x.data,
    });
    ch.update();
  });
}


//
// Corona cases by capita
//
function plotCoronaDeathsByCapita(elmt, url) {
  let id = insertAccordionAndCanvas(elmt);
  let myChart = new Chart(document.getElementById(id.canvasId), {
    type: 'horizontalBar',
    options: {
      title: {
        display: true,
        text: 'Deaths per one million',
        position: 'bottom',
        fontStyle: 'normal'
      },
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
  insertSourceAndLink(redisCovidDeathsTop, id, url);
  myChart.data.datasets.push({
    backgroundColor: '#c8745e',
    categoryPercentage: 0.5,
    data: redisCovidDeathsTop.data.percapita,
    data2: redisCovidDeathsTop.data.total
  });
  myChart.data.labels = redisCovidDeathsTop.data.countries;
  myChart.update();
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
            title: (i, d) => {
              return d.datasets[i[0].datasetIndex].label
            },
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
          position: mobile ? 'top' : 'right',
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
  //data.forEach(x => x.color = colors.pop());
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
    col: colors.pop() //x.color
  })).forEach(item => {
    myChart.data.datasets.push({
      data: [item],
      label: item.l,
      backgroundColor: item.col.replace('rgb', 'rgba').replace(')', ',0.7)'),
      borderColor: item.col.replace('rgb', 'rgba').replace(')', ',1)')
    })
    myChartMobile.data.datasets.push({
      data: [item],
      label: item.l,
      backgroundColor: item.col.replace('rgb', 'rgba').replace(')', ',0.7)'),
      borderColor: item.col.replace('rgb', 'rgba').replace(')', ',1)')
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
      tooltips: {
        enabled: false
      },
      title: {
        display: true,
        position: 'bottom',
        fontStyle: 'normal'
      },
      plugins: {
        datalabels: {
          labels: {
            title: {
              align: 'top',
              color: '#fff',
              formatter: (value, ctx) => ctx.dataset.label[ctx.dataIndex]
            },
            value: {
              offset: 8,
              color: '#fff',
              font: {
                size: 16
              },
              formatter: (value) => value + ' Gt'
            }
          }
        }
      },
      legend: {
        display: false
      }
    }
  });
  let results = redisCircularity2020;
  console.log('Circularity:', results.data.length);
  insertSourceAndLink(results, id, url);

  let legend = results.data[0].data[0].legend;
  let values = results.data[0].data[0].values;
  let c = mkColorArray(values.length);
  myChart.data.datasets.push({
    label: legend,
    data: values,
    backgroundColor: c,
  });
  let tot = results.data[0].data[0].total;
  myChart.options.title.text = 'Resources consumed: ' + tot + ' Gt (billion tons)';
  myChart.update();
}

//
// Glacier length
//
function plotGlaciers(elmt) {
  let id = insertAccordionAndCanvas(elmt, true);
  let results = redisGlaciers;
  let colors = mkColorArray(results.length);
  let myChart = makeMultiLineChart(id.canvasId, { min: 1900, max: 2020 }, { callback: v => v ? v + 'm' : v }, true, 'right', 'linear', 2);
  let myChartMobile = makeMultiLineChart(id.canvasIdMobile, { min: 1900, max: 2020 }, { callback: v => v ? v + 'm' : v }, false);

  while (results.length) {
    let d = results.pop();
    let url = 'https://api.dashboard.eco/glacier-length-nor-' + d.glacier;
    insertSourceAndLink(results, id, url);
    let col = colors.pop();
    let dataset = {
      data: d.data,
      fill: false,
      borderColor: col,
      backgroundColor: col,
      showLine: true,
      label: d.glacier
    };
    myChart.data.datasets.push(dataset);
    myChartMobile.data.datasets.push(dataset);
  }
  myChart.update();
  myChartMobile.update();
}

// 
// Plot scatter data. Used by several sections in HTML
//
function plotScatter(elmt, urls, res, labels, xTicks = {}, yTicks = {}, xAxesType = 'linear', parser = 'YYYY-MM-DD') {
  let id = insertAccordionAndCanvas(elmt);
  var myChart = new Chart(document.getElementById(id.canvasId), {
    type: 'scatter',
    options: {
      tooltips: {
        callbacks: {
          label: (tooltipItem) => {
            let x = tooltipItem.xLabel;
            if (moment(x, 'YYYY-MM-DD', true).isValid()) {
              x = moment(x, 'YYYY-MM-DD').format('MMM YYYY');
            }
            return x + ': ' + tooltipItem.yLabel;
          },
        }
      },
      scales: {
        xAxes: [{
          ticks: xTicks,
          type: xAxesType,
          time: {
            parser: parser,
            unit: 'year'
          }
        }],
        yAxes: [{
          ticks: yTicks
        }]
      }
    }
  });
  let c = mkColorArray(urls.length);
  if ((urls.length !== res.length) || (labels.length !== res.length)) return;

  while (res.length) {
    let url = urls.shift();
    let lbl = labels.shift();
    let results = res.shift();
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
  }
  myChart.data.labels = labels;
  myChart.update();
}


function makeStackedLineChart(canvas, xTicks, yTicks) {
  return new Chart(document.getElementById(canvas), {
    type: 'line',
    options: {
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
  let results = redisEmissionsByRegion;
  console.log('CO2 Emissions by region:', results.data.length);
  insertSourceAndLink(results, id, url);
  let myChart = makeStackedLineChart(id.canvasId,
    { min: 1959, max: 2018, callback: x => x === 1960 ? null : x },
    { callback: v => (v / 1000) + ' Gt' }
  );
  let c = mkColorArray(results.data.length);
  c = colorArrayMix(c);
  while (results.data.length) {
    let d = results.data.pop();
    myChart.data.datasets.push({
      label: d.country,
      fill: true,
      borderColor: c[0],
      backgroundColor: c[0],
      data: d.data
    });
    c.shift();
  }
  myChart.update();
}

//
// Norway Annual GHG Emissions
//
function plotEmissionsNorway(elmt) {
  let id = insertAccordionAndCanvas(elmt);
  let url = 'https://api.dashboard.eco/emissions-norway';
  let results = redisEmissionsNorway;
  console.log('Norway:', results.data.length);
  insertSourceAndLink(results, id, url);
  let myChart = makeStackedLineChart(id.canvasId,
    { max: 2019 },
    { callback: (value) => Math.trunc(value / 1000) + " Mt" }
  );
  let c = mkColorArray(results.data.length - 1);
  // Plot all datasets except 0 which is the Total
  for (let i = 1; i < results.data.length; i++) {
    myChart.data.datasets.push({
      data: results.data[i].values,//.map(x => ({ x: x.t, /* + "-12-31"*/ y: x.y })),
      backgroundColor: c[0],
      borderColor: c[0],
      label: results.data[i].name
    })
    c.shift();
  }
  myChart.update();
}

//
// Arctic Ice Extent
//
function plotArcticIce(elmt) {
  let id = insertAccordionAndCanvas(elmt);
  let url = 'https://api.dashboard.eco/ice-nsidc';
  let results = redisIceNsidc;
  console.log('ICE NSIDC:', results.data.length);
  insertSourceAndLink(results, id, url);
  let myChart = makeMultiLineChart(id.canvasId, {}, {}, true, 'right', 'category');
  myChart.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let yrs = [1979, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2016, 2017, 2018, 2019, 2020];
  let cSolid = mkColorArray(yrs.length);
  let cAlpha = colorArrayToAlpha(cSolid, 0.4);
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
      borderColor: year == 2020 ? cSolid[0] : cAlpha[0],
      backgroundColor: cAlpha[0],
      pointRadius: year == 2020 ? 4 : 0,
    });
    cSolid.shift();
    cAlpha.shift();
  }
  myChart.update();
}

//
// World Population
//
function plotWorldPopulation(elmt) {
  let id = insertAccordionAndCanvas(elmt);
  let url = 'https://api.dashboard.eco/WPP2019_TotalPopulationByRegion';
  let results = redisPopulationByRegion;
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
}


function makeMultiLineChart(canvas, xTicks, yTicks, showLegend, pos, category, aspect) {
  return new Chart(document.getElementById(canvas), {
    type: 'line',
    options: {
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
  let results = null;
  if (url.includes('oil')) results = redisEiaGlobalOil;
  else if (url.includes('gas')) results = redisEiaGlobalGas;
  else if (url.includes('coal')) results = redisEiaGlobalCoal;
  else return;

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
  let results = redisEmissionsByFuelType;
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
}

//
// Ozone Hole Southern Hemisphere
//
function plotOzoneHole(elmt) {
  plotScatter(elmt,
    ['https://api.dashboard.eco/ozone-nasa'],
    [redisOzoneNasa],
    ["Ozone hole in million sq km"],
    { max: 2020, autoSkip: true, maxTicksLimit: 8 },
    {}
  );
}

//
// Global Temperature Anomaly
//
function plotGlobalTemp(elmt) {
  plotScatter(elmt,
    ["https://api.dashboard.eco/global-temperature-anomaly", "https://api.dashboard.eco/global-temperature-hadcrut", "https://api.dashboard.eco/global-temperature-uah"],
    [redisGlobalTemperatureAnomaly, redisGlobalTemperatureHadcrut, redisGlobalTemperatureUah],
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
    [redisTemperatureSvalbard],
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
  let results = redisQueimadasBrazil;
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
      data: values,
      label: x.year,
      pointRadius: x.year == 2020 ? 4 : 0,
      borderColor: col,
      backgroundColor: col,
      fill: false
    });
  }
  myChart.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  myChart.update();
}

//
// Global Sea Level Rise
//
function plotGlobalSeaLevel(elmt) {
  plotScatter(elmt,
    ['https://api.dashboard.eco/CSIRO_Recons_2015', 'https://api.dashboard.eco/CSIRO_Alt_yearly'],
    [redisCsiroRecons2015, redisCsiroAltYearly],
    ['Land-based measurements', 'Satellite measurements'],
    { autoSkip: true, maxTicksLimit: 8, min: 1880, max: 2020 },
    { callback: value => value ? value + 'mm' : value });
}

//
// CCS - Carbon Capture
//
function plotCCS(elmt) {
  plotBothCCS(elmt, 'https://api.dashboard.eco/operational-ccs', redisOperationalCCS)
}
function plotPlannedCCS(elmt) {
  plotBothCCS(elmt, 'https://api.dashboard.eco/planned-ccs', redisPlannedCCS)
}
function makeHorizontalBar(canvas, xTicks, yTicks) {
  return new Chart(document.getElementById(canvas), {
    type: 'horizontalBar',
    plugins: [],
    options: {
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

function plotBothCCS(elmt, url, results) {
  let id = insertAccordionAndCanvas(elmt);
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
}

function plotSafety(elmt) {
  let id = insertAccordionAndCanvas(elmt);
  insertSourceAndLink(redisMortalityElectricity, id, 'https://api.dashboard.eco/mortality-electricity');
  insertSourceAndLink(redisMortalityElectricitySovacool, id, 'https://api.dashboard.eco/mortality-electricity-sovacool');
  insertSourceAndLink(redisMortalityElectricityMarkandya, id, 'https://api.dashboard.eco/mortality-electricity-markandya');
  let myChart = makeHorizontalBar(id.canvasId, {}, {});
  let d = redisMortalityElectricity.data;
  console.log('Safety electricity:', d.length);
  let lineColor = d.map(x => x.deaths > 1 ? '#c8745e' : '#5ec874');
  myChart.data.datasets.push({
    data: d.map(x => x.deaths),
    backgroundColor: lineColor,
    borderColor: lineColor,
    minBarLength: 3,
    categoryPercentage: 0.5,
  });
  myChart.data.labels = d.map(x => x.resource);
  myChart.update();
}