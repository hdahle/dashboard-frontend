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

Chart.defaults.global.defaultFontFamily = "'Roboto', sans-serif";
Chart.defaults.global.elements.point.radius = 0;
Chart.defaults.global.elements.line.borderWidth = 1;
Chart.defaults.global.animation.duration = 0;
Chart.defaults.global.plugins.colorschemes.fillAlpha = 0.8;
Chart.defaults.global.plugins.colorschemes.scheme = 'brewer.SetTwo8';

// 
// Atmospheric CO2
// 
function plotAtmosphericCO2(elementId, elementSource) {
  var myChart = new Chart(document.getElementById(elementId), {
    type: 'line',
    options: {
      legend: {
        display: false
      },
      aspectRatio: 1,
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: true,
            maxTicksLimit: 8
          },
          type: 'time'
        }]
      }
    }
  });
  let url = 'https://probably.one:4438/co2';
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('Atmospheric CO2 results', results);
      printSourceAndLink(results, elementSource, url);
      let values = results.data.map(x => ({
        x: x.date,
        y: x.interpolated
      }));
      myChart.data.datasets.push({
        data: values,
        fill: false,
        label: 'Mauna Loa, Hawaii'
      });
      myChart.update();
    })
    .catch(err => console.log(err));
}

//
// CO2 by region
//
function plotEmissionsByRegion(elementId, elementSource) {
  let url = 'https://probably.one:4438/annual-co-emissions-by-region';
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('CO2 Emissions by region results:', results);
      printSourceAndLink(results, elementSource, url);
      var myChart = new Chart(document.getElementById(elementId), {
        type: 'line',
        options: {
          aspectRatio: 1,
          tooltips: {
            intersect: false,
            mode: 'index'
          },
          legend: {
            position: 'right',
            reverse: true,
            labels: {
              boxWidth: 10,
              padding: 6
            },
          },
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'year'
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 8
              }
            }],
            yAxes: [{
              stacked: true,
              ticks: {
                callback: function (value, index, values) {
                  return value / 1000 + " Gt";
                }
              }
            }]
          }
        }
      });
      let regions = [
        'EU-28', 'Europe (other)', 'United States', 'Americas (other)',
        'China', 'India', 'Asia and Pacific (other)', 'Africa',
        'Middle East', 'International transport'
      ];
      let regionLabels = [
        'EU-28', 'Eur(rest)', 'USA', 'Americas',
        'China', 'India', 'AsiaPac', 'Africa',
        'Mid East', 'Transport'
      ];
      for (let i = 0; i < results.data.length; i++) {
        let idx = regions.indexOf(results.data[i].country);
        if (idx !== -1) {
          // region found, plot it
          let xy = results.data[i].data.map(d => {
            return { x: d.year + "-12-31", y: d.tonnes }
          });
          // console.log(results.data[i].country, xy[xy.length - 1], xy);
          myChart.data.datasets.push({
            data: xy.slice(-160),
            label: regionLabels[idx]
          });
          myChart.update();
        }
      }
    })
    .catch(err => console.log(err));
}

//
// Atmospheric CH4 Methane
//
function plotAtmosphericCH4(elementId, elementSource) {
  let url = 'https://probably.one:4438/ch4';
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('Atmospheric methane results:', results);
      printSourceAndLink(results, elementSource, url);
      var myChart = new Chart(document.getElementById(elementId), {
        type: 'line',
        options: {
          aspectRatio: 1,
          plugins: {
            colorschemes: {
              scheme: 'tableau.Tableau10',
              fillAlpha: 0.2
            }
          },
          legend: {
            display: false
          },
          tooltips: {
            intersect: false,
            mode: 'nearest'
          },
          scales: {
            xAxes: [{
              ticks: {
                autoSkip: true,
                maxTicksLimit: 8
              },
              type: 'time',
            }]
          }
        }
      });
      let dates = results.data.map(x => x.date);
      let values = results.data.map(x => x.average);
      myChart.data.datasets.push({
        label: "CH4 monthly",
        data: values
      });
      myChart.data.labels = dates;
      myChart.update();
    })
    .catch(err => console.log(err));
}

