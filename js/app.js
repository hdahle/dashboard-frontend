//
// app.js
//
// 2020 H. Dahle
//

// Create color array for charts
// 'color' is base color, 'num' is how many colors to create
// Resulting colors have hues evenly spaced in HSL color space
function mkColorArray(num, color) {
  // For the blue sky futureplanet: #00519d
  let c = d3.hsl(color === undefined ? '#00519d' : color);
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
function colorToAlpha(color, alpha) {
  return color.replace('rgb', 'rgba').replace(')', ',' + alpha + ')');
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
Chart.defaults.global.animation.duration = 0;
//Chart.defaults.global.animation.onComplete = (e) => onCompleteCallback(e.chart);

Chart.plugins.unregister(ChartDataLabels);

let currentYear = moment().format('YYYY');

//
// EIA Cost of Electricity Generation USA 2025
//
function plotEiaLcoe(elmt, results, url) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('EIA LCOE:', url, results.data.datasets.length);
  insertSourceAndLink(results, id, url);
  let color = mkColorArray(results.data.datasets.length);

  // Add colors to the datasets
  results.data.datasets.forEach(d => {
    d.backgroundColor = color.pop();
    d.borderWidth = 0;
  });
  results.data.datasets.forEach(d => {
    d.data = d.data.map(x => Math.round(x) / 1000)
  });
  results.data.labels = results.data.fuels;

  new Chart(document.getElementById(id.canvasId), {
    type: 'bar',
    options: {
      aspectRatio: 1,
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          }
        }],
        yAxes: [{
          ticks: {
            fontSize: 10,
            min: 0,
            callback: v => v + ' $/kWh'
          }
        }]
      }
    },
    data: results.data,
  });
}

//
// Polestar Life cycle data
//
function plotPolestar(elmt, url, results) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('Polestar:', url);
  insertSourceAndLink(results, id, url);

  let color = colorArrayToAlpha(mkColorArray(results.data.datasets.length), 0.7);
  results.data.datasets.forEach(d => {
    d.backgroundColor = color.pop()
  });

  new Chart(document.getElementById(id.canvasId), {
    type: 'bar',
    options: {
      aspectRatio: 1,
      responsive: true,
      tooltips: {
        mode: 'label',
        itemSort: (a, b) => b.datasetIndex - a.datasetIndex,
      },
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [{
          stacked: true,
          ticks: {
            fontSize: 10,
            min: 0,
            callback: v => v + ' tons CO2'
          }
        }]
      }
    },
    data: results.data,
  })
}

//
// Polestar Life cycle data
//
function plotBitcoin(elmt, url, url2, results, results2) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('Polestar:', url);
  insertSourceAndLink(results, id, url);
  insertSourceAndLink(results2, id, url2);

  let datasets = [results.data.datasets.pop(), results2.data.datasets.pop()];
  const leftColor = 'rgba(140,40,40,0.9)';
  const leftColorSoft = 'rgba(140,40,40,0.1)';
  const rightColor = 'rgba(40,140,40,0.9)';
  const rightColorSoft = 'rgba(40,140,40,0.1)';
  datasets[0].borderColor = leftColor;
  datasets[0].backgroundColor = leftColorSoft;
  datasets[0].yAxisID = 'L'
  datasets[1].borderColor = rightColor;
  datasets[1].backgroundColor = rightColorSoft;
  datasets[1].yAxisID = 'R';

  new Chart(document.getElementById(id.canvasId), {
    type: 'line',
    data: {
      datasets: datasets
    },
    options: {
      scales: {
        yAxes: [{
          id: 'L',
          position: 'left',
          ticks: {
            min: 0,
            fontColor: leftColor
          },
          gridLines: {
            color: leftColorSoft
          }
        }, {
          id: 'R',
          position: 'right',
          ticks: {
            min: 0,
            fontColor: rightColor
          },
          gridLines: {
            color: rightColorSoft
          }
        }],
        xAxes: [{
          type: 'time',
          time: {
            unit: 'year',
            displayFormats: {
              year: 'YYYY'
            }
          }
        }]
      }
    }
  });
}



