/* List containing the more structured ojects */
let resultList = [];

/* Object containing info about a person */
function person(name, alk, veggie){
  this.name = name;
  this.alk = alk;
  this.veggie = veggie;
  this.starter = null;
  this.main = null;
  this.dessert = null;
  this.uuid = crypto.randomUUID();
  this.nameWithProperties = function() {
    let result = this.name;
    if (this.veggie) {
      result += '&#129367';
    }else{
      result += '&#127831';
    }
   
    if (this.alk) {
      result += '&#127863';
    }else{
      result += '&#129371';
    }
    return result;
  };
}

/* Object containing info about a house */
function houseWithPeople(address, person1, person2){
  this.address = address;
  this.person1 = person1;
  this.person2 = person2;
}

/* Take the human editable list and put it into a more data-freindly list */
function createResultList(household){
  let tempperson1 = household.person1;
  let tempperson2 = household.person2;
  let person1 = new person(tempperson1.name,tempperson1.alk,tempperson1.veggie);
  let person2 = new person(tempperson2.name,tempperson2.alk,tempperson2.veggie);
  let house = new houseWithPeople(household.address, person1, person2);
  resultList.push(house);
}
 /* Also add all participants on the page */
function fillGroupList(participants){
  participants.forEach(createResultList);
  resultList.forEach(addGroupToList);
}

function addGroupToList(newGroup){
  var groupTable = document.getElementById("group-table");
  var addressRow = groupTable.insertRow();
  var addressCell = addressRow.insertCell(0);
  var person1Cell = addressRow.insertCell(1);
  addressCell.style.textAlign = "left";
  person1Cell.style.textAlign = "left";
  addressCell.innerHTML = newGroup.address;
  person1Cell.innerHTML = newGroup.person1.nameWithProperties();
  var personRow = groupTable.insertRow();
  var emptyCell = personRow.insertCell(0);
  var person2Cell = personRow.insertCell(1);
  person2Cell.style.textAlign = "left";
  emptyCell.innerHTML = "";
  person2Cell.innerHTML = newGroup.person2.nameWithProperties();
}

function generateColumn(participants, offset){
  let result = [];
  let guests = [];
  for (let i = 0; i < participants.length; i++){
    if ((i + offset) % 3 == 0) {
      item = { host: participants[i], guests: [] }
      result.push(item);
    } else {
      guests.push(participants[i].person1);
      guests.push(participants[i].person2);
    }
  }

  guests.sort(function(){return 0.5 - Math.random()}); 

//Are there enough hosts for the guests?
  if ((participants.length / 3) > result.length){
    result.push({host: {address: "Monsterhouse", person1: {name: "Fiesfratze",veggie: false}, person2: { name: "Glubschmarie",  veggie: false}}, guests: []});
  }

  for (let i = 0; i < result.length; i++){
    for (let k = 0; k < 4; k++){
      if (guests.length > 0) {
        result[i].guests.push(guests.pop());
      }
    }
  }
  
  return result;  
}

function cellContent(party){
  let address = "<h3>" + party.host.address + "</h3>";
  let hosts = "<b>" + party.host.person1.name + "<br>" + party.host.person2.name + "<br></b>";
  let guests = "";
  for (g=0; g < party.guests.length; g++){
    guests = guests + party.guests[g].name;
    if (g < party.guests,length - 1){
      guests = guests + "<br>";
    }
  }
  return address + hosts + guests;
}

function generateHostinfo(partyList, course){
  let result = course + ",";
  let numberOfVeggie;
  let numberOfnonAlk;
  for (i = 0; i < partyList.length; i++) {
   result += partyList[i].host.address + ",";
   result += partyList[i].host.person1.name + ",";
   result += partyList[i].host.person2.name + ",";
   result += partyList[i].guests.length + ",";
   numberOfVeggie = 0;
   numberOfNonAlk = 0;
   for (k = 0; k < partyList[i].guests.length; k++) {
     if (partyList[i].guests[k].veggie) numberOfVeggie++;
     if (!partyList[i].guests[k].alk) numberOfNonAlk++;
   }
   result += numberOfVeggie + ",";
   result += numberOfNonAlk + "\n";
  }
  return result;
}


function generateResults(participants){
  participants.sort(function(){return 0.5 - Math.random()}); 
  let starterList = generateColumn(participants,0);
  let mainList = generateColumn(participants,1);
  let dessertList = generateColumn(participants,2);
  
  var groupTable = document.getElementById("result-table");
  groupTable.innerHTML = '';
  
  for (i = 0; i < starterList.length; i++) {
    let newRow = groupTable.insertRow();
    let starterCell = newRow.insertCell(0);
    let mainCell = newRow.insertCell(1);
    let dessertCell = newRow.insertCell(2);
    starterCell.innerHTML = cellContent(starterList[i]);
    mainCell.innerHTML =  cellContent(mainList[i]);
    dessertCell.innerHTML = cellContent(dessertList[i]);
  }
  
//Generate Hostinfo
  let allHostsCSV = "course,address,host1,host2,numberOfGuests,numberOfVegetarians,numberOfNonAlk\n";
   allHostsCSV += generateHostinfo(starterList, "starter");
   allHostsCSV += generateHostinfo(mainList, "main");
   allHostsCSV += generateHostinfo(dessertList, "dessert");


}


