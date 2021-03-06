//
// dom.js
//
// Functions for manipulating DOM
// 
// insertAccordionAndCanvas: inserts a DIV for an 'accordion', opening and closing on click
// openAccordion: opens the accordion, and changes the direction of the arrow, indicating it can be closed
// insertSourceAndLink: based on information from api.dashboard.eco, adds references to the accordion
//   also adds a button which opens a new window and displays the data from api.dashboard.eco
//
// H. Dahle
//

// Insert <button> which calls openAccordion() to show sources and links
// Insert <canvas> for the chart
function insertAccordionAndCanvas(id, responsive) {
  let x = document.getElementById(id);
  let d = x.getElementsByTagName('div')[0];
  let ids = {
    canvasId: id + "-canvas",
    canvasIdMobile: id + "-canvas-m",
    accordionId: id + "-accordion",
    accordionIdMobile: id + "-accordion-m",
    arrowId: id + "-arrow",
    arrowIdMobile: id + "-arrow-m"
  }
  // Insert the button and accordion for the sources and links
  d.innerHTML += "<div onclick='openAccordion(\"" + ids.accordionId + "\",\"" + ids.arrowId + "\")' "
    + "class='w3-hide-small w3-button w3-block w3-stretch w3-left-align fp-small-font'>"
    + "Sources &nbsp; "
    + "<i class='fa fa-angle-down' id='" + ids.arrowId + "'></i>"
    + "</div>"
    + "<div id='" + ids.accordionId + "' class='w3-hide w3-hide-small' style='font-size:small'></div>";

  // Insert the canvas for the chart , and button and accordion for mobile          
  let html = "<div class='w3-rest w3-container'>";
  if (responsive === undefined || responsive === false) {
    html += "<div id='" + ids.canvasId + "-wrap'><canvas class='fp-chart' id='" + ids.canvasId + "'></canvas></div>";
  } else {
    // create two divs/two canvases, one for small and one for medium/large screens
    html += "<div class='w3-hide-small' id='" + ids.canvasId + "-wrap'><canvas id='" + ids.canvasId + "'></canvas></div>"
      + "<div class='w3-hide-large w3-hide-medium' id='" + ids.canvasIdMobile + "-wrap'><canvas id='" + ids.canvasIdMobile + "'></canvas></div>"
  }
  html += "<div onclick='openAccordion(\"" + ids.accordionIdMobile + "\",\"" + ids.arrowIdMobile + "\")' "
    + "class='w3-hide-large w3-hide-medium w3-button w3-block w3-stretch w3-left-align fp-small-font'>"
    + "Sources &nbsp; "
    + "<i class='fa fa-angle-down' id='" + ids.arrowIdMobile + "'></i>"
    + "</div>"
    + "<div id='" + ids.accordionIdMobile + "' class='w3-hide w3-hide-large w3-hide-medium' style='font-size:small'></div>"
    + "</div>";

  x.innerHTML += html;
  return ids;
}

//
// Toggle accordion show/hide state. Toggle arrow up/down.
//
function openAccordion(id, arrowId) {
  let y = document.getElementById(id);

  // toggle 'show' state of accordion
  if (y.className.indexOf("w3-show") === -1) {
    y.className += " w3-show";
  } else {
    y.className = y.className.replace("w3-show", "");
  }
  // toggle arrow up/down
  y = document.getElementById(arrowId);
  y.className = (y.className === "fa fa-angle-down") ? "fa fa-angle-up" : "fa fa-angle-down";
}

//
// Print the sources for the data. Create a button for getting chart data.
//
function insertSourceAndLink(res, elmtId, url) {
  let accordions = [elmtId.accordionId, elmtId.accordionIdMobile];
  while (accordions.length) {
    let acc = accordions.pop();
    let s = document.getElementById(acc).innerHTML;
    if (res.source !== undefined && res.source !== null && res.source !== "") {
      s += "<p>" + res.source + "</p>";
    }
    if (res.accessed !== undefined && res.accessed !== null && res.accessed !== "") {
      s += "<p>Data retrieved: " + res.accessed + "</p>";
    }
    if (res.updated !== undefined && res.updated !== null && res.updated !== "") {
      s += "<p>Data retrieved: " + res.updated + "</p>";
    }
    if (res.link !== undefined && res.link !== null && res.link !== "") {
      s += "<div class='w3-button'><i class='fa fa-link'></i>&nbsp;<a rel='noopener' href='";
      s += res.link + "'>" + res.link + "</a></div><br>";
    }
    if (Array.isArray(url)) {
      url.forEach(u => {
        s += "<div class='w3-button fp-url' onclick='clickBtn(\"" + u + "\");'><i class='fa fa-link'></i>&nbsp;" + u + "</div><br>";
      });
    } else {
      if (url != "") {
        s += "<div class='w3-button fp-url' onclick='clickBtn(\"" + url + "\");'><i class='fa fa-link'></i>&nbsp;" + url + "</div><br>";
      }
    }
    document.getElementById(acc).innerHTML = s;
  }
}

//
// Get list of all API-urls
//
function insertFpUrls(elmt) {
  let urlElements = document.getElementsByClassName('fp-url');
  let s = '';
  let res = [];
  for (let i = 0; i < urlElements.length; i++) {
    let url = urlElements[i].innerText;
    let idx = url.indexOf('http');
    if (idx === -1) continue;               // if 'http' not found it's an error, skip
    url = url.substr(idx, url.length);      // strip off leading spaces etc
    if (res.indexOf(url) !== -1) continue;  // duplicate URL, skip
    res.push(url);                          // save the URL so that we can avoid duplicates
    s += "<div class='w3-button' onclick='clickBtn(\"" + url + "\");'><i class='fa fa-link'></i>&nbsp;" + url + "</div></br>";
  };
  document.getElementById(elmt).innerHTML = s;
}

// 
// Open new window for displaying JSON content at URL
//
function clickBtn(url) {
  fetch(url)
    .then(status)
    .then(json)
    .then(res => {
      let w = window.open();
      w.document.body.innerHTML = "<pre>" + JSON.stringify(res, null, 2) + "<pre>";
    })
    .catch(err => console.log(err));
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