//
// Global E Waste
//
function plotGlobalEwaste(elmt, results, url) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('GlobalEwaste:', url, results.data.datasets.length);
  insertSourceAndLink(results, id, url);

  let color = colorArrayToAlpha(mkColorArray(results.data.datasets.length), 0.8);

  // Add colors to the datasets
  results.data.datasets.forEach(d => {
    d.backgroundColor = color.pop();
    d.borderWidth = 0;
  });

  new Chart(document.getElementById(id.canvasId), {
    type: 'bar',
    options: {
      aspectRatio: 1,
      tooltips: {
        callbacks: {
          label: (tooltipItem) => tooltipItem.value + ' kg per capita'
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontSize: 10,
            min: 0,
            callback: v => v + ' kg/capita'
          }
        }]
      }
    },
    data: results.data,
  });
}

//
// Plastic Waste
//
function plotPlasticWaste(elmt, results, url) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('Plastic waste:', url, results.data.datasets.length);
  insertSourceAndLink(results, id, url);
  console.log(id.canvasId);

  let n = 3;
  let color = mkColorArray(n);

  results.data.datasets[0].backgroundColor = color[Math.floor(Math.random() * n)];

  new Chart(document.getElementById(id.canvasId), {
    type: 'horizontalBar',
    options: {
      aspectRatio: 1,
      scales: {
        xAxes: [{
          ticks: {
            callback: v => v + ' kg'
          }
        }]
      }
    },
    data: {
      labels: results.data.labels,
      datasets: [
        results.data.datasets[0]
      ]
    }
  });
}

//
// Irena Cost of Renewable Generation
//
function plotIrena(elmt, results, url) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('Renewables:', url, results.data.datasets.length);
  insertSourceAndLink(results, id, url);

  let color = mkColorArray(results.data.datasets.length);

  // add padding to labels
  results.data.fuels.unshift('');
  results.data.labels = results.data.fuels;
  // add padding to datasets
  results.data.datasets.forEach(d => {
    d.data.unshift(0);
  });
  // Add colors to the datasets
  results.data.datasets.forEach(d => {
    d.backgroundColor = color.pop();
    d.backgroundColor = (d.label == 2010) ? colorToAlpha(d.backgroundColor, 0.3) : d.backgroundColor;
    d.borderWidth = 0;
  });
  results.data.datasets.push({
    label: 'Fossil fuels, lower bound',
    type: 'line',
    pointRadius: 0,
    backgroundColor: 'white',
    borderDash: [5, 5],
    data: [0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05]
  });
  results.data.datasets.push({
    label: 'Fossil fuels, upper bound',
    type: 'line',
    pointRadius: 0,
    borderDash: [5, 5],
    data: [0.177, 0.177, 0.177, 0.177, 0.177, 0.177, 0.177, 0.177, 0.177],
  });

  let myChart = new Chart(document.getElementById(id.canvasId), {
    type: 'bar',
    options: {
      aspectRatio: 0.8,
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            min: 'Biomass',
            max: 'Wind onshore',
          }
        }],
        yAxes: [{
          ticks: {
            fontSize: 10,
            min: 0,
            callback: v => v + ' $/kWh'
          }
        }]
      }
    },
    data: results.data,
  });
}

