"use strict";
let readlineSync = require('readline-sync');
const resistance_1 = require("./resistance");
function start() {
    showMainMenu(new resistance_1.ResistanceManager());
}
exports.start = start;
function showMainMenu(rm) {
    while (true) {
        console.log(`Welcome to the Resistance! Pick an option:
  1. Register a new member
  2. Register a new protest
  3. Register a new movement
  4. Add a member to a protest
  5. Modify a protest
  6. Add a protest to a movement
  7. List protest members
  8. List members near a protest
  9. List protests near a location
  10. Exit`);
        let response = readlineSync.question('> ');
        if (response === '10' || response.slice(0, 2).toLowerCase() === ':q') {
            break;
        }
        switch (response) {
            case '1':
                showNewMemberMenu(rm);
                break;
            case '2':
                showNewProtestMenu(rm);
                break;
            case '3':
                showNewMovementMenu(rm);
                break;
            case '4':
                showAddToProtestMenu(rm);
                break;
            case '5':
                showModifyProtestMenu(rm);
                break;
            case '6':
                showAddToMovementMenu(rm);
                break;
            case '7':
                showListProtestersMenu(rm);
                break;
            case '8':
                showListNearbyMembersMenu(rm);
                break;
            case '9':
                showListNearbyProtestsMenu(rm);
                break;
            default: console.log('Invalid option!');
        }
        console.log('');
    }
}
function showNewMemberMenu(rm) {
    console.log('Add a new member.');
    let name = readlineSync.question('  Name: ');
    let email = readlineSync.question('  Email: ');
    let zip = readlineSync.question('  Zip Code: ');
    rm.addMember(name, email, zip);
    console.log('User added!');
}
function showNewProtestMenu(rm) {
    console.log('Add a new protest.');
    let newProtestName = readlineSync.question('  Title of protest: ');
    let zipcode = readlineSync.question('  Location (zip code): ');
    let date = readlineSync.question('  Date and time (ex: Jan 21 2017 13:00 PST): ');
    let protestName = rm.addProtest(newProtestName, zipcode, date);
    showAddToProtestMenu(rm, protestName);
}
function showNewMovementMenu(rm) {
    console.log('Add a new movement.');
    let newMovementName = readlineSync.question('  Title of movement: ');
    let movementName = rm.addMovement(newMovementName);
    let adding = readlineSync.question('Add protests to movement? (y/n): ');
    while (adding.toLowerCase().startsWith('y')) {
        showAddToMovementMenu(rm, movementName);
        adding = readlineSync.question('Add another protest? (y/n): ');
    }
}
function showAddToProtestMenu(rm, protestName) {
    if (!protestName) {
        protestName = showSearchProtestsMenu(rm);
        if (!protestName) {
            return;
        }
    }
    let adding = readlineSync.question('Add a member to protest? (y/n): ');
    while (adding.toLowerCase().startsWith('y')) {
        let memberName = showSearchMembersMenu(rm);
        if (memberName) {
            rm.addMemberToProtest(memberName, protestName);
        }
        else {
            console.log('No member selected.');
        }
        adding = readlineSync.question('Add another member? (y/n): ');
    }
}
function showSearchMembersMenu(rm) {
    return _searchListMenu('member', (q) => rm.findMemberNames(q));
}
function showSearchProtestsMenu(rm) {
    return _searchListMenu('protest', (q) => rm.findProtestNames(q));
}
function showSearchMovementsMenu(rm) {
    return _searchListMenu('movement', (q) => rm.findMovementNames(q));
}
function _searchListMenu(type, searchCallback) {
    console.log(`Searching for a ${type}.`);
    let query = readlineSync.question('Search query: ');
    let results = searchCallback(query);
    if (results.length > 0) {
        console.log('Results found: ');
        let resultsDisplay = '  ' + (results.map((item, idx) => `${idx + 1}. ${item}`).join('\n  '));
        console.log(resultsDisplay);
        let choiceIdx = parseInt(readlineSync.question(`Choose a ${type} (1-${results.length}): `));
        return results[choiceIdx - 1];
    }
    else {
        console.log('No results found.');
        return undefined;
    }
}
function showModifyProtestMenu(rm, protestName) {
    if (!protestName) {
        protestName = showSearchProtestsMenu(rm);
        if (!protestName) {
            return;
        }
    }
    while (true) {
        console.log(`Edit protest '${protestName}'.
  1. Change title
  2. Change time
  3. Add to movement
  4. Return to previous menu`);
        let response = parseInt(readlineSync.question('> '));
        if (response == 1) {
            let newTitle = readlineSync.question('  New title: ');
            rm.modifyProtest(protestName, newTitle);
        }
        else if (response == 2) {
            let newTime = readlineSync.question('  New date and time (ex: Jan 21 2017 13:00 PST): ');
            rm.modifyProtest(protestName, undefined, newTime);
        }
        else if (response == 3) {
            showAddToMovementMenu(rm, undefined, protestName);
        }
        else if (response == 4) {
            break;
        }
        else {
            console.log('Invalid option!');
        }
    }
}
function showAddToMovementMenu(rm, movementName, protestName) {
    if (!protestName) {
        protestName = showSearchProtestsMenu(rm);
        if (!protestName) {
            return;
        }
    }
    if (!movementName) {
        movementName = showSearchMovementsMenu(rm);
        if (!movementName) {
            return;
        }
    }
    rm.addProtestToMovement(protestName, movementName);
}
function showListProtestersMenu(rm) {
    let protestName = showSearchProtestsMenu(rm);
    let members = rm.getProtesters(protestName);
    console.log('Members participating in this action:');
    console.log('  ' + members.join('\n  ') + '\n');
    readlineSync.keyInPause('(Press any letter to continue)', { guide: false });
}
function showListNearbyMembersMenu(rm) {
    let protestName = showSearchProtestsMenu(rm);
    const DEFAULT_DISTANCE = 20;
    let distance = parseInt(readlineSync.question(`Distance in miles from protest (default: ${DEFAULT_DISTANCE}): `)) | DEFAULT_DISTANCE;
    let members = rm.getUsersNearProtest(protestName, distance);
    console.log('Members participating in this action:');
    console.log('  ' + members.join('\n  ') + '\n');
    readlineSync.keyInPause('(Press any letter to continue)', { guide: false });
}
function showListNearbyProtestsMenu(rm) {
    let zip = readlineSync.question('Zip code to search near: ');
    const DEFAULT_DISTANCE = 50;
    let distance = parseInt(readlineSync.question(`Distance in miles from protest (default: ${DEFAULT_DISTANCE}): `)) | DEFAULT_DISTANCE;
    let protests = rm.getNearbyProtests(zip, distance);
    console.log('Nearby protests:');
    console.log('  ' + protests.join('\n  ') + '\n');
    readlineSync.keyInPause('(Press any letter to continue)', { guide: false });
}
//# sourceMappingURL=ui.js.map