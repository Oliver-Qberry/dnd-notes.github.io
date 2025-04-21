const mainDiv = document.querySelector('.information');

var charactersDiv;
var inventoryDiv;
var sessionsDiv;

var charactersSection;
var itemsSection;
var sessionsSection;

var addCharactersButton;
var addInventoryButton;
var addSessionButton;

const modalOuter = document.querySelector('.modal-outer');
const modalInner = document.querySelector('.modal-inner');

var currentCampaign;
var campaigns = [];

var characters = [];
var inventory = [];
var sessionNotes = [];

function saveData(){
    localStorage.setItem(`campaigns`, JSON.stringify(campaigns));
    localStorage.setItem(`${currentCampaign}characters`, JSON.stringify(characters));
    localStorage.setItem(`${currentCampaign}inventory`, JSON.stringify(inventory));
    localStorage.setItem(`${currentCampaign}sessionNotes`, JSON.stringify(sessionNotes));
}

function loadCampaigns(){
    campaigns = JSON.parse(localStorage.getItem('campaigns' || []));

}

function loadData(){
    //add campaign name
    characters = JSON.parse(localStorage.getItem(`${currentCampaign}characters`)) || [];
    inventory = JSON.parse(localStorage.getItem(`${currentCampaign}inventory`)) || [];
    sessionNotes = JSON.parse(localStorage.getItem(`${currentCampaign}sessionNotes`)) || [];

    displayCharacters();
    displayItems();
    displaySessions();
}

function openCampaign(){
    mainDiv.innerHTML = `<div class="wrapper characters">
            <div class="header">
                <h1>Characters</h1>
                <button class="addCharacter" onclick="addCharacterButtonClick()"><svg xmlns="http://www.w3.org/2000/svg"
                        height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                        <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                    </svg></button>
            </div>
            <div calss="wrapper" id="charactersSection"></div>
        </div>
        <div class="wrapper sessions">
            <div class="header">
                <h1>Session notes</h1>
                <button class="addSession" onclick="addSessionButtonClick()"><svg xmlns="http://www.w3.org/2000/svg"
                        height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                        <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                    </svg></button>
            </div>
            <div calss="wrapper" id="sessionsSection"></div>
        </div>
        <div class="wrapper inventory">
            <div class="header">
                <h1>Party Inventory</h1>
                <button class="addInventory" onclick="addItemButtonClick()"><svg xmlns="http://www.w3.org/2000/svg"
                        height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                        <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                    </svg></button>
            </div>
            <div calss="wrapper" id="itemsSection"></div>
        </div>`;

    charactersDiv = document.querySelector('.characters');
    inventoryDiv = document.querySelector('.inventory');
    sessionsDiv = document.querySelector('.sessions');

    charactersSection = document.getElementById('charactersSection');
    itemsSection = document.getElementById('itemsSection');
    sessionsSection = document.getElementById('sessionsSection');

    addCharactersButton = document.querySelector(".addCharacter");
    addInventoryButton = document.querySelector(".addInventory");
    addSessionButton = document.querySelector(".addSession");

    loadData();
}

function findCharacter(name){
    let index = characters.findIndex(c => c.name === name);
    if(index === -1){
        console.log(`Character ${name} couldn't be found`);
    }
    return index;
}
function findItem(name){
    let index = inventory.findIndex(i => i.name === name);
    if(index === -1){
        console.log(`Item ${name} couldn't be found`);
    }
    return index;
}
function findSession(number){
    let index = sessionNotes.findIndex(s => s.number === number);
    if(index === -1){
        console.log(`Session ${number} couldn't be found`);
    }
    return index;
}

function confirmDelete(type, identifier) {
    let confirmMessage = `Are you sure you want to delete this ${type}?`;
    if (confirm(confirmMessage)) {
        deleteItem(type, identifier);
    }
}

function deleteItem(type, identifier) {
    if (type === 'character') {
        let index = findCharacter(identifier);
        if (index !== -1) {
            characters.splice(index, 1);
            saveData();
            displayCharacters();
        }
    } else if (type === 'item') {
        let index = findItem(identifier);
        if (index !== -1) {
            inventory.splice(index, 1);
            saveData();
            displayItems();
        }
    } else if (type === 'session') {
        let index = findSession(identifier);
        if (index !== -1) {
            sessionNotes.splice(index, 1);
            saveData();
            displaySessions();
        }
    }
}




function displayCharacters() {
    charactersSection.innerHTML = '';
    for (let c = 0; c < characters.length; c++) {
        charactersSection.innerHTML += `
            <div class="character-wrapper wrapper">
                <h2 onclick="openCharacter('${characters[c].name}')">${characters[c].name} - ${characters[c].affiliation}</h2>
                <button class="delete" onclick="confirmDelete('character', '${characters[c].name}')">X</button>
            </div>`;
    }
}



