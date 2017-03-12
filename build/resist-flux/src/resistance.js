"use strict";
let locationData = require("../data/zipcode-locations"); // import location dictionary
let geolib = require('geolib'); // import geolib module
// a skeleton class that has a name field and getName() method.
class Subject {
    constructor(name) {
        this.name = name;
    }
    ;
    getName() {
        return this.name;
    }
}
// a location class that stores and manages information about a certain subject
class Location {
    // pass in a zip string to construct a location
    constructor(locationZip) {
        this.locationZip = locationZip;
    }
    // return an array rtepresentatio of the geo location
    getGeo() {
        return locationData[this.locationZip];
    }
    // take in a database and a distance
    // return an array of elements from the databae, 
    // of which locations are in the distance range of this location
    getNearBy(database, distance) {
        return database.filter((elementSearched) => {
            let userLoc = elementSearched.getGeoLocation();
            let distance_diff = geolib.getDistance({ latitude: userLoc[0], longitude: userLoc[1] }, { latitude: this.getGeo()[0], longitude: this.getGeo()[1] });
            return distance_diff <= distance;
        });
    }
}
class Protester extends Subject {
    constructor(name, email, location) {
        super(name);
        this.email = email;
        this.location = new Location(location);
    }
    getEmail() {
        return this.email;
    }
    getGeoLocation() {
        return this.location.getGeo();
    }
}
class Protest extends Subject {
    constructor(name, location, date) {
        super(name);
        this.date = date;
        this.participants = new Array();
        this.location = new Location(location);
    }
    addParticipant(name) {
        if (!this.participants.includes(name))
            this.participants.push(name);
    }
    getParticipants() {
        return this.participants;
    }
    getGeoLocation() {
        return this.location.getGeo();
    }
    getNearBy(database, distance) {
        return this.location.getNearBy(database, distance);
    }
    resetInfo(newTitle, newTime) {
        this.name = newTitle;
        this.date = newTime;
    }
}
class Movement extends Subject {
    constructor(name) {
        super(name);
        this.protests = new Array();
    }
    addProtest(name) {
        if (!this.protests.includes(name))
            this.protests.push(name);
    }
    getProtests() {
        return this.protests;
    }
}
class ResistanceManager {
    constructor() {
        this.protester_database = new Array();
        this.protest_database = new Array();
        this.movement_database = new Array();
    }
    addMember(name, email, location) {
        if (this.find(this.protester_database, name) == undefined)
            this.protester_database.push(new Protester(name, email, location));
        return name;
    }
    addProtest(newProtestName, location, date) {
        if (this.find(this.protest_database, newProtestName) == undefined)
            this.protest_database.push(new Protest(newProtestName, location, date));
        return newProtestName;
    }
    addMovement(newMovementName) {
        if (this.find(this.movement_database, newMovementName) == undefined)
            this.movement_database.push(new Movement(newMovementName));
        return newMovementName;
    }
    addMemberToProtest(memberName, protestName) {
        this.find(this.protest_database, protestName).addParticipant(memberName);
    }
    findMemberNames(quary) {
        return this.search(this.protester_database, quary);
    }
    findProtestNames(quary) {
        return this.search(this.protest_database, quary);
    }
    findMovementNames(quary) {
        return this.search(this.movement_database, quary);
    }
    modifyProtest(protestName, newTitle, newTime) {
        this.find(this.protest_database, protestName).resetInfo(newTitle, newTime);
    }
    addProtestToMovement(protestName, movementName) {
        this.find(this.movement_database, movementName).addProtest(protestName);
    }
    // find an array of emails of the protesters involved in the given protestName
    getProtesters(protestName) {
        let protest = this.find(this.protest_database, protestName);
        if (protest) {
            return protest.getParticipants()
                .map((participant) => {
                return participant + ": " + this.find(this.protester_database, participant).getEmail();
            });
        }
        return null;
    }
    // find an array of emails of the registered users within a distance range of a particular geoLocation
    getUsersNearProtest(protestName, distance) {
        let protesters = this.find(this.protest_database, protestName).getNearBy(this.protester_database, distance * 1609.34);
        if (protesters)
            return protesters.map((protester) => protester.getName() + ": " + protester.getEmail());
        return null;
    }
    // find an array of all protests and its movement(s) within a distance range of a particular location data
    getNearbyProtests(location, distance) {
        let thisLoc = new Location(location);
        let protests = thisLoc.getNearBy(this.protest_database, distance * 1609.34);
        if (protests) {
            return protests.map((protest) => {
                let protestName = protest.getName();
                return protestName + `(movements: ${this.findMovement(protestName).join(", ")})`;
            });
        }
        return null;
    }
    // find an array of nation-wide movement(s) that the given protestName is part of
    findMovement(protestName) {
        return this.movement_database.filter((movement) => {
            let protests = movement.getProtests();
            return protests.includes(protestName);
        })
            .map((movement) => movement.getName());
    }
    // search and return an array of elements from the database,
    // of which names contain the quary (case insensitive)
    search(database, quary) {
        return database
            .filter((elementSearched) => {
            return elementSearched.getName().toLowerCase()
                .includes(quary.toLowerCase());
        })
            .map((protester) => protester.getName());
    }
    // find and return the element from the database, of which name matches the quary
    find(database, quary) {
        return database
            .find((elementSearched) => elementSearched.getName() == quary);
    }
}
exports.ResistanceManager = ResistanceManager;
