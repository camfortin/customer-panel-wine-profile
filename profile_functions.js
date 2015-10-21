
function getDistinctFromData(data,property) {
  var distinctArray = [];
  for(i=0;i<data.length;i++) {
    if(distinctArray.indexOf(data[i][property]) === -1 && data[i][property].length > 0) {
      distinctArray.push(data[i][property]);
    }
  }
  return distinctArray;
}

function populateDropdown(data,property,dropdownId,appendToNames,initialSelected,hasAllSelection,allName) {
  var dropdownArray = [];
  var distinctPropertiesArray = getDistinctFromData(data,property);
  distinctPropertiesArray = distinctPropertiesArray.sort();
  if(initialSelected === 'All' && hasAllSelection) {
    dropdownArray.push('<option value="' + 'All' + '" selected="selected">' +  allName + '</option>'); 
  }
  else if(hasAllSelection) {
    dropdownArray.push('<option value="' + 'All' + '">' + allName + '</option>');
  }
  for(i=0;i<distinctPropertiesArray.length;i++) {
    if(distinctPropertiesArray[i] === initialSelected) {
      dropdownArray.push('<option value="' + distinctPropertiesArray[i] + '" selected="selected">' + distinctPropertiesArray[i] + appendToNames + '</option>')
    }
    else {
      dropdownArray.push('<option value="' + distinctPropertiesArray[i] + '">' + distinctPropertiesArray[i] + appendToNames + '</option>')
    }
  }
  document.getElementById(dropdownId).innerHTML = dropdownArray.join('');
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function loadSelected(domID,valueOrText) {
  if(valueOrText == "value") {
    return document.getElementById(domID).options[document.getElementById(domID).selectedIndex].value;
  }
  else {
    return document.getElementById(domID).options[document.getElementById(domID).selectedIndex].innerHTML;
  }
}

function listSlicers(elementId) {
  var slicerArray = [];
  //var slicerNameArray = ['gift_personal','mostRecentPurchaseYear',];
  var chartNameArray = ['varietalChart','regionChart','appellationChart']
  //var currentSlicer;
  var currentChart;
  /*for(i=0;i<slicerNameArray.length;i++) {
    currentSlicer = loadSelected(slicerNameArray[i],'text');
    if(currentSlicer != '-') {
      slicerArray.push(currentSlicer);
    }
  }*/
  for(i=0;i<chartNameArray.length;i++) {
    currentChart = eval(chartNameArray[i]);
    currentChartTitle = toTitleCase(chartNameArray[i].replace('Chart',''));
    if(currentChart.filter() != null) {
      slicerArray.push(currentChartTitle + ' (' + currentChart.filters().join(',') + ')');
    }
  }
  document.getElementById(elementId).innerHTML = slicerArray.join(', ');
  console.log('Current Slicers: ' + document.getElementById(elementId).innerHTML);
}

function listSlicersForAllElements() {
  var spanIds = ['slicerList'];
  for(j=0;j<spanIds.length;j++) {
    listSlicers(spanIds[j]);
  }
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "1841734" : decodeURIComponent(results[1].replace(/\+/g, " "));
}