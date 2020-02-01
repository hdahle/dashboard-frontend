//
// dom.js
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
    + "class='w3-button w3-block w3-stretch w3-left-align w3-hover-white'>"
    + "Sources &nbsp; "
    + "<i class='fa fa-angle-down' id='" + ids.arrowId + "'></i>"
    + "</div>"
    + "<div id='" + ids.accordionId + "' class='w3-hide'></div>";
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
  let s = "<p>Source not defined</p>";
  let l = res.link;
  if (res.source !== undefined && res.source !== null) {
    s = "<p>" + res.source + "</p>"; // yes, intentional overwrite of str
  }
  if (l !== undefined && l !== null) {
    s += "<p><a target='_blank' rel='noopener' href='" + l + "'>" + l + "</a></p>";
  }
  s += "<div class='w3-hide-small'>"
    + "<p><button class='w3-button w3-dark-grey w3-round-small' "
    + "onClick=\"tryUrl('" + url + "')\">Get chart data</button></p>"
    + "</div>";
  document.getElementById(elmtId).innerHTML = s;
}