function displayItems() {
    itemsSection.innerHTML = '';
    for (let i = 0; i < inventory.length; i++) {
        itemsSection.innerHTML += `
            <div class="item-wrapper wrapper">
                <h2 onclick="openItem('${inventory[i].name}')">${inventory[i].name} - ${inventory[i].quantity}X</h2>
                <button class="delete" onclick="confirmDelete('item', '${inventory[i].name}')">X</button>
            </div>`;
    }
}





function displaySessions() {
    sessionsSection.innerHTML = '';
    for (let s = 0; s < sessionNotes.length; s++) {
        sessionsSection.innerHTML += `
            <div class="wrapper">
                <h2 onclick="openSession('${sessionNotes[s].number}')">Session ${sessionNotes[s].number} - ${sessionNotes[s].date}</h2>
                <button class="delete" onclick="confirmDelete('session', '${sessionNotes[s].number}')">X</button>
            </div>`;
    }
}


function closeModal() {
    modalOuter.classList.remove('open');
    if(document.querySelector('.currentCharacterNotesInput')){
        characters[findCharacter(document.querySelector('.displayName').textContent.replace(/ - .*/, ''))].notes = document.querySelector('.currentCharacterNotesInput').value;

        characters[findCharacter(document.querySelector('.displayName').textContent.replace(/ - .*/, ''))].health = document.querySelector('.currentCharacterHealthInput').value;
        saveData();
        displayCharacters();
    }
    else if(document.querySelector('.currentItemNotesInput')){
        inventory[findItem(document.querySelector('.displayName').textContent.replace(/ - \d+X$/, ''))].notes = document.querySelector('.currentItemNotesInput').value;
        saveData();
        displayItems();
    }
    else if(document.querySelector('.currentSessionNotesInput')){
        sessionNotes[findSession(document.querySelector('.displayName').textContent.split(' ')[1])].notes = document.querySelector('.currentSessionNotesInput').value;
        saveData();
        displaySessions();
    }
}
function openModal(){
    modalOuter.classList.add("open");
}


function openCharacter(name){
    let currentCharacter = characters[findCharacter(name)];
    //console.log(`displaying ${characters[findCharacter(name)].name}`);
    openModal();
    modalInner.innerHTML = `<h2 class="displayName">${currentCharacter.name} - ${currentCharacter.race} ${currentCharacter.class}</h2>
        <h3>${currentCharacter.affiliation}</h3>
        <input class="currentCharacterHealthInput"></h3><h3> HP</h3>
        <textarea placeholder="Notes" class="currentCharacterNotesInput"></textarea>`;
    document.querySelector('.currentCharacterHealthInput').value = currentCharacter.health;
    document.querySelector('.currentCharacterNotesInput').value = currentCharacter.notes;
}
function openItem(name){
    let currentItem = inventory[findItem(name)];
    //console.log(`displaying ${characters[findCharacter(name)].name}`);
    openModal();
    modalInner.innerHTML = `<h2 class="displayName">${currentItem.name} - ${currentItem.quantity}X</h2>
        <textarea placeholder="Notes" class="currentItemNotesInput"></textarea>`;
    document.querySelector('.currentItemNotesInput').value = currentItem.notes;
}

function openSession(number){
    let currentSession = sessionNotes[findSession(number)];
    //console.log(`displaying ${characters[findCharacter(name)].name}`);
    openModal();
    modalInner.innerHTML = `<h2 class="displayName">Session ${currentSession.number}</h2>
        <h3>${currentSession.date}</h3>
        <textarea placeholder="Notes" class="currentSessionNotesInput"></textarea>`;
    document.querySelector('.currentSessionNotesInput').value = currentSession.notes;
}

function createCharacter(){
    var selectedAffiliation = document.getElementById("characterAffiliationInput")
    var name = document.querySelector('.characterNameInput').value;
    characters.push({
        name : name,
        race : document.querySelector('.characterRaceInput').value,
        class : document.querySelector('.characterClassInput').value,
        health : document.querySelector('.characterHealthInput').value,
        affiliation : selectedAffiliation.value,
        notes : document.querySelector('.characterNotesInput').value
    });
    saveData();
    closeModal();
    displayCharacters();
}
function createItem(){
    var name = document.querySelector('.itemNameInput').value;
    inventory.push({
        name : name,
        quantity : document.querySelector('.itemQuantityInput').value,
        notes : document.querySelector('.itemNotesInput').value
    });
    saveData();
    closeModal();
    displayItems();
}

function createSession(){
    var number = document.querySelector('.sessionNumberInput').value;
    sessionNotes.push({
        number : number,
        date : document.querySelector('.sessionDateInput').value,
        notes : document.querySelector('.sessionNotesInput').value
    });
    saveData();
    closeModal();
    displaySessions();
}

