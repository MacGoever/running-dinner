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
  this.nextCourse = function(currentCourse) {
    return currentCourse == "Starter" ? "Main" : "Dessert"; 
  }
  this.nextAddress = function(currentCourse) {
    return currentCourse == "Starter" ? this.main.address : this.dessert.address; 
  }
}

/* Object containing info about a house */
function houseWithPeople(address, person1, person2){
  this.address = address;
  this.person1 = person1;
  this.person2 = person2;
  this.uuid = crypto.randomUUID();
  this.role = null;
  this.guests = [];
  this.setMain = function() {
    this.role = "Main";
    this.person1.main = "host";
    this.person2.main = "host";
  };
  this.setStarter = function() {
    this.role = "Starter";
    this.person1.starter = "host";
    this.person2.starter = "host";
  };
  this.setDessert = function() {
    this.role = "Dessert";
    this.person1.dessert = "host";
    this.person2.dessert = "host";
  };
  this.getPersons = function() {
    return [this.person1, this.person2];
  };
  this.addGuest = function(guest) {
    switch (this.role){
      case ("Starter"):
        guest.starter = this;
      break;
      case ("Main"):
        guest.main = this;
      break;
      case ("Dessert"):
        guest.dessert = this;
      break;
    }
    this.guests.push(guest);
  };
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

/*Generate a random mapping for the guests and display it.
 * Also create a meshed datastructure to make additional output more easy. */
function generateResults(){
  participants.forEach(createResultList);
  resultList.sort(function(){return 0.5 - Math.random()}); 
  let starterGuests = [];
  let mainGuests = [];
  let dessertGuests = [];
  for (let i = 0; i < resultList.length; i++){
    switch (i % 3){
      case (0):
        starterGuests = starterGuests.concat( resultList[i].getPersons() );
        resultList[i].setMain();			//Assign roles to houses, Main first, so main courses are assigned even if the number of hosts cannot be devided by 3
        dessertGuests = dessertGuests.concat( resultList[i].getPersons() );  //collect the host into lists to assign them as guests later on
      break;
      case (1):
        resultList[i].setStarter();
        mainGuests = mainGuests.concat(resultList[i].getPersons());
        dessertGuests = dessertGuests.concat(resultList[i].getPersons());
      break;
      case (2):
        starterGuests = starterGuests.concat(resultList[i].getPersons());
        mainGuests = mainGuests.concat(resultList[i].getPersons());
        resultList[i].setDessert();
      break;
    }
  }

  starterGuests.sort(function(){return 0.5 - Math.random()});	//shuffle the guests
  mainGuests.sort(function(){return 0.5 - Math.random()});
  dessertGuests.sort(function(){return 0.5 - Math.random()});

  let loopLength = Math.max(starterGuests.length, mainGuests.length, dessertGuests.length);
  let tempGuests = []; 
  let i = 0;

  while (loopLength > 0){			//assign guests to houses and make them reference each other
    index = i % resultList.length;
    switch (resultList[index].role){
      case ("Main"):
        tempGuests = mainGuests;
      break;
      case ("Starter"):
        tempGuests = starterGuests;
      break;
      case ("Dessert"):
        tempGuests = dessertGuests;
      break;
    }
    if (tempGuests.length > 0) {
      resultList[index].addGuest(tempGuests.pop());
    }
    loopLength = Math.max(starterGuests.length, mainGuests.length, dessertGuests.length);
    i++;
  }

  var groupTable = document.getElementById("result-table");
  groupTable.innerHTML = '';


  let newRow = groupTable.insertRow();
  let starterCell = newRow.insertCell(0);
  let mainCell = newRow.insertCell(1);
  let dessertCell = newRow.insertCell(2);

  for (i = 0; i < resultList.length; i++ ) {
    if ( i % 3 == 0) {
      newRow = groupTable.insertRow();
      starterCell = newRow.insertCell(0);
      mainCell = newRow.insertCell(1);
      dessertCell = newRow.insertCell(2);
    }
    switch (resultList[i].role){
      case ("Starter"):
        starterCell.innerHTML = cellContent(resultList[i]);
      break;
      case ("Main"):
        mainCell.innerHTML = cellContent(resultList[i]);
      break;
      case ("Dessert"):
        dessertCell.innerHTML = cellContent(resultList[i]);
      break;
    }
  }
  let buttonRow = groupTable.insertRow();

  let hostCell = buttonRow.insertCell(0);
  hostCell.innerHTML = "<div id=\"host-button\">\n<button type=\"button\" class=\"btn btn-primary\" onclick=\"downloadBlob(generateHostInfo(),'hostinfo.csv','text/csv;charset=utf-8;')\">Generate Hostinfo</button>\n</div>";

  let guestCell = buttonRow.insertCell(1);
  guestCell.innerHTML = "<div id=\"host-button\">\n<button type=\"button\" class=\"btn btn-primary\" onclick=\"downloadBlob(generateGuestInfo(),'guestinfo.csv','text/csv;charset=utf-8;')\">Generate Guestinfo</button>\n</div>";
}
  
function cellContent(party){
  let address = "<h3>" + party.address + "</h3>";
  let hosts = "<b>" + party.person1.nameWithProperties() + "<br>" + party.person2.nameWithProperties() + "<br></b>";
  let guests = "";
  for (g=0; g < party.guests.length; g++){
    guests = guests + party.guests[g].nameWithProperties();
    if (g < party.guests,length - 1){
      guests = guests + "<br>";
    }
  }
  return address + hosts + guests;
}

function downloadBlob(content, filename, contentType) {
  // Create a blob
  var blob = new Blob([content], { type: contentType });
  var url = URL.createObjectURL(blob);
  
  // Create a link to download it
  var pom = document.createElement('a');
  pom.href = url;
  pom.setAttribute('download', filename);
  pom.click();
  }

function generateGuestInfo(){
  let guestsCSV = "name,currentAddress,currentCourse,nextAddress,nextCourse\n";
  for (i = 0; i < resultList.length; i++) {

//All guests for Starter
   if (resultList[i].role != "Starter") {
     guestsCSV += resultList[i].person1.name + ",";
     guestsCSV += resultList[i].address + ",";
     guestsCSV += "Home" + ",";
     guestsCSV += resultList[i].person1.starter.address + ",";
     guestsCSV += "Starter" + "\n";

     guestsCSV += resultList[i].person2.name + ",";
     guestsCSV += resultList[i].address + ",";
     guestsCSV += "Home" + ",";
     guestsCSV += resultList[i].person2.starter.address + ",";
     guestsCSV += "Starter" + "\n";
   }

//All other moves
   if (resultList[i].role != "Dessert") {
     guestsCSV += resultList[i].person1.name + ",";
     guestsCSV += resultList[i].address + ",";
     guestsCSV += resultList[i].role + ",";
     guestsCSV += resultList[i].person1.nextAddress(resultList[i].role) + ",";
     guestsCSV += resultList[i].person1.nextCourse(resultList[i].role) + "\n";

     guestsCSV += resultList[i].person2.name + ",";
     guestsCSV += resultList[i].address + ",";
     guestsCSV += resultList[i].role + ",";
     guestsCSV += resultList[i].person2.nextAddress(resultList[i].role) + ",";
     guestsCSV += resultList[i].person2.nextCourse(resultList[i].role) + "\n";

     for (k = 0; k < resultList[i].guests.length; k++) {
       guestsCSV += resultList[i].guests[k].name + ",";
       guestsCSV += resultList[i].address + ",";
       guestsCSV += resultList[i].role + ",";
       guestsCSV += resultList[i].guests[k].nextAddress(resultList[i].role) + ",";
       guestsCSV += resultList[i].guests[k].nextCourse(resultList[i].role) + "\n";
     }
   }
  }
  return guestsCSV;
}

function generateHostInfo(){
  let allHostsCSV = "course,address,host1,host2,numberOfGuests,numberOfVegetarians,numberOfNonAlk\n";
  let numberOfVeggie;
  let numberOfnonAlk;
  for (i = 0; i < resultList.length; i++) {
   allHostsCSV += resultList[i].role + ",";
   allHostsCSV += resultList[i].address + ",";
   allHostsCSV += resultList[i].person1.name + ",";
   allHostsCSV += resultList[i].person2.name + ",";
   allHostsCSV += resultList[i].guests.length + ",";
   numberOfVeggie = 0;
   numberOfNonAlk = 0;
   for (k = 0; k < resultList[i].guests.length; k++) {
     if (resultList[i].guests[k].veggie) numberOfVeggie++;
     if (!resultList[i].guests[k].alk) numberOfNonAlk++;
   }
   allHostsCSV += numberOfVeggie + ",";
   allHostsCSV += numberOfNonAlk + "\n";
  }
  return allHostsCSV;
}


