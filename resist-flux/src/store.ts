let locationData = require("../data/zipcode-locations"); // import location dictionary
let geolib = require('geolib'); // import geolib module
import {Action, AppDispatcher, ToDoActions} from './action';
import events = require('events');
let EventEmitter = events.EventEmitter;

export class ProtesterStore extends EventEmitter {
    private protester_database: Protester[]
    constructor() {
        super();
        this.protester_database = new Array<Protester>();
        AppDispatcher.register((payload: Action) => {
            switch (payload.actionType) {

                case ToDoActions.ADD_MEMBER:
                    this.protester_database.push(
                        new Protester(payload.data1, payload.data2, payload.data3));
                        this.emit('change');
                    break;
                default: ;
            }
        })
    }
    getMember() {
        return this.protester_database;
    }
}

export class ProtestStore extends EventEmitter {
    private protest_database: Protest[]
    constructor() {
        super();
        this.protest_database = new Array<Protest>();
        AppDispatcher.register((payload: Action) => {
            switch (payload.actionType) {

                case ToDoActions.ADD_MEMBER:
                    this.protest_database.push(
                        new Protest(payload.data1, payload.data2, payload.data3));
                        this.emit('change');
                    break;
                default: ;
            }
        })
    }
    getMember() {
        return this.protest_database;
    }
}






class Protester {
    private location: Location;
    constructor(private name: string, private email: string, location: string) {
        this.location = new Location(location);
    }
    getEmail(): string {
        return this.email;
    }
    getGeoLocation(): number[] {
        return this.location.getGeo();
    }
}

class Protest {
    private participants: string[] = new Array<string>();
    private location: Location;
    constructor(private name: string, location: string, private date: string) {
        this.location = new Location(location);
    }
    addParticipant(name: string) {
        if (!this.participants.includes(name))
            this.participants.push(name);
    }
    getParticipants(): string[] {
        return this.participants;
    }
    getGeoLocation(): number[] {
        return this.location.getGeo();
    }
    getNearBy(database, distance: number): Location {
        return this.location.getNearBy(database, distance);
    }
    resetInfo(newTitle?: string, newTime?: string) {
        this.name = newTitle;
        this.date = newTime;
    }
}



// a location class that stores and manages information about a certain subject
class Location {
    // pass in a zip string to construct a location
    constructor(private locationZip: string) { }

    // return an array rtepresentatio of the geo location
    getGeo(): number[] {
        return locationData[this.locationZip];
    }

    // take in a database and a distance
    // return an array of elements from the databae, 
    // of which locations are in the distance range of this location
    getNearBy(database, distance: number) {
        return database.filter((elementSearched) => {
            let userLoc: number[] = elementSearched.getGeoLocation();
            let distance_diff = geolib.getDistance(
                { latitude: userLoc[0], longitude: userLoc[1] },
                { latitude: this.getGeo()[0], longitude: this.getGeo()[1] }
            )
            return distance_diff <= distance;
        });
    }
}