//
// Arctic Ice Extent
//
function plotArcticIce(elementId, elementSource) {
  let url = 'https://probably.one:4438/ice-nsidc';
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('ICE NSIDC Results:', results);
      printSourceAndLink(results, elementSource, url);
      var myChart = new Chart(document.getElementById(elementId), {
        type: 'line',
        options: {
          aspectRatio: 1,
          plugins: {
            colorschemes: {
              scheme: 'brewer.Spectral10'
            }
          },
          responsive: true,
          legend: {
            display: true,
            position: 'right',
            align: 'middle',
            reverse: true,
            labels: {
              boxWidth: 10,
              padding: 4
            },
          },
          tooltips: {
            enabled: false
          },
          scales: {
            xAxes: [{
              gridLines: {
                display: false
              }
            }],
            yAxes: [{
              stacked: false
            }]
          }
        }
      });
      myChart.data.labels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
      for (let year = 2019; year > 1978; year -= 5) {
        // Extract a subset of data for a particular year
        let tmp = results.data.filter(x => x.year === year);
        // Then create a table that only contains the datapoints
        let resval = tmp.map(x => x.extent);
        myChart.data.datasets.push({
          data: resval,
          label: year,
          fill: false
        });
        myChart.update();
      }
    })
    .catch(err => console.log(err));
}

//
// World Population
//
function plotWorldPopulation(elementID, elementSource) {
  let url = 'https://probably.one:4438/WPP2019_TotalPopulationByRegion';
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('Population Results:', results);
      printSourceAndLink(results, elementSource, url);
      var myChart = new Chart(document.getElementById(elementID), {
        type: 'line',
        options: {
          tooltips: {
            intersect: false,
            mode: 'index'
          },
          responsive: true,
          aspectRatio: 1,
          legend: {
            display: true,
            reverse: true,
            position: 'right',
            align: 'middle',
            labels: {
              boxWidth: 10
            },
          },
          scales: {
            yAxes: [{
              stacked: true,
              ticks: {
                callback: function (value, index, values) {
                  return value / 1000
                }
              }
            }],
            xAxes: [{
              ticks: {
                maxTicksLimit: 8,
                autoSkip: true,
              }
            }]
          }
        }
      });
      myChart.data.labels = results.data[0].data.map(x => x.year);
      while (results.data.length) {
        let x = results.data.pop();
        if (x.region === 'World') continue;
        console.log('Population region', x);
        if (x.region === 'Latin America and the Caribbean') {
          x.region = 'S America';
        } else if (x.region === 'Northern America') {
          x.region = 'N America';
        }
        myChart.data.datasets.push({
          label: x.region,
          data: x.data.map(y => y.population),
          fill: true
        });
      }
      myChart.update();
    })
    .catch(err => console.log(err));
}

//
// Global Oil Production
//
function plotGlobalOilProduction(elementId, elementSource) {
  url = 'https://probably.one:4438/eia-international-data-oil-production';
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('Oil production results:', results);
      printSourceAndLink(results, elementSource, url);
      var myChart = new Chart(document.getElementById(elementId), {
        type: 'line',
        options: {
          tooltips: {
            intersect: false,
            mode: 'index'
          },
          responsive: true,
          aspectRatio: 1,
          legend: {
            display: true,
            labels: {
              boxWidth: 10
            },
          },
          scales: {
            yAxes: [{
              stacked: true,
              ticks: {
                callback: function (value, index, values) {
                  return value / 1000
                }
              }
            }],
            xAxes: [{
              ticks: {
                maxTicksLimit: 8,
                autoSkip: true,
              }
            }]
          }
        }
      });
      myChart.data.labels = results.data[0].data.map(x => x.year);
      while (results.data.length) {
        let x = results.data.pop();
        if (x.region === 'World') continue
        myChart.data.datasets.push({
          label: x.region,
          data: x.data.map(y => y.data),
          fill: true
        });
      }
      myChart.update();
    })
    .catch(err => console.log(err));
}

//
// Print the sources for the data. Create a button for getting chart data.
//
function printSourceAndLink(res, elmtId, url) {
  let str = "<p>Source not defined</p>";
  if (res.source !== undefined && res.source !== null) {
    str = "<p>Source: " + res.source + "</p>"; // yes, intentional overwrite of str
  }
  if (res.link !== undefined && res.link !== null) {
    str += "<p>Link: <a target='_blank' rel='noopener' href='";
    str += res.link + "'>";
    str += res.link + "</a>"
  }
  str += "<p><button class='w3-button w3-dark-grey w3-round-small' onClick=\"tryUrl('"
  str += url + "')\">Get chart data</button></p>";
  document.getElementById(elmtId).innerHTML = str;
}

