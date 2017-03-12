"use strict";
let locationData = require('../data/zipcode-locations'); // import location dictionary
let geolib = require('geolib'); // import geolib module
const action_1 = require("./action");
const events = require("events");
let EventEmitter = events.EventEmitter;
class ProtesterStore extends EventEmitter {
    constructor() {
        super();
        this.protester_database = new Array();
        action_1.AppDispatcher.register((payload) => {
            switch (payload.actionType) {
                case action_1.ToDoActions.ADD_MEMBER:
                    if (find(this.protester_database, payload.data1) == undefined) {
                        this.protester_database.push(new Protester(payload.data1, payload.data2, payload.data3));
                        console.log(this.protester_database);
                        this.emit('change');
                    }
                    break;
                default: console.log("action type invalid");
            }
        });
    }
    getProtesters() {
        return this.protester_database;
    }
}
exports.ProtesterStore = ProtesterStore;
class ProtestStore extends EventEmitter {
    constructor(ps, ms) {
        super();
        this.protest_database = new Array();
        this.protestersStore = ps;
        this.movementStore = ms;
        action_1.AppDispatcher.register((payload) => {
            switch (payload.actionType) {
                case action_1.ToDoActions.ADD_PROTEST:
                    if (find(this.protest_database, payload.data1) == undefined)
                        this.protest_database.push(new Protest(payload.data1, payload.data2, payload.data3));
                    console.log(this.protest_database);
                    this.emit('change');
                    break;
                case action_1.ToDoActions.ADD_MEMBER_TO_PROTEST:
                    find(this.protest_database, payload.data2).addParticipant(payload.data1);
                    break;
                case action_1.ToDoActions.MODIFY_PROTEST:
                    find(this.protest_database, payload.data1).resetInfo(payload.data2, payload.data3);
                    break;
                case action_1.ToDoActions.GET_PROTESTERS:
                    this.currentProtest = find(this.protest_database, payload.data1);
                    break;
                case action_1.ToDoActions.GET_USERS_NEAR_PROTEST:
                    this.currentProtest = find(this.protest_database, payload.data1);
                    // this.currentLocation = new Location(payload.data2);
                    console.log("this.currentLocation = new Location(payload.data1) " +
                        this.currentLocation);
                    this.currentDistance = payload.data2;
                    console.log("distance: " + this.currentDistance);
                    this.emit("showList");
                    break;
                case action_1.ToDoActions.GET_NEARBY_PROTEST:
                    this.currentLocation = new Location(payload.data1);
                    this.currentDistance = payload.data2;
                    this.emit("showNearbyProtest");
                    break;
                default: console.log("action type invalid");
            }
        });
    }
    getProtests() {
        return this.protest_database;
    }
    getProtesters() {
        if (this.currentProtest != undefined) {
            return this.currentProtest.getParticipants()
                .map((participant) => {
                return participant + ": " + find(this.protestersStore.getProtesters(), participant).getEmail();
            });
        }
        return undefined;
    }
    // find an array of emails of the registered users within a distance range of a particular geoLocation
    getUsersNearProtest() {
        console.log("current protest: " + this.currentProtest.getName());
        console.log("current protesters: " + this.protestersStore.getProtesters()[0].getGeoLocation()[0]);
        let protesters = this.currentProtest.getNearBy(this.protestersStore.getProtesters(), this.currentDistance * 1609.34);
        console.log("protesters nearby: " + protesters);
        if (protesters != undefined)
            return protesters.map((protester) => protester.getName() + ": " + protester.getEmail()).join(", ");
        return undefined;
    }
    // find an array of all protests and its movement(s) within a distance range of a particular location data
    getNearbyProtests() {
        let protests = this.currentLocation.getNearBy(this.protest_database, this.currentDistance * 1609.34);
        if (protests != undefined) {
            return protests.map((protest) => {
                let protestName = protest.getName();
                return protestName + `(movements: ${this.movementStore.findMovement(protestName).join(", ")})`;
            });
        }
        return undefined;
    }
}
exports.ProtestStore = ProtestStore;
class MovementStore extends EventEmitter {
    constructor() {
        super();
        this.movement_database = new Array();
        action_1.AppDispatcher.register((payload) => {
            switch (payload.actionType) {
                case action_1.ToDoActions.ADD_MOVEMENT:
                    if (find(this.movement_database, payload.data1) == undefined) {
                        let movement = new Movement(payload.data1);
                        movement.addProtest(payload.data2);
                        this.movement_database.push(movement);
                    }
                    this.emit('change');
                    break;
                case action_1.ToDoActions.ADD_PROTEST_TO_MOVEMENT:
                    find(this.movement_database, payload.data2).addProtest(payload.data1);
                default: console.log("action type invalid");
            }
        });
    }
    getMovements() {
        return this.movement_database;
    }
    // find an array of nation-wide movement(s) that the given protestName is part of
    findMovement(protestName) {
        return this.movement_database.filter((movement) => {
            let protests = movement.getProtests();
            return protests.includes(protestName);
        })
            .map((movement) => movement.getName());
    }
}
exports.MovementStore = MovementStore;
// search and return an array of elements from the database,
// of which names contain the quary (case insensitive)
function search(database, quary) {
    return database
        .filter((elementSearched) => {
        return elementSearched.getName().toLowerCase()
            .includes(quary.toLowerCase());
    })
        .map((protester) => protester.getName());
}
// find and return the element from the database, of which name matches the quary
function find(database, quary) {
    return database
        .find((elementSearched) => elementSearched.getName() == quary);
}
class Protester {
    constructor(name, email, location) {
        this.name = name;
        this.email = email;
        this.location = new Location(location);
    }
    getName() {
        return this.name;
    }
    getEmail() {
        return this.email;
    }
    getZipLocation() {
        return this.location.getZip();
    }
    getGeoLocation() {
        return this.location.getGeo();
    }
}
class Protest {
    constructor(name, location, date) {
        this.name = name;
        this.date = date;
        this.participants = new Array();
        this.location = new Location(location);
    }
    getName() {
        return this.name;
    }
    getZipLocation() {
        return this.location.getZip();
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
    getDate() {
        return this.date;
    }
    resetInfo(newTitle, newTime) {
        this.name = newTitle;
        this.date = newTime;
    }
}
class Movement {
    constructor(name) {
        this.name = name;
        this.protests = new Array();
    }
    getName() {
        return this.name;
    }
    addProtest(name) {
        if (!this.protests.includes(name))
            this.protests.push(name);
    }
    getProtests() {
        return this.protests;
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
        console.log("locationData[this.locationZip]" + this.locationZip);
        return locationData[this.locationZip];
    }
    getZip() {
        return this.locationZip;
    }
    // take in a database and a distance
    // return an array of elements from the databae, 
    // of which locations are in the distance range of this location
    getNearBy(database, distance) {
        return database.filter((elementSearched) => {
            let userLoc = elementSearched.getGeoLocation();
            console.log("userLoc is " + userLoc);
            console.log("geo" + locationData[this.locationZip]);
            console.log("element: " + elementSearched.getName());
            let distance_diff = geolib.getDistance({ latitude: userLoc[0], longitude: userLoc[1] }, { latitude: this.getGeo()[0], longitude: this.getGeo()[1] });
            console.log("distance diff: " + distance_diff);
            return distance_diff <= distance;
        });
    }
}
//# sourceMappingURL=store.js.map