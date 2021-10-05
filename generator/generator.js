//
// Read datasets from API and generate static JS-code
// This avoids web-app having to read and depend on the API server
// There are two sets of data
//   urlmap - the dataset used for the web-app
//   urlmap2 - additional dataset used for rendering covid chart images for Telegram bot
//
// H. Dahle, 2021
//

const { urlmap, urlmap2 } = require('./generator-urls');
var fetch = require('node-fetch');

var argv = require('minimist')(process.argv.slice(2));

(async () => {

  let urls;
  if (argv.web) {
    urls = urlmap;
  } else if (argv.bot) {
    urls = urlmap2;
  } else {
    console.log('Usage: generator options [--help]');
    console.log('  --bot: Generate the two big Covid datasets for Futureplanet Telegram bot');
    console.log('  --web:  Generate standard datasets for Futureplanet web app' );
    console.log('  --help: This help');
    console.log('Example:');
    console.log('  generator --web > redis-values.js');
    console.log('Note:');
    console.log('  If both --web and --bot are used, --bot will be ignored');
    return;
  }

  urls.forEach(async (item) => {
    const response = await fetch(item.url);
    let json = null;
    // Check if HTTP response is 2XX
    if (response.ok) {
      try {
        // make sure there is valid JSON
        json = await response.json();
      }
      catch (err) {
        console.error("Error: Invalid JSON in response", item.url);
      }
    } else {
      console.error("Error: HTTP status", response.status, item.url);
    }
    const text = JSON.stringify(json);
    console.error("OK", item.url, text.length);
    console.log("let", item.varName, "=", text, ";");
  })
})();