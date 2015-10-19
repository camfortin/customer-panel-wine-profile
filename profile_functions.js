
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