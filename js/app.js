//
// app.js
//
// H. Dahle
//

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
Chart.plugins.unregister(ChartDataLabels);


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
        fontColor: '#222',
        fontStyle: 'normal',
        padding: 0
      },
      plugins: {
        datalabels: {
          labels: {
            title: {
              align: 'top', offset: 8,
              color: '#444',
              font: {
                size: 14,
              },
              formatter: (value, ctx) => ctx.dataset.label[ctx.dataIndex],
            },
            value: {
              color: '#333',
              font: {
                size: 18,
                weight: 'bold'
              },
              formatter: (val) => val + ' Gt',
            }
          }
        }
      },
      aspectRatio: 0.8,
      responsive: true,
      legend: {
        display: false,
        position: 'top'
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
      myChart.data.datasets.push({
        label: d.data[0].legend,
        data: d.data[0].values,
        //backgroundColor: bgc,
      });
      myChart.data.labels = d.data[0].legend;
      myChart.options.title.text = 'Resources consumed: 100.6 Gt (billion tons)';//d.data[0].title;
      myChart.update();
      /*
              myCharts[1].data.datasets.push({
                label: d.data[2].legend,
                data: d.data[2].values,
                backgroundColor: bgc2,
              });
              myCharts[1].data.labels = d.data[2].legend;
              myCharts[1].options.title.text = 'Where it ends up';//d.data[2].title;
              myCharts[1].update();
            })
            .catch(err => console.log(err));
            */
    })
}

//
// Glacier length
//
function plotGlaciers(elmt) {
  let id = insertAccordionAndCanvas(elmt);

  function mkColorArray(color, num) {
    let c = d3.hsl(color);
    let r = [];
    for (i = 0; i < num; i++) {
      r.push(c + "");
      c.h += (360 / num);
    }
    return r;
  }
  // Color array for #222c3c: Use #db7f67 (coolors red in the palette)
  // Alternatively a little bit darker c8745e
  let c = '#db7f67'; //'#c8745e';
  let glaciers = ['Styggedalsbreen', 'Bondhusbrea', 'Boyabreen', 'Buerbreen',
    'Hellstugubreen', 'Storbreen', 'Stigaholtbreen', 'Briksdalsbreen',
    'Rembesdalskaaka', 'Engabreen', 'Faabergstolsbreen', 'Nigardsbreen', 'Lodalsbreen'
  ];
  //  let colors = mkColorArray(c, glaciers.length);
  let colors = [
    "rgb(219, 127, 103)", "rgb(219, 181, 103)", "rgb(204, 219, 103)", "rgb(150, 219, 103)",
    "rgb(103, 219, 109)", "rgb(103, 219, 163)", "rgb(103, 219, 216)", "rgb(103, 168, 219)",
    "rgb(103, 115, 219)", "rgb(145, 103, 219)", "rgb(198, 103, 219)", "rgb(219, 103, 186)", "rgb(219, 103, 133)"
  ];
  console.log(colors);
  var myChart = new Chart(document.getElementById(id.canvasId), {
    type: 'scatter',
    options: {
      legend: {
        display: true,
        position: 'right',
        fontSize: 8,
        reverse: true,
        labels: {
          boxWidth: 6
        }
      },
      aspectRatio: 2,
      scales: {
        yAxes: [{
          ticks: {
            callback: function (value) {
              return value ? value + 'm' : value;
            }
          }
        }],
        xAxes: [{
          ticks: {
            max: 2020,
            min: 1900,
            //autoSkip: true,
            //maxTicksLimit: 8,
          },
        }]
      }
    }
  });
  while (glaciers.length) {
    let url = 'https://api.dashboard.eco/glacier-length-nor-' + glaciers.pop();
    fetch(url)
      .then(status)
      .then(json)
      .then(results => {
        console.log('Glaciers:', results.data.length);
        insertSourceAndLink(results, id, url);
        let c = colors.pop();
        myChart.data.datasets.push({
          data: results.data,
          fill: false,
          borderWidth: 2,
          borderColor: c,
          fillColor: c,
          pointColor: c,
          pointRadius: 0, //3,
          showLine: true,
          label: results.glacier
        });
        myChart.update();
      })
      .catch(err => console.log(err));
  }
}


