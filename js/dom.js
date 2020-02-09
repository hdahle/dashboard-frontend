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
function insertAccordionAndCanvas(id) {
  let x = document.getElementById(id);
  let d = x.getElementsByTagName('div')[0];
  let ids = {
    canvasId: id + "-canvas",
    accordionId: id + "-accordion",
    arrowId: id + "-arrow"
  }
  // Insert the button and accordion for the sources and links
  d.innerHTML += "<div onclick='openAccordion(\"" + id + "\")' "
    + "class='w3-button w3-block w3-stretch w3-left-align w3-hover-white w3-text-theme'>"
    + "SOURCES &nbsp; "
    + "<i class='fa fa-angle-down' id='" + ids.arrowId + "'></i>"
    + "</div>"
    + "<div id='" + ids.accordionId + "' class='w3-hide' style='font-size:small' ></div>";
  // Insert the canvas for the chart            
  x.innerHTML += "<div class='w3-col m6 l5'>"
    + "<canvas id='" + ids.canvasId + "'></canvas>"
    + "</div>";
  return ids;
}

//
// Toggle accordion show/hide state. Toggle arrow up/down.
//
function openAccordion(id) {
  let y = document.getElementById(id + "-accordion");
  y.className = (y.className === "w3-show") ? "w3-hide" : "w3-show";
  y = document.getElementById(id + "-arrow");
  y.className = (y.className === "fa fa-angle-down") ? "fa fa-angle-up" : "fa fa-angle-down";
}

//
// Print the sources for the data. Create a button for getting chart data.
//
function insertSourceAndLink(res, elmtId, url) {
  let s = document.getElementById(elmtId).innerHTML;
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
  document.getElementById(elmtId).innerHTML = s;
}

