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
    + "class='w3-hide-small w3-button w3-block w3-stretch w3-left-align w3-hover-white w3-text-theme' style='font-size:small'>"
    + "SOURCES &nbsp; "
    + "<i class='fa fa-angle-down' id='" + ids.arrowId + "'></i>"
    + "</div>"
    + "<div id='" + ids.accordionId + "' class='w3-hide w3-hide-small' style='font-size:small'></div>";

  // Insert the canvas for the chart , and button and accordion for mobile          
  let html = "<div class='w3-rest w3-container'>";
  if (responsive === undefined || responsive === false) {
    html += "<div id='" + ids.canvasId + "-wrap'><canvas id='" + ids.canvasId + "'></canvas></div>";
  } else {
    // create two divs/two canvases, one for small and one for medium/large screens
    html += "<div class='w3-hide-small' id='" + ids.canvasId + "-wrap'><canvas id='" + ids.canvasId + "'></canvas></div>"
      + "<div class='w3-hide-large w3-hide-medium' id='" + ids.canvasIdMobile + "-wrap'><canvas id='" + ids.canvasIdMobile + "'></canvas></div>"
  }
  html += "<div onclick='openAccordion(\"" + ids.accordionIdMobile + "\",\"" + ids.arrowIdMobile + "\")' "
    + "class='w3-hide-large w3-hide-medium w3-button w3-block w3-stretch w3-left-align w3-hover-white w3-text-theme' style='font-size:small'>"
    + "SOURCES &nbsp; "
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
    let l = res.link;
    if (res.source !== undefined && res.source !== null) {
      s += "<p>" + res.source + "</p>"; // yes, intentional overwrite of str
    }
    if (res.accessed !== undefined && res.accessed !== null) {
      s += "<p>Data retrieved: " + res.accessed + "</p>"; // yes, intentional overwrite of str
    }
    if (l !== undefined && l !== null) {
      s += "<p><i class='fa fa-link w3-text-theme-l1'></i> &nbsp; <a target='_blank' rel='noopener' href='" + l + "'>" + l + "</a></p>";
    }
    s += "<p><i class='fa fa-link w3-text-theme-l1'></i> &nbsp; <a target='_blank' rel='noopener' href='" + url + "'>" + url + "</a></p>";
    document.getElementById(acc).innerHTML = s;
  }
}

