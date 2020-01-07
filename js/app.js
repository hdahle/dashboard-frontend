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
function plotAtmosphericCO2(elementId) {
  var myChart2 = new Chart(document.getElementById(elementId), {
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
  fetch('https://probably.one:4438/co2')
    .then(status)
    .then(json)
    .then(results => {
      let values = results.data.map(x => ({
        x: x.date,
        y: x.interpolated
      }));
      myChart2.data.datasets.push({
        data: values,
        fill: false,
        label: 'Mauna Loa, Hawaii'
      });
      myChart2.update();
    })
    .catch(err => console.log(err));
}

//
// Atmospheric CH4 Methane
//
function plotAtmosphericCH4(elementId) {
  fetch('https://probably.one:4438/ch4')
    .then(status)
    .then(json)
    .then(results => {
      console.log('Atmospheric methane results:', results);
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
function plotArcticIce(elementId) {
  fetch('https://probably.one:4438/ice-nsidc')
    .then(status)
    .then(json)
    .then(results => {
      console.log('ICE NSIDC Results:', results);
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