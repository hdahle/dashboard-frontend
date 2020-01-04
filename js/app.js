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

// ----------------------------------------------
// Atmospheric CO2
// ----------------------------------------------

// plotAtmosphericCO2('myChart2');

function plotAtmosphericCO2(elementIdA) {
    var myChart2 = new Chart(document.getElementById(elementIdA), {
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
            let values = results.data.map(x => ({ x: x.date, y: x.interpolated }));
            myChart2.data.datasets.push({
                data: values,
                fill: false,
                label: 'Mauna Loa, Hawaii'
            });
            myChart2.update();
        })
        .catch(err => console.log(err));
}
