let fileName;
let xmlDoc;
let mainElement;

function loadXMLDoc() {
    let xhttp = new XMLHttpRequest();
    fileName = document.getElementById("fileName").value;
    let fullFileName = fileName + ".xml";
    alert("Wczytywanie pliku: " + fullFileName);
    xhttp.open("GET", fullFileName, false);
    xhttp.send();
    xmlDoc = xhttp.responseXML;
    mainElement = xmlDoc.getElementsByTagName("tns:Players")[0];
}

function playersInf() {
    var playersTable =
    `<tr>
     <th>ID</th>
     <th>Firstname</th>
     <th>Lastname</th>
     <th>number</th>
     <th>club</th>
     </tr>`;
     var players = xmlDoc.getElementsByTagName("player");
     for (var i = 0; i < players.length; i++) {
        playersTable += "<tr><td>"
        +players[i].getAttribute("id")
        + "</td><td>"
        + players[i].getElementsByTagName("firstName")[0].childNodes[0].nodeValue
        + "</td><td>"
        + players[i].getElementsByTagName("lastName")[0].childNodes[0].nodeValue
        + "</td><td>"
        + players[i].getElementsByTagName("number")[0].childNodes[0].nodeValue
        + "</td><td>"
        + players[i].getElementsByTagName("club")[0].childNodes[0].nodeValue + "</td></tr>";
     }
     document.getElementById("table").innerHTML = playersTable;
}

function addPlayer() {
    let newPlayer = xmlDoc.createElement("player");

    let generatedIid = xmlDoc.getElementsByTagName("player").length + 1;
    let inputFirstName = document.getElementById("firstName").value;
    let inputLastName = document.getElementById("lastName").value;
    let inputNumber = document.getElementById("number").value;
    let inputClub = document.getElementById("club").value;

    let clubElement = xmlDoc.createElement("club");
    let numberElement = xmlDoc.createElement("number");
    let firstNameElement = xmlDoc.createElement("firstName");
    let lastNameElement = xmlDoc.createElement("lastName");

    let clubValue = xmlDoc.createTextNode(inputClub);
    let numberValue = xmlDoc.createTextNode(inputNumber);
    let firstNameValue = xmlDoc.createTextNode(inputFirstName);
    let lastNameValue = xmlDoc.createTextNode(inputLastName);

    firstNameElement.appendChild(firstNameValue);
    lastNameElement.appendChild(lastNameValue);
    numberElement.appendChild(numberValue);
    clubElement.appendChild(clubValue);

    newPlayer.setAttribute("id", generatedIid);
    newPlayer.appendChild(firstNameElement);
    newPlayer.appendChild(lastNameElement);
    newPlayer.appendChild(numberElement);
    newPlayer.appendChild(clubElement);

    validate(newPlayer);
    playersInf();
}

function validate(playerToValidate) {
    if(playerToValidate.getElementsByTagName("firstName")[0].childNodes[0].nodeValue.length < 3
        || playerToValidate.getElementsByTagName("firstName")[0].childNodes[0].nodeValue.length > 15) {
        alert("BLAD SKLADNI; dlugosc imienia musi sie miescic miedzy 3 a 15");
        return;
    }
    if(playerToValidate.getElementsByTagName("lastName")[0].childNodes[0].nodeValue.length < 3
        || playerToValidate.getElementsByTagName("lastName")[0].childNodes[0].nodeValue.length > 15) {
        alert("BLAD SKLADNI; dlugosc nazwiska musi sie miescic miedzy 3 a 15");
        return;
    }
    if(playerToValidate.getElementsByTagName("number")[0].childNodes[0].nodeValue <= 0
        || playerToValidate.getElementsByTagName("number")[0].childNodes[0].nodeValue >= 100) {
        alert("BLAD SKLADNI; numer musi sie miescic miedzy 1 a 99");
        return;
    }
    if(playerToValidate.getElementsByTagName("club")[0].childNodes[0].nodeValue.length < 3
        || playerToValidate.getElementsByTagName("club")[0].childNodes[0].nodeValue.length > 20) {
        alert("BLAD SKLADNI; dlugosc nazwiska musi sie miescic miedzy 3 a 20");
        return;
    }
    mainElement.appendChild(playerToValidate);
    alert("Added new player successfully");
}

function removePlayer(inputIndex) {
    let index = parseInt(inputIndex);
    var players=xmlDoc.getElementsByTagName("player");
    if(inputIndex > players.length) {
        alert("BLAD SKLADNI; nie ma takiego indeksu");
        return;
    }
    let removedPlayer = xmlDoc.getElementsByTagName("player")[index-1];
    mainElement.removeChild(removedPlayer);
    for(var i=0; i<players.length; i++) {
        index = i+1;
        players[i].setAttribute("id", index);
    }
    alert("Removed player number " + [inputIndex] + " successfully");
    playersInf();
}

function editPlayer() {
    let inputId = document.getElementById("id").value;
    let inputFirstName = document.getElementById("firstName").value;
    let inputLastName = document.getElementById("lastName").value;
    let inputNumber = document.getElementById("number").value;
    let inputClub = document.getElementById("club").value;

    let index = parseInt(inputId);
    var players = xmlDoc.getElementsByTagName("player");
    if(inputId > players.length) {
        alert("BLAD SKLADNI; nie ma takiego indeksu");
        return;
    }

    if(inputFirstName != "") {
        xmlDoc.getElementsByTagName("firstName")[index-1].childNodes[0].textContent = inputFirstName;
        playersInf();
    }
    if(inputLastName != "") {
        xmlDoc.getElementsByTagName("lastName")[index-1].childNodes[0].textContent = inputLastName;
        playersInf();
    }
    if(inputNumber != "") {
        xmlDoc.getElementsByTagName("number")[index-1].childNodes[0].textContent = inputNumber;
        playersInf();
    }
    if(inputClub != "") {
        xmlDoc.getElementsByTagName("club")[index-1].childNodes[0].textContent = inputClub;
        playersInf();
    }
    alert("Player successfully edited");
}


function saveFile() {
    const mySerializer = new XMLSerializer();
    const serializedString = `<?xml version="1.0" encoding="UTF-8"?>` + "\n" + mySerializer.serializeToString(mainElement);
    const temporaryFile = new Blob([serializedString], {type: "text/xml"});
    const downloadElement = document.createElement("a");
    downloadElement.href = URL.createObjectURL(temporaryFile);
    downloadElement.download = "players-edited.xml";
    downloadElement.click();
}