//
// Global Coal
//
function plotGlobalCoalProduction(elementId, elementSource) {
  let url = "https://probably.one:4438/eia-international-data-coal";
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('Coal:', results);
      printSourceAndLink(results, elementSource, url);
      var myChart = new Chart(document.getElementById(elementId), {
        type: 'line',
        options: {
          tooltips: {
            intersect: false,
            mode: 'index'
          },
          responsive: true,
          aspectRatio: 1,
          legend: {
            display: true,
            labels: {
              boxWidth: 10
            },
          },
          scales: {
            yAxes: [{
              stacked: true,
              ticks: {
                callback: function (value, index, values) {
                  return value / 1000
                }
              }
            }],
            xAxes: [{
              ticks: {
                maxTicksLimit: 8,
                autoSkip: true,
              }
            }]
          }
        }
      });
      myChart.data.labels = results.data[0].data.map(x => x.year);
      while (results.data.length) {
        let x = results.data.pop();
        if (x.region === 'World') continue
        myChart.data.datasets.push({
          label: x.region,
          data: x.data.map(y => y.data),
          fill: true
        });
      }
      myChart.update();
    })
    .catch(err => console.log(err));
}

//
// Global Gas
//
function plotGlobalGasProduction(elementId, elementSource) {
  fetch('https://probably.one:4438/eia-international-data-dry-natural-gas-production')
    .then(status)
    .then(json)
    .then(results => {
      console.log('Gas results:', results);
      printSourceAndLink(results, elementSource, url);
      var myChart = new Chart(document.getElementById(elementId), {
        type: 'line',
        options: {
          tooltips: {
            intersect: false,
            mode: 'index'
          },
          responsive: true,
          aspectRatio: 1,
          legend: {
            display: true,
            labels: {
              boxWidth: 10
            },
          },
          scales: {
            yAxes: [{
              stacked: true,
              ticks: {
                callback: function (value, index, values) {
                  return value / 1000
                }
              }
            }],
            xAxes: [{
              ticks: {
                maxTicksLimit: 8,
                autoSkip: true,
              }
            }]
          }
        }
      });
      myChart.data.labels = results.data[0].data.map(x => x.year);
      while (results.data.length) {
        let x = results.data.pop();
        if (x.region === 'World') continue
        myChart.data.datasets.push({
          label: x.region,
          data: x.data.map(y => y.data),
          fill: true
        });
      }
      myChart.update();
    })
    .catch(err => console.log(err));
}

//
// Ozone Hole Southern Hemisphere
//
function plotOzoneHole(elementId, elementSource) {
  let url = 'https://probably.one:4438/ozone';
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('Ozone results:', results);
      printSourceAndLink(results, elementSource, url);
      var myChart = new Chart(document.getElementById(elementId), {
        type: 'line',
        options: {
          aspectRatio: 1,
          scales: {
            yAxes: [{
              id: 'hole',
              position: 'left',
              grid: {
                display: false
              }
            }
              /*, {
                            id: 'level',
                            position: 'right'
                          }*/
            ],
            xAxes: [{
              ticks: {
                autoSkip: true,
                maxTicksLimit: 8
              },
              type: 'time',
              time: {
                unit: 'year'
              }
            }]
          }
        }
      });
      let dates = results.data.map(x => x.date);
      let values = results.data.map(x => x.meanOzoneHoleSize);
      /*
      let levels = results.data.map(x => x.minimumOzoneLevel);
      myChart.data.datasets.push({
        yAxisID: 'level',
        label: 'Atmospheric ozone level',
        data: levels,
        type: 'line',
        fill: false,
        pointRadius: 3
      });
*/
      myChart.data.datasets.push({
        yAxisID: 'hole',
        label: 'Ozone hole size',
        data: values,
        fill: false,
        pointRadius: 3
      });
      myChart.data.labels = dates;
      myChart.update();
    })
    .catch(err => console.log(err));
}

//
// Global Temperature Anomaly
//
function plotGlobalTemp(elementId, elementSource) {
  var myChart = new Chart(document.getElementById(elementId), {
    type: 'line',
    options: {
      aspectRatio: 1,
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: true,
            maxTicksLimit: 8
          },
          gridLines: {
            display: false
          }
        }],
        yAxes: [{
          stacked: false,
          ticks: {
            callback: function (value, index, values) {
              return Math.round(value * 10) / 10 + "\u00b0" + "C";
            }
          }
        }]
      }
    }
  });
  let url = 'https://probably.one:4438/temperature-anomaly';
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('Results:', results);
      printSourceAndLink(results, elementSource, url);
      let regions = [
        'Global',
        'Northern Hemisphere',
        'Southern Hemisphere'
      ];
      let country = [];
      for (let i = 0; i < regions.length; i++) {
        let c = results.data.filter(x => {
          return x.country === regions[i]
        });
        country[i] = c[0];
        let d1 = country[i].data.map(x => x.median);
        let l1 = country[i].data.map(x => x.year);
        myChart.data.datasets.push({
          data: d1,
          label: regions[i],
          fill: false
        });
        if (i === 0) {
          myChart.data.labels = l1.slice();
        }
        myChart.update();
      }
    })
    .catch(err => console.log(err));
}