function addCharacterButtonClick(){
    //set the model, with save button us onclick
    console.log("Starting new Character");
    openModal();
    modalInner.innerHTML = `<input type="string" placeholder="Name" class="characterNameInput">
            <label for="affiliations">Select the characters affiliation to you:</label>
            <select name="affiliations" id="characterAffiliationInput">
                <option value="">Select Affiliation</option>
                <option value="Player">Player</option>
                <option value="Enemy">Enemy</option>
                <option value="Ally">Ally</option>
                <option value="Other">Other</option>
            </select>
            <input type="string" placeholder="Race" class="characterRaceInput">
            <input type="string" placeholder="Class" class="characterClassInput">
            <input type="int" placeholder="Health" class="characterHealthInput">
            <input type="string" placeholder="Notes" class="characterNotesInput">
            <button onclick="createCharacter()">Create Character</button>`;
}

function addItemButtonClick(){
    //set the model, with save button us onclick
    console.log("Starting new inventory item");
    openModal();
    //set what info i want
    modalInner.innerHTML = `<input type="string" placeholder="Name" class="itemNameInput">
            <input type="int" placeholder="Quantity" class="itemQuantityInput" inputmode="numeric">
            <input type="string" placeholder="Notes" class="itemNotesInput">
            <button onclick="createItem()">Create Item</button>`; //create item
}

function addSessionButtonClick(){
    //set the model, with save button us onclick
    console.log("Starting new session note");
    openModal();
    //set what info i want
    modalInner.innerHTML = `<input type="string" placeholder="Number" class="sessionNumberInput">
            <input type="string" placeholder="Date" class="sessionDateInput">
            <textarea placeholder="Notes" class="sessionNotesInput"></textarea>
            <button onclick="createSession()">Create Session</button>`; //create session
}

function setCampaign(){
    currentCampaign = document.getElementById('campaignInput').value;
    if(currentCampaign == "Select Campaign" || currentCampaign == "" || currentCampaign === null || currentCampaign === undefined){
        currentCampaign = campaigns[0];
        openCampaign();
        if(currentCampaign == "Select Campaign" || currentCampaign == "" || currentCampaign === null || currentCampaign === undefined){
            console.log('No vaild campaign to open, please create one');
        }

        console.log(document.getElementById('campaignId').textContent);
    }
    else{
        openCampaign();
    }
}

function createCampaign(){
    console.log("Creating new campaign");
    currentCampaign = document.querySelector('.campaignNameInput').value;
    campaigns.push(currentCampaign);

    mainDiv.innerHTML = `<div class="wrapper characters">
            <div class="header">
                <h1>Characters</h1>
                <button class="addCharacter" onclick="addCharacterButtonClick()"><svg xmlns="http://www.w3.org/2000/svg"
                        height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                        <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                    </svg></button>
            </div>
            <div calss="wrapper" id="charactersSection"></div>
        </div>
        <div class="wrapper sessions">
            <div class="header">
                <h1>Session notes</h1>
                <button class="addSession" onclick="addSessionButtonClick()"><svg xmlns="http://www.w3.org/2000/svg"
                        height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                        <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                    </svg></button>
            </div>
            <div calss="wrapper" id="sessionsSection"></div>
        </div>
        <div class="wrapper inventory">
            <div class="header">
                <h1>Party Inventory</h1>
                <button class="addInventory" onclick="addItemButtonClick()"><svg xmlns="http://www.w3.org/2000/svg"
                        height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                        <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                    </svg></button>
            </div>
            <div calss="wrapper" id="itemsSection"></div>
        </div>`;

    charactersDiv = document.querySelector('.characters');
    inventoryDiv = document.querySelector('.inventory');
    sessionsDiv = document.querySelector('.sessions');

    charactersSection = document.getElementById('charactersSection');
    itemsSection = document.getElementById('itemsSection');
    sessionsSection = document.getElementById('sessionsSection');

    addCharactersButton = document.querySelector(".addCharacter");
    addInventoryButton = document.querySelector(".addInventory");
    addSessionButton = document.querySelector(".addSession");

}

window.onload = function(){
    loadCampaigns();
    var selectHtml = `<div class="wrapper openCampaign">
    <h1>Open Campaign</h1>
    <select id="campaignInput">
    <option value="Select Campaign">Select Campaign</option>`;
    for(let c = 0; c < campaigns.length; c++){
        selectHtml += `<option value="${campaigns[c]}">${campaigns[c]}</option>`;
    }
    selectHtml +=`</select>
    <input type="text" id="campaignId"></input>
    <button onclick="setCampaign()">Open</button>
    </div>
    <div class="wrapper createCampaign">
    <h1>Create Campaign</h1>
    <input placeholder="name" class="campaignNameInput">
    <button onclick="createCampaign()">Create</button>
    </div>`;
    mainDiv.innerHTML = selectHtml;
}

modalOuter.addEventListener('click', (event) => {
    const isOutside = !event.target.closest('.modal-inner');
    if (isOutside) {
      closeModal();
    }
});

document.addEventListener('input', function (event) {
    if (event.target.classList.contains('characterNotesInput')) {
        event.target.style.height = 'auto'; // Reset height
        event.target.style.height = event.target.scrollHeight + 'px'; // Expand to fit content
    }
});
