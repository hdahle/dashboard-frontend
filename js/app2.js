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
//Chart.defaults.global.animation.onComplete = (e) => onCompleteCallback(e.chart);
Chart.defaults.global.plugins.colorschemes.scheme = 'tableau.Tableau20';
Chart.defaults.global.plugins.colorschemes.fillAlpha = 1;
Chart.plugins.unregister(ChartDataLabels);

const currentYear = moment().format('YYYY');

//
// OECD Meat Consumption 2020
//
function plotOecdMeat(elmt, url, results) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('OECD Meat:', url, results.data.length);
  insertSourceAndLink(results, id, url);
  // We only want the World dataset
  let country = results.data.find(x => x.country === "World");
  new Chart(document.getElementById(id.canvasId), {
    type: 'line',
    options: {
      tooltips: {
        itemSort: (a, b) => b.datasetIndex - a.datasetIndex,
        callbacks: {
          label: (ttItem, data) =>
            data.datasets[ttItem.datasetIndex].label + ': ' + Math.round(ttItem.value * 10) / 10 + ' kg'
        }
      },
      scales: {
        xAxes: [{
          type: 'linear',
          ticks: { max: 2019, min: 1991 }
        }],
        yAxes: [{
          stacked: true,
          ticks: {
            fontSize: 10,
            callback: v => (v) ? v + ' kg' : null
          }
        }]
      }
    },
    data: {
      datasets: country.datasets
    }
  });
}

//
// OECD Meat Consumption 2020
//
function plotOecdMeatSorted2019(elmt, url, results, minX) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('OECD Meat Sorted:', url, results.data.datasets.length);
  insertSourceAndLink(results, id, url);

  new Chart(document.getElementById(id.canvasId), {
    type: 'horizontalBar',
    data: results.data,
    options: {
      aspectRatio: 0.75,
      tooltips: {
        itemSort: (a, b) => b.datasetIndex - a.datasetIndex,
        callbacks: {
          label: (ttItem, data) => data.datasets[ttItem.datasetIndex].label + ': ' + Math.round(ttItem.value * 10) / 10 + ' kg',
          title: (ttItem) => {
            let v = 0;
            ttItem.forEach(t => v += parseInt(t.value * 10, 10));
            return ttItem[0].label + ': ' + v / 10 + ' kg';
          }
        }
      },
      scales: {
        yAxes: [{
          stacked: true,
          ticks: {
            fontSize: 8
          }
        }],
        xAxes: [{
          stacked: true,
          ticks: {
            callback: v => {
              if (v < 0) return null;
              if (v === 0) return v;
              else return v + ' kg'
            },
            min: (minX === undefined) ? 0 : minX
          }
        }]
      }
    }
  });
}


//
// EIA Cost of Electricity Generation USA 2025
//
function plotEiaLcoe(elmt, results, url) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('EIA LCOE:', url, results.data.datasets.length);
  insertSourceAndLink(results, id, url);
  new Chart(document.getElementById(id.canvasId), {
    type: 'bar',
    options: {
      legend: {
        display: false
      },
      tooltips: {
        callbacks: {
          label: (ttItem) => Math.trunc(ttItem.value) / 1000 + ' $/kWh'
        }
      },
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
            callback: v => (v) ? v / 1000 + ' $/kWh' : null
          }
        }]
      }
    },
    data: results.data,
  });
}

//
// Antibiotics
//
function plotAntibiotics(elmt, url, results) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('Antibiotics:', url);
  insertSourceAndLink(results, id, url);
  results.data.datasets.pop(); // remove the Totals dataset
  new Chart(document.getElementById(id.canvasId), {
    type: 'horizontalBar',
    options: {
      aspectRatio: 0.8,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [{
          stacked: true,
          ticks: {
            fontSize: 10
          }
        }]
      }
    },
    data: results.data
  });
}