//
// Plot Spain Electricity Consumption last 10 years
//
function plotSpainElectricity(elmt, json, urls, yUnit = '') {
  let id = insertAccordionAndCanvas(elmt, false);
  let cSolid = mkColorArray(json.length);
  let cAlpha = colorArrayToAlpha(cSolid, 0.3);
  let c2020 = cSolid[0];
  insertSourceAndLink(json[0], id, urls);
  // Build the dataset
  let datasets = [];
  while (json.length) {
    let results = json.pop();
    // Just plot the days since start of year until end of current month
    let d = results.data.slice(1, parseInt(moment().endOf('month').format('DDD')));
    let year = results.year;
    datasets.push({
      label: year,
      borderColor: year == 2020 ? c2020 : cAlpha.pop(),
      backgroundColor: year == 2020 ? c2020 : cSolid.pop(),
      showLine: true,
      fill: false,
      data: d
    });
  }
  new Chart(document.getElementById(id.canvasId), {
    type: 'line',
    data: {
      datasets: datasets
    },
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
}

//
// Daily CO2 per year
//
function plotDailyCO2(elmt, url, results) {
  console.log("DailyCO2:", url, results.data.length)
  let id = insertAccordionAndCanvas(elmt, false);
  let cSolid = mkColorArray(results.data.length);
  let cAlpha = colorArrayToAlpha(cSolid, 0.6);
  insertSourceAndLink(results, id, url);
  // Build the datasets, one per year
  let datasets = [];
  while (results.data.length) {
    let x = results.data.shift();
    let c = cAlpha.pop();
    datasets.push({
      label: x.year,
      borderColor: c,//x.year == 2020 ? cS : cA,
      backgroundColor: c,
      showLine: true,
      fill: false,
      data: x.data.map(d => ({ t: '2000-' + d.t, y: d.y }))
    });
  }
  new Chart(document.getElementById(id.canvasId), {
    type: 'line',
    data: {
      datasets: datasets
    },
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
            displayFormats: {
              month: 'MMM'
            }
          }
        }]
      },
      tooltips: {
        mode: 'index',
        callbacks: {
          title: (tooltip, data) => {
            if (tooltip[0].datasetIndex === 0) {
              let diff = tooltip[0].value - tooltip[1].value;
              let chg = Math.floor(1000 * diff / tooltip[1].value) / 10;
              return [
                moment(tooltip[0].xLabel, 'YYYY-MM-DD').format('MMMM D'),
                "2021 compared to " +
                data.datasets[tooltip[1].datasetIndex].label +
                ": " + (chg > 0 ? '+' : '') + chg + "%"
              ]
            }
            return moment(tooltip[0].xLabel, 'YYYY-MM-DD').format('MMMM D')
          }
        }
      }
    }
  });
}

//
// Three Corona charts side-by-side
//
function plotCoronaDeaths3(elmt, json) {
  function makeChart(elementId, datasets) {
    return new Chart(document.getElementById(elementId), {
      type: 'bar',
      data: {
        datasets: datasets
      },
      options: {
        aspectRatio: 1.3,
        tooltips: {
          mode: 'index',
          callbacks: {
            title: (tooltip) => moment(tooltip[0].xLabel, 'YYYY-MM-DD').format('MMMM D, YYYY'),
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
              unit: 'month',
              displayFormats: {
                month: 'MMM'
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
          }]
        }
      }
    });
  }
  console.log('Covid, countries:', json.data.length);
  //insertSourceAndLink(results, elementSource, url);
  let c = mkColorArray(2);
  let c0 = c[0];
  //let ch = makeChart(elmt.pop());
  json.data.forEach(x => {
    if (!elmt.length) return;
    // Push the line chart of smoothed daily change
    makeChart(elmt.pop(), [{
      yAxisID: 'L',
      type: 'line',
      label: x.country + ': ' + x.total,
      categoryPercentage: 1,
      fill: false,
      borderColor: c0,
      backgroundColor: c0,
      tooltipText: '7day average: ',
      data: x.data,
    }]);
  });
}

