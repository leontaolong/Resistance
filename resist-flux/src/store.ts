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

export class ProtesStore extends EventEmitter {
    private protest_database: Protester[]
    constructor() {
        super();
        this.protest_database = new Array<Protester>();
        AppDispatcher.register((payload: Action) => {
            switch (payload.actionType) {

                case ToDoActions.ADD_MEMBER:
                    this.protest_database.push(
                        new Protester(payload.data1, payload.data2, payload.data3));
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