//
// Polestar Life cycle data
//
function plotPolestar(elmt, url, results) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('Polestar:', url);
  insertSourceAndLink(results, id, url);
  new Chart(document.getElementById(id.canvasId), {
    type: 'bar',
    options: {
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
// Bitcoin
//
function plotBitcoin(elmt, url, url2, results, results2) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('Bitcoin:', url);
  insertSourceAndLink(results, id, url);
  insertSourceAndLink(results2, id, url2);

  let datasets = [results.data.datasets.pop(), results2.data.datasets.pop()];
  datasets[0].yAxisID = 'L';
  datasets[0].showLine = false;
  datasets[0].pointRadius = 1;
  datasets[1].yAxisID = 'R';
  datasets[1].showLine = false;
  datasets[1].pointRadius = 1;

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
            callback: v => v + 'TWh'
          },
        }, {
          id: 'R',
          position: 'right',
          ticks: {
            callback: v => '$' + v
          },
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
  new Chart(document.getElementById(id.canvasId), {
    type: 'bar',
    options: {
      tooltips: {
        callbacks: {
          label: (ttItem) => ttItem.value + ' kg per capita'
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
  new Chart(document.getElementById(id.canvasId), {
    type: 'horizontalBar',
    options: {
      scales: {
        xAxes: [{
          ticks: {
            callback: v => v + ' kg'
          }
        }]
      }
    },
    data: results.data
  });
}

//
// Irena Cost of Renewable Generation
//
function plotIrena(elmt, results, url) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('Renewables:', url, results.data.datasets.length);
  insertSourceAndLink(results, id, url);
  new Chart(document.getElementById(id.canvasId), {
    type: 'bar',
    options: {
      aspectRatio: 0.8,
      tooltips: {
        mode: 'label',
        callbacks: {
          label: (ttItem, d) => {
            const year =  d.datasets[ttItem.datasetIndex].label;
            if (ttItem.datasetIndex > 1) return null;
            return year + ': ' +  ttItem.value + ' $/kWh'
          }
        }
      },
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
            callback: v => v ? v + ' $/kWh' : null
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
  // Build the dataset
  let datasets = [];
  while (json.length) {
    let results = json.pop();
    // Just plot the days since start of year until end of current month
    let d = results.data.slice(1, parseInt(moment().endOf('month').format('DDD')));
    let year = results.year;
    datasets.push({
      label: year,
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
  insertSourceAndLink(results, id, url);
  // Build the datasets, one per year
  let datasets = [];
  while (results.data.length) {
    let x = results.data.shift();
    datasets.push({
      label: x.year,
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
      plugins:{
        colorschemes: {
          scheme : 'tableau.ClassicOrangeBlue13',
        }
      },
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
            label: (ttItem, data) => {
              let t = data.datasets[ttItem.datasetIndex].tooltipText;
              t = (t === undefined) || (t === null) ? '' : t;
              t0 = Array.isArray(t) && t.length > 0 ? t[0] : t;
              t1 = Array.isArray(t) && t.length > 1 ? t[1] : '';
              return t0 + Math.round(ttItem.yLabel) + t1;
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
      tooltipText: '7day average: ',
      data: x.data,
    }]);
  });
}

function plotCoronaDeathsMulti(elmt, results, url, deathsPerMillion = true) {
  console.log("Corona deaths global:", url, results.data.length)
  let id = insertAccordionAndCanvas(elmt, false);
  insertSourceAndLink(results, id, url);
  // Sort regions in descending order so that legend looks nice next to graphs
  results.data.sort((b, a) =>
    a.data[a.data.length - 1].y / a.population - b.data[b.data.length - 1].y / b.population
  );
  let datasets = [];
  results.data.forEach(x => {
    let country = x.country;
    let d = x.data;
    if (deathsPerMillion) {
      d = x.data.map(xd => ({ t: xd.t, y: Math.trunc(1000 * xd.y / x.population) / 1000 }));
    }
    datasets.push({
      label: country.replace("Northern", "North"),
      fill: false,
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
          label: (ttItem, data) => {
            let n = data.datasets[ttItem.datasetIndex].data2[ttItem.index];
            return [Math.trunc(ttItem.xLabel) + ' deaths per million', n + '  total deaths'];
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
            title: (ttItem, d) => {
              return d.datasets[ttItem[0].datasetIndex].label
            },
            label: (ttItem, d) => {
              let data = d.datasets[ttItem.datasetIndex].data[0];
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
  //let colors = mkColorArray(data.length);
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
    //col: colors.pop() //x.color
  })).forEach(item => {
    datasets.push({
      data: [item],
      label: item.l,
    })
    mdatasets.push({
      data: [item],
      label: item.l,
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
  new Chart(document.getElementById(id.canvasId), {
    type: 'doughnut',
    data: {
      datasets: [{
        label: results.data[0].legend,
        data: results.data[0].percentages,
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
          title: (i, d) => d.datasets[i[0].datasetIndex].label[i[0].index],
          label: (i, d) => "Share of CO2 emissions: " + d.datasets[i.datasetIndex].data[i.index] + "%"
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
  new Chart(document.getElementById(id.canvasId), {
    type: 'doughnut',
    data: {
      datasets: [{
        label: results.data[0].legend,
        data: results.data[0].values,
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
          title: (i, d) => d.datasets[i[0].datasetIndex].label[i[0].index],
          label: (i, d) => "Share of CO2 emissions: " + d.datasets[i.datasetIndex].data[i.index] + "%"
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
  let tot = results.data[0].data[0].total;
  new Chart(document.getElementById(id.canvasId), {
    type: 'pie',
    data: {
      datasets: [{
        label: results.data[0].data[0].legend,
        data: results.data[0].data[0].values,
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
  let datasets = [];
  results.forEach(d => {
    insertSourceAndLink(results, id, baseUrl + d.glacier);
    datasets.push({
      data: d.data,
      fill: false,
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
  // Build datasets
  let datasets = [];
  while (res.length) {
    let url = urls.shift();
    let lbl = labels.shift();
    let results = res.shift();
    insertSourceAndLink(results, id, url);
    datasets.push({
      data: results.data,
      fill: false,
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
          label: (ttItem) => {
            let x = ttItem.xLabel;
            if (moment(x, 'YYYY-MM-DD', true).isValid()) {
              x = moment(x, 'YYYY-MM-DD').format('MMM YYYY');
            }
            return x + ': ' + ttItem.yLabel;
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
  let datasets = [];
  results.data.forEach(d => {
    datasets.push({
      label: d.country,
      fill: true,
      data: d.data
    });
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
  let datasets = [];
  // Plot all datasets except 0 which is the Total
  results.data.shift();
  results.data.forEach(d => {
    datasets.push({
      data: d.values,//.map(x => ({ x: x.t, /* + "-12-31"*/ y: x.y })),
      label: d.name
    })
  });
  makeStackedLineChart(id.canvasId,
    { max: 2020 },
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
  let datasets = [];
  for (let year = 1979; year <= parseInt(currentYear); year++) {
    // Extract data for a particular year
    let tmp = results.data.filter(x => x.year === year);
    datasets.push({
      data: tmp.map(x => x.extent),
      label: year,
      fill: false,
      pointRadius: year == currentYear ? 4 : 0,
    });
  }
  new Chart(document.getElementById(id.canvasId), {
    type: 'line',
    data: {
      datasets: datasets,
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    options: {
      plugins:{
        colorschemes: {
          scheme : 'tableau.Blue20',
        }
      },
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
  let datasets = [];
  while (results.data.length) {
    let x = results.data.pop();
    x.region = x.region.replace('Latin America and the Caribbean', 'S America');
    x.region = x.region.replace('Northern America', 'N America');
    datasets.push({
      label: x.region,
      data: x.data,
      fill: false
    });
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
  let datasets = [];
  results.series.forEach(d => {
    // Don't plot these...too much detail
    if (['EU28', 'EU27', 'USA', 'Japan', 'Russia', 'India'].indexOf(d.region) !== -1) {
      return;
    }
    datasets.push({
      label: d.region,
      data: d.data,
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
  let datasets = [];
  results.data.forEach(d => {
    if (d.fuel === 'Per Capita') return;
    datasets.push({
      label: d.fuel,
      fill: false,
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
        fill: false
      }, {
        label: "Land-based measurements",
        data: results[0].data.map(d => ({ t: d.x.toString() + "-06-30", y: d.y })),
        showLine: true,
        fill: false
      }]
    }
  });
}

//
// CCS - Carbon Capture
//
function plotBothCCS(elmt, url, results) {
  let id = insertAccordionAndCanvas(elmt);
  console.log('CCS:', results.data.datasets.length);
  insertSourceAndLink(results, id, url);
  new Chart(document.getElementById(id.canvasId), {
    type: 'horizontalBar',
    data: results.data,
    plugins: [],
    options: {
      aspectRatio: 0.8,
      scales: {
        yAxes: [{
          ticks: {
            fontSize: 10
          }
        }],
        xAxes: [{
          ticks: { callback: v => v + ' Mt' }
        }]
      },
     legend: {
        display: false
      },
      title: {
        text: 'Million tons CO2 captured',
        display: true,
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
  let data = redisMortalityElectricity.data;
  console.log('Safety electricity:', data.datasets.length);

  data.datasets.forEach(dataset => {
    dataset.minBarLength = 3;
  });

  new Chart(document.getElementById(id.canvasId), {
    type: 'horizontalBar',
    data: data
  });
}