// 
// Atmospheric CO2
// 
function plotAtmosphericCO2(elmt, url, ticksConfig) {
  let id = insertAccordionAndCanvas(elmt);
  let myChart = new Chart(document.getElementById(id.canvasId), {
    type: 'line',
    options: {
      legend: {
        display: false
      },
      aspectRatio: 1,
      scales: {
        yAxes: [{
          ticks: ticksConfig
        }],
        xAxes: [{
          ticks: {
            autoSkip: true,
            //            min: "1960-01-01",
            max: "2020-06-01",
            maxTicksLimit: 11
          },
          type: 'time',
          time: {
            unit: 'year'
          }
        }]
      }
    }
  });
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('Atmospheric CO2:', results.data.length);
      insertSourceAndLink(results, id, url);
      myChart.data.datasets.push({
        data: results.data,
        fill: false,
        borderWidth: 2,
        borderColor: '#5c7f7f',
        label: 'Mauna Loa, Hawaii'
      });
      myChart.update();
    })
    .catch(err => console.log(err));
}

// 
// Plot CO2 data. Used by several sections in HTML
//
function plotScatter(elmt, urls, labels, xTicks, yTicks) {
  let id = insertAccordionAndCanvas(elmt);
  var myChart = new Chart(document.getElementById(id.canvasId), {
    type: 'scatter',
    options: {
      legend: {
        display: true,
        labels: {
          boxWidth: 10
        }
      },
      aspectRatio: 1,
      scales: {
        xAxes: [{
          ticks: xTicks
        }],
        yAxes: [{
          ticks: yTicks
        }]
      }
    }
  });
  while (urls.length && labels.length) {
    let url = urls.shift();
    let lbl = labels.shift();
    fetch(url)
      .then(status)
      .then(json)
      .then(results => {
        //console.log('plotUrls:', url, results.data.length);
        insertSourceAndLink(results, id, url);
        myChart.data.datasets.push({
          data: results.data,
          fill: false,
          borderWidth: 2,
          showLine: true,
          label: lbl
        });
        myChart.update();
      })
      .catch(err => console.log(err));
  }
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
      var myChart = new Chart(document.getElementById(id.canvasId), {
        type: 'line',
        options: {
          responsive: true,
          aspectRatio: 1,
          legend: {
            reverse: true,
            position: 'right',
            labels: {
              boxWidth: 10
            },
          },
          tooltips: {
            intersect: false,
            mode: 'nearest'
          },
          scales: {
            yAxes: [{
              stacked: true,
              ticks: {
                callback: (value) => (value / 1000) + ' Gt'
              }
            }],
            xAxes: [{
              type: 'linear',
              ticks: {
                min: 1959,
                max: 2018,
                callback: (x) => x === 1960 ? null : x
              }
            }]
          }
        }
      });

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
        myChart.data.datasets.push({
          label: d.country,
          fill: true,
          borderWidth: 3,
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
      var myChart = new Chart(document.getElementById(id.canvasId), {
        type: 'line',
        options: {
          responsive: true,
          aspectRatio: 1,
          legend: {
            display: true,
            reverse: true,
            position: 'right',
            labels: {
              boxWidth: 10
            },
          },
          scales: {
            yAxes: [{
              stacked: true,
              ticks: {
                callback: (value) => Math.trunc(value / 1000) + " Mt"
              }
            }],
            xAxes: [{
              type: 'time',
              time: {
                unit: 'year'
              },
              ticks: {
                maxTicksLimit: 8,
                autoSkip: true,
              }
            }]
          }
        }
      });
      // Plot all datasets except 0 which is the Total
      for (let i = 1; i < results.data.length; i++) {
        myChart.data.datasets.push({
          data: results.data[i].values.map(x => {
            return { t: x.t + "-12-31", y: x.y }
          }),
          label: results.data[i].name
        })
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
      let myChart = new Chart(document.getElementById(id.canvasId), {
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
      let yrs = [2020, 2019, 2015, 2010, 2005, 2000, 1995, 1990, 1985, 1979]
      while (yrs.length) {
        let year = yrs.shift();
        // Extract a subset of data for a particular year
        let tmp = results.data.filter(x => x.year === year);
        // Then create a table that only contains the datapoints
        let resval = tmp.map(x => x.extent);
        myChart.data.datasets.push({
          data: resval,
          label: year,
          fill: false,
          pointRadius: year == 2020 ? 2 : 0,
        });
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
      var myChart = new Chart(document.getElementById(id.canvasId), {
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
                callback: (value) => value / 1000
              }
            }],
            xAxes: [{
              type: 'linear',
              ticks: {
                maxTicksLimit: 8,
                autoSkip: true
              }
            }]
          }
        }
      });
      while (results.data.length) {
        let x = results.data.pop();
        if (x.region === 'World') continue;
        if (x.region === 'Latin America and the Caribbean') {
          x.region = 'S America';
        } else if (x.region === 'Northern America') {
          x.region = 'N America';
        }
        //console.log('region', x.region, x.data)
        myChart.data.datasets.push({
          label: x.region,
          data: x.data,
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
function plotEiaFossilFuelProduction(elmt, url) {
  let id = insertAccordionAndCanvas(elmt);
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('EIA:', results.series.length);
      insertSourceAndLink(results, id, url);
      var myChart = new Chart(document.getElementById(id.canvasId), {
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
            //            position: 'right',
            labels: {
              boxWidth: 10
            },
          },
          scales: {
            yAxes: [{
              ticks: {
                callback: (value) => value / 1000
              }
            }],
            xAxes: [{
              type: 'linear'
            }]
          }
        }
      });
      while (results.series.length) {
        let x = results.series.pop();
        //console.log(x.region)
        if (x.region === 'EU28') continue;
        myChart.data.datasets.push({
          label: x.region,
          data: x.data,
          borderWidth: 3,
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
  let myChart = new Chart(document.getElementById(id.canvasId), {
    type: 'line',
    options: {
      responsive: true,
      aspectRatio: 1,
      legend: {
        reverse: true,
        position: 'right',
        labels: {
          boxWidth: 10
        },
      },
      tooltips: {
        intersect: false,
        mode: 'nearest'
      },
      scales: {
        yAxes: [{
          ticks: {
            callback: (value) => (value / 1000) + ' Gt'
          }
        }],
        xAxes: [{
          type: 'linear',
          ticks: {
            min: 1959,
            max: 2018,
            callback: (x) => x === 1960 ? null : x
          }
        }]
      }
    }
  });
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('Emissions by type:', results.data.length);
      insertSourceAndLink(results, id, url);
      while (results.data.length) {
        let d = results.data.pop();
        if (d.fuel === 'Per Capita') continue;
        myChart.data.datasets.push({
          label: d.fuel,
          fill: false,
          borderWidth: 3,
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
  let id = insertAccordionAndCanvas(elmt);
  let url = 'https://api.dashboard.eco/ozone-nasa';
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('Ozone results:', results.data.length);
      insertSourceAndLink(results, id, url);
      let myChart = new Chart(document.getElementById(id.canvasId), {
        type: 'line',
        options: {
          tooltips: {
            intersect: false,
            mode: 'x'
          },
          aspectRatio: 1,
          responsive: true,
          scales: {
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
      myChart.data.datasets.push({
        label: 'Ozone hole (millions of sq.km)',
        data: results.data.map(x => {
          return { t: x.date, y: x.meanOzoneHoleSize }
        }),
        fill: false,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(20,200,40,0.1)',
        borderWidth: 2
      });
      myChart.update();
    })
    .catch(err => console.log(err));
}

//
// Global Temperature Anomaly
//
function plotGlobalTemp(elmt) {
  let id = insertAccordionAndCanvas(elmt);
  let myChart = new Chart(document.getElementById(id.canvasId), {
    type: 'line',
    options: {
      aspectRatio: 1,
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        xAxes: [{
          type: 'linear',
          ticks: {
            max: 2020,
            autoSkip: true,
            maxTicksLimit: 9
          },
          gridLines: {
            display: false
          }
        }],
        yAxes: [{
          ticks: {
            callback: (value) => Math.round(value * 10) / 10 + "\u00b0" + "C"
          }
        }]
      }
    }
  });
  let url = 'https://api.dashboard.eco/global-temperature-anomaly';
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('Results:', results.data.length);
      insertSourceAndLink(results, id, url);
      myChart.data.datasets.push({
        data: results.data.map(x => ({ x: x.year, y: x.mean })),
        label: 'NASA Dataset',
        borderWidth: 2,
        fill: false
      });
      myChart.update();

      url = 'https://api.dashboard.eco/global-temperature-hadcrut';
      fetch(url)
        .then(status)
        .then(json)
        .then(results => {
          console.log('Results:', results.data.length);
          insertSourceAndLink(results, id, url);
          myChart.data.datasets.push({
            data: results.data,//.map(x => ({ x: x.x, y: x.y + 0.14 })),
            label: 'UK HadCRUT Dataset',
            borderWidth: 2,
            fill: false
          });
          myChart.update();
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}

//
// Svalbard - Arctic Temperature Development
//
function plotSvalbardTemp(elmt) {
  let id = insertAccordionAndCanvas(elmt);
  let myChart = new Chart(document.getElementById(id.canvasId), {
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
            callback: (value) => Math.round(value * 10) / 10 + "\u00b0" + "C"
          }
        }]
      }
    }
  });
  let url = 'https://api.dashboard.eco/temperature-svalbard';
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('Svalbard:', results.data.length);
      insertSourceAndLink(results, id, url);
      let d1 = results.data[0].data.map(x => x.temperature);
      let l1 = results.data[0].data.map(x => x.year);
      myChart.data.datasets.push({
        data: d1,
        label: results.data[0].country,
        borderWidth: 2,
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
function plotBrazilFires(elmt) {
  let id = insertAccordionAndCanvas(elmt);
  let url = 'https://api.dashboard.eco/queimadas-brazil';
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('Brazil:', results.data.length);
      insertSourceAndLink(results, id, url);
      var myChart = new Chart(document.getElementById(id.canvasId), {
        type: 'line',
        options: {
          aspectRatio: 1,
          plugins: {
            colorschemes: {
              scheme: 'tableau.Tableau10'
            },
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
        // Too much data here. Let us just look at 2019 and Average
        if (x.year != 2019 && x.year != 2020 && x.year != "Average") { // && x.year != "Maximum" && x.year != "Minimum") 
          continue;
        }
        myChart.data.datasets.push({
          data: values,
          label: x.year,
          borderWidth: 2,
          pointRadius: x.year == 2020 ? 3 : 0,
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
  let id = insertAccordionAndCanvas(elmt);
  let url = 'https://api.dashboard.eco/CSIRO_Recons_2015';
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('SeaLevelRecons:', results.data.length);
      insertSourceAndLink(results, id, url);
      let myChart = new Chart(document.getElementById(id.canvasId), {
        type: 'line',
        options: {
          tooltips: {
            intersect: false,
            mode: 'nearest'
          },
          responsive: true,
          aspectRatio: 1,
          legend: {
            labels: {
              boxWidth: 10
            },
          },
          scales: {
            yAxes: [{
              ticks: {
                callback: (value) => value + 'mm'
              }
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

      myChart.data.datasets.push({
        label: 'Land based measurements',
        data: results.data.map(d => ({
          t: d.t,
          y: d.data
        })),
        borderWidth: 2,
        fill: false
      });
      myChart.update();
      url = 'https://api.dashboard.eco/CSIRO_Alt';
      fetch(url)
        .then(status)
        .then(json)
        .then(results => {
          console.log('SeaLevelNew:', results.data.length);
          insertSourceAndLink(results, id, url);
          myChart.data.datasets.push({
            label: 'Satellite measurements',
            data: results.data[0].data.map(d => ({
              t: d.t,
              y: d.y + 45
            })),
            borderWidth: 2,
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
function plotCCS(elmt) {
  plotBothCCS(elmt, 'https://api.dashboard.eco/operational-ccs')
}
function plotPlannedCCS(elmt) {
  plotBothCCS(elmt, 'https://api.dashboard.eco/planned-ccs')
}
function plotBothCCS(elmt, url) {
  let id = insertAccordionAndCanvas(elmt);
  fetch(url)
    .then(status)
    .then(json)
    .then(results => {
      console.log('CCS:', results.data.length);
      insertSourceAndLink(results, id, url);
      var myChart = new Chart(document.getElementById(id.canvasId), {
        type: 'horizontalBar',
        options: {
          responsive: true,
          aspectRatio: 0.8,
          scales: {
            xAxes: [{
              ticks: {
                callback: (value) => value + 'Mt'
              }
            }],
            yAxes: [{
              gridLines: {
                display: false
              }
            }]
          },
          legend: {
            display: false
          },
          tooltips: {
            intersect: true
          }
        }
      });
      // remove any null projects, then sort it
      let d = results.data.filter(x => x.project != null).sort((a, b) => b.capacity - a.capacity);

      let names = d.map(x => x.project + ", " + x.country);
      let data = d.map(x => x.capacity);
      let bgColor = d.map(x => {
        if (x.type === 'EOR') return 'rgba(200,40,30,0.2)';
        if (x.type === 'Storage') return 'rgba(40,200,30,0.2)';
        return 'rgba(90,90,90,0.2)'
      });
      let lineColor = d.map(x => {
        if (x.type === 'EOR') return 'rgba(200,40,30,0.8)';
        if (x.type === 'Storage') return 'rgba(40,200,30,0.8)';
        return 'rgba(90,90,90,0.8)'
      });
      myChart.data.datasets.push({
        data: data,
        backgroundColor: bgColor,
        borderColor: lineColor,
        borderWidth: 1
      });
      myChart.data.labels = names;
      myChart.update();
    })
    .catch(err => console.log(err));
}
