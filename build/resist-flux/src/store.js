"use strict";
let locationData = require("../data/zipcode-locations"); // import location dictionary
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
                    this.protester_database.push(new Protester(payload.data1, payload.data2, payload.data3));
                    this.emit('change');
                    break;
                default: ;
            }
        });
    }
    getMember() {
        return this.protester_database;
    }
}
exports.ProtesterStore = ProtesterStore;
class ProtestStore extends EventEmitter {
    constructor() {
        super();
        this.protest_database = new Array();
        action_1.AppDispatcher.register((payload) => {
            switch (payload.actionType) {
                case action_1.ToDoActions.ADD_MEMBER:
                    this.protest_database.push(new Protest(payload.data1, payload.data2, payload.data3));
                    this.emit('change');
                    break;
                default: ;
            }
        });
    }
    getMember() {
        return this.protest_database;
    }
}
exports.ProtestStore = ProtestStore;
class Protester {
    constructor(name, email, location) {
        this.name = name;
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
class Protest {
    constructor(name, location, date) {
        this.name = name;
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