function plotCoronaDeathsMulti(elmt, results, url, deathsPerMillion = true) {
  console.log("Corona deaths global:", url, results.data.length)
  let id = insertAccordionAndCanvas(elmt, false);
  insertSourceAndLink(results, id, url);
  let c = colorArrayToAlpha(mkColorArray(results.data.length), 0.6);
  // Sort regions in descending order so that legend looks nice next to graphs
  results.data.sort((b, a) =>
    a.data[a.data.length - 1].y / a.population - b.data[b.data.length - 1].y / b.population
  );
  let datasets = [];
  results.data.forEach(x => {
    color = c.pop();
    let country = x.country;
    let d = x.data;
    if (deathsPerMillion) {
      d = x.data.map(xd => ({ t: xd.t, y: Math.trunc(1000 * xd.y / x.population) / 1000 }));
    }
    datasets.push({
      label: country.replace("Northern", "North"),
      fill: false,
      borderColor: color,
      backgroundColor: color,
      tooltipText: '7 day average: ',
      data: d//x.data,
    });
  });
  new Chart(document.getElementById(id.canvasId), {
    type: 'line',
    data: { datasets: datasets },
    options: {
      aspectRatio: 1.3,
      tooltips: {
        callbacks: {
          title: (tooltip) => moment(tooltip[0].xLabel, 'YYYY-MM-DD').format('MMMM D, YYYY')
        }
      },
      legend: {
        position: 'right'
      },
      scales: {
        xAxes: [{
          offset: true,
          type: 'time',
          time: {
            unit: 'month',
            displayFormats: {
              month: 'MMM'
            }
          }
        }],
        yAxes: [{
          ticks: {
            min: 0
          }
        }]
      }
    }
  });
}

//
// Corona cases by capita
//
function plotCoronaDeathsByCapita(elmt, url, results) {
  console.log("Corona deaths per capita:", url, results.data.length)
  let id = insertAccordionAndCanvas(elmt);
  insertSourceAndLink(results, id, url);

  new Chart(document.getElementById(id.canvasId), {
    type: 'horizontalBar',
    data: {
      labels: results.data.countries,
      datasets: [{
        backgroundColor: '#c8745e',
        categoryPercentage: 0.5,
        data: results.data.percapita,
        data2: results.data.total
      }]
    },
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
            let n = data.datasets[tooltipItem.datasetIndex].data2[tooltipItem.index];
            return [tooltipItem.xLabel + ' deaths per million', n + '  total deaths'];
          }
        }
      },
    }
  });
}