//
// Svalbard - Arctic Temperature Development
//
function plotSvalbardTemp(elementId, elementSource) {
  var myChart = new Chart(document.getElementById(elementId), {
    type: 'line',
    options: {
      aspectRatio: 1,
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: true,
            maxTicksLimit: 8
          },
          gridLines: {
            display: false
          }
        }],
        yAxes: [{
          stacked: false,
          ticks: {
            callback: function (value, index, values) {
              return Math.round(value * 10) / 10 + "\u00b0" + "C";
            }
          }
        }]
      }
    }
  });
  let url = 'https://probably.one:4438/temperature-svalbard';
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('Results:', results);
      printSourceAndLink(results, elementSource, url);
      let d1 = results.data[0].data.map(x => x.temperature);
      let l1 = results.data[0].data.map(x => x.year);
      myChart.data.datasets.push({
        data: d1,
        label: results.data[0].country,
        fill: false
      });
      myChart.data.labels = l1;
      myChart.update();
    })
    .catch(err => console.log(err));
}

//
// Brazil Forest Fires
//
function plotBrazilFires(elementId, elementSource) {
  let url = 'https://probably.one:4438/queimadas';
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('Queimadas Results:', results);
      printSourceAndLink(results, elementSource, url);
      var myChart = new Chart(document.getElementById(elementId), {
        type: 'line',
        options: {
          aspectRatio: 1,
          plugins: {
            colorschemes: {
              scheme: 'tableau.Tableau10'
            },
          },
          tooltips: {
            enabled: false
          },
          scales: {
            xAxes: [{
              gridLines: {
                display: false
              }
            }],
            yAxes: [{
              stacked: false
            }]
          }
        }
      });
      while (results.data.length) {
        let x = results.data.pop();
        let values = x.data;
        // Too much data here
        // Let us just look at 2019 and Average
        if (x.year != 2019 && x.year != "Average") { // && x.year != "Maximum" && x.year != "Minimum") 
          continue;
        }
        myChart.data.datasets.push({
          data: values,
          label: x.year,
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
function plotGlobalSeaLevel(elementId, elementSource) {
  let url = 'https://probably.one:4438/CSIRO_Recons';
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('GSML results:', results);
      printSourceAndLink(results, elementSource, url);
      var myChart = new Chart(document.getElementById(elementId), {
        type: 'scatter',
        options: {
          plugins: {
            colorschemes: {
              scheme: 'tableau.Tableau10'
            },
          },
          responsive: true,
          aspectRatio: 1,
          legend: {
            display: true,
            labels: {
              boxWidth: 10
            },
          },
          scales: {
            yAxes: [{
              stacked: false,
            }],
            xAxes: [{
              type: 'time',
              ticks: {
                maxTicksLimit: 8,
                autoSkip: true,
              }
            }]
          }
        }
      });
      let x = results.data.pop();
      let xd = x.data.map(d => ({
        x: d.year + "-06",
        y: d.data
      }));
      myChart.data.datasets.push({
        label: 'Land based measurements',
        data: xd,
        fill: false
      });
      myChart.update();
      fetch('https://probably.one:4438/CSIRO_Alt_yearly')
        .then(status)
        .then(json)
        .then(results => {
          console.log('CSIRO 2', results);
          let x = results.data.pop();
          let xd = x.data.map(d => ({
            x: d.year + "-06",
            y: d.data
          }));
          myChart.data.datasets.push({
            label: 'Satellite measurements',
            data: xd,
            fill: false
          });
          myChart.update();
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err));
}


//
// CCS - Cabon Capture
//
function plotCCS(elementId, elementSource) {
  let url = 'https://probably.one:4438/operational-ccs';
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('CCS Results:', results);
      printSourceAndLink(results, elementSource, url);
      /*
      myChart.data.datasets.push({
        data: results.data.map(x => x.capacity),
        label: ""
      });
      myChart.data.labels = results.data.map(x => x.project);
      myChart.update();
      */
    })
    .catch(err => console.log(err));
}