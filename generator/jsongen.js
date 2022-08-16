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
    console.log('Usage: jsongen [--web|--bot] [--help]');
    console.log('  This script requires generator-urls.js');
    console.log('  --bot: Generate the two Covid datasets for Futureplanet Telegram bot');
    console.log('  --web: Generate standard json-formatted datasets for Futureplanet web app' );
    console.log('  --help: This help');
    console.log('Example:');
    console.log('  jsongen --web > data.json');
    console.log('Note:');
    console.log('  If both --web and --bot are used, --bot will be ignored');
    return;
  }

  let result = [];

  for (const item of urls) {
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
    result.push({
      url: item.url,
      data: json
    });
  }
  console.log("let ssgVars = ", JSON.stringify(result), ";");
})();