//
// CO2 vs GDP
//
function plotCO2vsGDP(elmt) {
  let id = insertAccordionAndCanvas(elmt, true);
  function makeBubbleChart(elmt, mobile = false, datasets) {
    return new Chart(document.getElementById(elmt), {
      type: 'bubble',
      data: {
        datasets: datasets
      },
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
  let datasets = [];
  let mdatasets = [];

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
    datasets.push({
      data: [item],
      label: item.l,
      backgroundColor: item.col.replace('rgb', 'rgba').replace(')', ',0.7)'),
      borderColor: item.col.replace('rgb', 'rgba').replace(')', ',1)')
    })
    mdatasets.push({
      data: [item],
      label: item.l,
      backgroundColor: item.col.replace('rgb', 'rgba').replace(')', ',0.7)'),
      borderColor: item.col.replace('rgb', 'rgba').replace(')', ',1)')
    })
  });
  makeBubbleChart(id.canvasId, false, datasets);
  makeBubbleChart(id.canvasIdMobile, true, mdatasets);
}

//
// Oxfam/SEI 2020 report
//
function plotOxfam(elmt, url, results) {
  console.log('Oxfam:', results.data.length);
  let id = insertAccordionAndCanvas(elmt);
  insertSourceAndLink(results, id, url);
  let c = mkColorArray(results.data[0].percentages.length);
  new Chart(document.getElementById(id.canvasId), {
    type: 'doughnut',
    data: {
      datasets: [{
        label: results.data[0].legend,
        data: results.data[0].percentages,
        backgroundColor: c,
        borderColor: c
      }]
    },
    plugins: [ChartDataLabels],
    options: {
      plugins: {
        datalabels: {
          color: '#fff',
          font: {
            size: 12
          },
          labels: {
            title: {
              textAlign: 'center', // important for multiline labels
              align: 'center',
              formatter: (value, ctx) => {
                let str = ctx.dataset.label[ctx.dataIndex];// + "\n" + value + "%";
                if (str.includes("Poorest")) {
                  return str.replace(" ", "\n")
                }
                return str
              }
            },
          }
        }
      },
      tooltips: {
        enabled: true,
        callbacks: {
          title: (i, d) => {
            return d.datasets[i[0].datasetIndex].label[i[0].index]
          },
          label: (i, d) => {
            let data = d.datasets[i.datasetIndex].data[i.index];
            return "Share of CO2 emissions: " + data + "%"
          }
        }
      },
      title: {
        text: 'CO2 Emissions 1990-2015 by income group',
        display: true,
        position: 'bottom',
      },
      legend: {
        display: false
      }
    }
  });
}

//
// World Resources Institute 2016
//
function plotWri(elmt, url, results) {
  console.log('World Resource Institute:', results.data.length);
  let id = insertAccordionAndCanvas(elmt);
  insertSourceAndLink(results, id, url);
  let c = mkColorArray(results.data[0].values.length);
  new Chart(document.getElementById(id.canvasId), {
    type: 'doughnut',
    data: {
      datasets: [{
        label: results.data[0].legend,
        data: results.data[0].values,
        backgroundColor: c,
        borderColor: c
      }]
    },
    plugins: [ChartDataLabels],
    options: {
      plugins: {
        datalabels: {
          color: '#fff',
          font: {
            size: 10
          },
          labels: {
            title: {
              textAlign: 'center', // important for multiline labels
              align: 'center',
              formatter: (value, ctx) => {
                let str = ctx.dataset.label[ctx.dataIndex] + "\n" + value + "%";
                // This is pretty awful, but we need to split some text depending on content and position
                if (str.includes("Buildings")) {
                  str = "\n \n " + str
                }
                if (str.includes("Energy:")) {
                  return str.replace(": ", ":\n")
                }
                if (str.includes("Land Use Change")) {
                  return str.split(", ")
                }
                if (str.includes("Industrial Processes")) {
                  return str.replace("Industrial ", "Industrial\n")
                }
                if (str.includes("Waste")) {
                  return str + "\n \n \n "
                }
                return str
              }
            },
          }
        }
      },
      tooltips: {
        enabled: true,
        callbacks: {
          title: (i, d) => {
            return d.datasets[i[0].datasetIndex].label[i[0].index]
          },
          label: (i, d) => {
            let data = d.datasets[i.datasetIndex].data[i.index];
            return "Share of CO2 emissions: " + data + "%"
          }
        }
      },
      title: {
        text: 'GHG Emitted 2016: ' + results.data[0].total + ' Gt CO2 equivalents',
        display: true,
        position: 'bottom',
      },
      legend: {
        display: false
      }
    }
  });
}

//
// Circularity
//
function plotCircularity(elmt, url, results) {
  console.log('Circularity:', results.data.length);
  let id = insertAccordionAndCanvas(elmt);
  insertSourceAndLink(results, id, url);
  let c = mkColorArray(results.data[0].data[0].values.length);
  let tot = results.data[0].data[0].total;
  new Chart(document.getElementById(id.canvasId), {
    type: 'pie',
    data: {
      datasets: [{
        label: results.data[0].data[0].legend,
        data: results.data[0].data[0].values,
        backgroundColor: c,
        borderColor: c
      }]
    },
    plugins: [ChartDataLabels],
    options: {
      tooltips: {
        enabled: false
      },
      title: {
        text: 'Resources consumed: ' + tot + ' Gt (billion tons)',
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
}

//
// Glacier length
//
function plotGlaciers(elmt, baseUrl, results) {
  console.log('Glaciers:', baseUrl, results.length);
  let id = insertAccordionAndCanvas(elmt, true);
  let colors = mkColorArray(results.length);
  let datasets = [];
  results.forEach(d => {
    insertSourceAndLink(results, id, baseUrl + d.glacier);
    let col = colors.pop();
    datasets.push({
      data: d.data,
      fill: false,
      borderColor: col,
      backgroundColor: col,
      showLine: true,
      label: d.glacier
    });
  })
  makeMultiLineChart(id.canvasId, { min: 1900, max: 2020 }, { callback: v => v ? v + 'm' : v }, true, 'right', 'linear', 2, datasets);
  makeMultiLineChart(id.canvasIdMobile, { min: 1900, max: 2020 }, { callback: v => v ? v + 'm' : v }, false, 'top', 'linear', 1, datasets);
}

// 
// Plot scatter data. Used by several sections in HTML
//
function plotScatter(elmt, urls, res, labels, xTicks = {}, yTicks = {}, xAxesType = 'linear', parser = 'YYYY-MM-DD') {
  let id = insertAccordionAndCanvas(elmt);
  if ((urls.length !== res.length) || (labels.length !== res.length)) return;
  let c = mkColorArray(urls.length);
  // Build datasets
  let datasets = [];
  while (res.length) {
    let url = urls.shift();
    let lbl = labels.shift();
    let results = res.shift();
    insertSourceAndLink(results, id, url);
    let col = c.pop();
    datasets.push({
      data: results.data,
      fill: false,
      borderColor: col,
      backgroundColor: col,
      showLine: true,
      label: lbl
    });
  }
  new Chart(document.getElementById(id.canvasId), {
    type: 'scatter',
    data: {
      labels: labels,
      datasets: datasets
    },
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
}


function makeStackedLineChart(canvas, xTicks, yTicks, datasets = []) {
  return new Chart(document.getElementById(canvas), {
    type: 'line',
    data: {
      datasets: datasets
    },
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
function plotEmissionsByRegion(elmt, url, results) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('CO2 Emissions by region:', results.data.length);
  insertSourceAndLink(results, id, url);
  let c = mkColorArray(results.data.length, '#0076e4');
  c = colorArrayMix(c);
  let datasets = [];
  results.data.forEach(d => {
    datasets.push({
      label: d.country,
      fill: true,
      borderColor: c[0],
      backgroundColor: c[0],
      data: d.data
    });
    c.shift();
  })
  makeStackedLineChart(id.canvasId,
    { min: 1959, max: 2019, callback: x => x === 1960 ? null : x },
    { callback: v => v + ' Gt' },
    datasets
  );
}

//
// Norway Annual GHG Emissions
//
function plotEmissionsNorway(elmt, url, results) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('Norway:', results.data.length);
  insertSourceAndLink(results, id, url);
  let c = mkColorArray(results.data.length, '#0076e4');
  let datasets = [];
  // Plot all datasets except 0 which is the Total
  results.data.shift();
  results.data.forEach(d => {
    datasets.push({
      data: d.values,//.map(x => ({ x: x.t, /* + "-12-31"*/ y: x.y })),
      backgroundColor: c[0],
      borderColor: c[0],
      label: d.name
    })
    c.shift();
  });
  makeStackedLineChart(id.canvasId,
    { max: 2019 },
    { callback: (value) => Math.trunc(value / 1000) + " Mt" },
    datasets
  );
}

//
// Arctic Ice Extent
//
function plotArcticIce(elmt, url, results) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('ICE NSIDC:', results.data.length);
  insertSourceAndLink(results, id, url);
  let cSolid = mkColorArray(Math.trunc(1.5 * results.data.length / 12));//yrs.length);
  let cAlpha = colorArrayToAlpha(cSolid, 0.1);
  let datasets = [];
  for (let year = 1979; year <= parseInt(currentYear); year++) {
    // Extract data for a particular year
    let tmp = results.data.filter(x => x.year === year);
    datasets.push({
      data: tmp.map(x => x.extent),
      label: year,
      fill: false,
      borderColor: year == currentYear ? cSolid[0] : cAlpha[0],
      backgroundColor: cAlpha[0],
      pointRadius: year == currentYear ? 4 : 0,
    });
    cSolid.shift();
    cAlpha.shift();
  }
  new Chart(document.getElementById(id.canvasId), {
    type: 'line',
    data: {
      datasets: datasets,
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    options: {
      tooltips: {
        enabled: false
      },
      legend: {
        position: 'top'
      }
    }
  });
}

//
// World Population
//
function plotWorldPopulation(elmt, url, results) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('Population:', results.data.length);
  insertSourceAndLink(results, id, url);
  let c = mkColorArray(results.data.length);
  let datasets = [];
  while (results.data.length) {
    let x = results.data.pop();
    x.region = x.region.replace('Latin America and the Caribbean', 'S America');
    x.region = x.region.replace('Northern America', 'N America');
    datasets.push({
      label: x.region,
      data: x.data,
      borderColor: c[0],
      backgroundColor: c[0],
      fill: false
    });
    c.shift();
  }
  makeMultiLineChart(id.canvasId, {}, { callback: v => v / 1000 + ' bn' }, true, 'right', 'linear', 1, datasets);
}


function makeMultiLineChart(canvas, xTicks, yTicks, showLegend, pos, category, aspect, datasets = []) {
  return new Chart(document.getElementById(canvas), {
    type: 'line',
    data: {
      datasets: datasets
    },
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
function plotEia(elmt, url, results, maxYear = 2020) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('EIA:', results.series.length, url);
  insertSourceAndLink(results, id, url);
  let c = mkColorArray(results.series.length - 5);
  let datasets = [];
  results.series.forEach(d => {
    // Don't plot these...too much detail
    if (['EU28', 'EU27', 'USA', 'Japan', 'Russia', 'India'].indexOf(d.region) !== -1) {
      return;
    }
    let col = c.pop();
    datasets.push({
      label: d.region,
      data: d.data,
      borderColor: col,
      backgroundColor: col,
      fill: false
    });
  })
  makeMultiLineChart(id.canvasId, { min: 1980, max: maxYear }, { callback: v => v / 1000 }, true, 'top', 'linear', 1, datasets);
}

//
// Emissions by fuel-type
//
function plotEmissionsByFuelType(elmt, url, results) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('Emissions by type:', results.data.length);
  insertSourceAndLink(results, id, url);
  let c = mkColorArray(results.data.length - 1);
  let datasets = [];
  results.data.forEach(d => {
    if (d.fuel === 'Per Capita') return;
    let col = c.pop();
    datasets.push({
      label: d.fuel,
      fill: false,
      borderColor: col,
      backgroundColor: col,
      data: d.data
    });
  })
  makeMultiLineChart(id.canvasId, {
    min: 1959,
    max: 2020,
    callback: x => x === 1960 ? null : x
  }, {
    callback: v => (v / 1000) + ' Gt'
  }, true, 'top', 'linear', 1, datasets);
}

//
// Ozone Hole Southern Hemisphere
//
function plotOzoneHole(elmt, url, result) {
  plotScatter(elmt,
    [url],
    [result],
    ["Ozone hole in million sq km"],
    { max: 2020, autoSkip: true, maxTicksLimit: 8 },
    {}
  );
}

//
// Global Temperature Anomaly
//
function plotGlobalTemp(elmt, urls, results) {
  plotScatter(elmt, urls, results,
    ["NASA dataset", "HadCRUT dataset", "UAH dataset"],
    { max: 2020, autoSkip: true, maxTicksLimit: 8 },
    { callback: value => Math.round(value * 10) / 10 + "\u00b0" + "C" }
  );
}

//
// Svalbard - Arctic Temperature Development
//
function plotSvalbardTemp(elmt, url, result) {
  plotScatter(elmt,
    [url],
    [result],
    ["Svalbard Airport annual mean temperature"],
    { min: 1900, max: 2020, autoSkip: true, maxTicksLimit: 8 },
    { callback: (value) => Math.round(value * 10) / 10 + "\u00b0" + "C" }
  );
}

//
// Brazil Forest Fires
//
function plotBrazilFires(elmt, url, results) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('Brazil:', results.data.length);
  insertSourceAndLink(results, id, url);
  let c = colorArrayToAlpha(mkColorArray(Math.trunc(results.data.length * 1.5)), 0.4);
  let datasets = [];
  results.data.forEach(x => {
    if (x.year == "Maximum" || x.year == "Minimum" || x.year == "Average") return;
    let col = c.pop();
    datasets.push({
      data: x.data,
      label: x.year,
      pointRadius: x.year == currentYear ? 4 : 0,
      borderWidth: x.year == currentYear ? 2 : 1,
      borderColor: col,
      backgroundColor: col,
      fill: false
    });
  });
  new Chart(document.getElementById(id.canvasId), {
    type: 'line',
    data: {
      datasets: datasets,
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    options: {
      tooltips: {
        enabled: false
      },
      legend: {
        position: 'top'
      }
    }
  });
}

//
// Global Sea Level Rise
//
function plotGlobalSeaLevel(elmt, urls, results) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('Sealevel:', results[1].data.length);
  insertSourceAndLink(results[1], id, urls);
  let colors = colorArrayToAlpha(mkColorArray(2), 0.5);
  new Chart(document.getElementById(id.canvasId), {
    type: 'line',
    options: {
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: 'year',
            displayFormats: {
              year: 'YYYY'
            }
          },
          ticks: {
            maxTicksLimit: 15,
            min: "1880-01-01",
          }
        }]
      }
    },
    data: {
      datasets: [{
        label: "Satellite measurements",
        data: results[1].data.map(d => ({ t: d.t, y: d.y + 50 })),
        showLine: true,
        borderColor: colors[0],
        borderWidth: 1,
        fill: false
      }, {
        label: "Land-based measurements",
        data: results[0].data.map(d => ({ t: d.x.toString() + "-06-30", y: d.y })),
        showLine: true,
        borderColor: colors[1],
        borderWidth: 1,
        fill: false
      }]
    }
  });
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

function plotBothCCS(elmt, url, results) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('CCS:', results.data.length);
  insertSourceAndLink(results, id, url);
  // remove any null projects, then sort it
  let d = results.data.filter(x => x.project != null).sort((a, b) => b.capacity - a.capacity);
  let colors = mkColorArray(2);
  let lineColor = d.map(x => {
    return x.type === 'EOR' ? colors[1] : (x.type == 'Storage' ? colors[0] : '#777');
  });
  new Chart(document.getElementById(id.canvasId), {
    type: 'horizontalBar',
    data: {
      labels: d.map(x => x.project + ", " + x.country),
      datasets: [{
        data: d.map(x => x.capacity),
        backgroundColor: lineColor,
        borderColor: lineColor,
        categoryPercentage: 0.5,
      }]
    },
    plugins: [],
    options: {
      scales: {
        xAxes: [{
          ticks: { callback: v => v + 'Mt' }
        }]
      },
      tooltips: {
        axis: 'y',
        callbacks: {
          label: (tooltipItem) => tooltipItem.value + ' Mt CO2 captured'
        }
      },
      legend: {
        display: false
      }
    }
  });
}

//
// Safety in electricity generation
//
function plotSafety(elmt) {
  let id = insertAccordionAndCanvas(elmt);
  insertSourceAndLink(redisMortalityElectricity, id, 'https://api.dashboard.eco/mortality-electricity');
  insertSourceAndLink(redisMortalityElectricitySovacool, id, 'https://api.dashboard.eco/mortality-electricity-sovacool');
  insertSourceAndLink(redisMortalityElectricityMarkandya, id, 'https://api.dashboard.eco/mortality-electricity-markandya');
  let d = redisMortalityElectricity.data;
  console.log('Safety electricity:', d.length);
  let colors = mkColorArray(2);
  let lineColor = d.map(x => x.deaths > 1 ? colors[0] : colors[1]);
  new Chart(document.getElementById(id.canvasId), {
    type: 'horizontalBar',
    data: {
      labels: d.map(x => x.resource),
      datasets: [{
        data: d.map(x => x.deaths),
        backgroundColor: lineColor,
        borderColor: lineColor,
        minBarLength: 3,
        categoryPercentage: 0.5,
      }]
    },
    plugins: [],
    options: {
      tooltips: {
        axis: 'y'
      },
      legend: {
        display: false
      },
      title: {
        text: 'Deaths per TWh',
        display: true,
        position: 'bottom'
      }
    }
  });
}