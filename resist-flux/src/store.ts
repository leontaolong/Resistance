let locationData = require('../data/zipcode-locations'); // import location dictionary
let geolib = require('geolib'); // import geolib module
import { Action, AppDispatcher, ToDoActions } from './action';
import events = require('events');
let EventEmitter = events.EventEmitter;

export class ProtesterStore extends EventEmitter {
    private protester_database: Protester[];
    constructor() {
        super();
        this.protester_database = new Array<Protester>();
        AppDispatcher.register((payload: Action) => {
            switch (payload.actionType) {

                case ToDoActions.ADD_MEMBER:
                    if (find(this.protester_database, payload.data1) == undefined) {
                        this.protester_database.push(
                            new Protester(payload.data1, payload.data2, payload.data3));
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

export class ProtestStore extends EventEmitter {
    private protest_database: Protest[];
    private currentProtest: Protest;
    private protestersStore: ProtesterStore;
    private currentDistance: number;
    private currentLocation: Location;
    private movementStore: MovementStore;
    constructor(ps: ProtesterStore, ms: MovementStore) {
        super();
        this.protest_database = new Array<Protest>();
        this.protestersStore = ps;
        this.movementStore = ms;
        AppDispatcher.register((payload: Action) => {
            switch (payload.actionType) {

                case ToDoActions.ADD_PROTEST:
                    if (find(this.protest_database, payload.data1) == undefined)
                        this.protest_database.push(
                            new Protest(payload.data1, payload.data2, payload.data3));
                    console.log(this.protest_database);
                    this.emit('change');
                    break;

                case ToDoActions.ADD_MEMBER_TO_PROTEST:
                    find(this.protest_database, payload.data2).addParticipant(payload.data1);
                    break;
                
                case ToDoActions.MODIFY_PROTEST:
                    find(this.protest_database, payload.data1).resetInfo(payload.data2, payload.data3);
                    break;

                case ToDoActions.GET_PROTESTERS:
                    this.currentProtest = find(this.protest_database, payload.data1);
                    break;

                case ToDoActions.GET_USERS_NEAR_PROTEST:
                    this.currentProtest = find(this.protest_database, payload.data1);
                    this.currentDistance = payload.data2;
                    break;

                case ToDoActions.GET_NEARBY_PROTEST:
                    this.currentLocation = new Location(payload.data1);
                    this.currentDistance = payload.data1;
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
        let protesters = this.currentProtest.getNearBy(this.protestersStore.getProtesters(), this.currentDistance * 1609.34);
        if (protesters != undefined)
            return protesters.map((protester) => protester.getName() + ": " + protester.getEmail());
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

export class MovementStore extends EventEmitter {
    private movement_database: Movement[];
    constructor() {
        super();
        this.movement_database = new Array<Movement>();
        AppDispatcher.register((payload: Action) => {
            switch (payload.actionType) {
                case ToDoActions.ADD_MOVEMENT:
                    if (find(this.movement_database, payload.data1) == undefined){
                        let movement = new Movement(payload.data1)
                        movement.addProtest(payload.data2);
                        this.movement_database.push(
                                movement
                            );
                    }
                    this.emit('change');
                    break;

                case ToDoActions.ADD_PROTEST_TO_MOVEMENT:
                    find(this.movement_database, payload.data2).addProtest(payload.data1);
                
                default: console.log("action type invalid");
            }
        });
    }

    getMovements() {
        return this.movement_database;
    }


    // find an array of nation-wide movement(s) that the given protestName is part of
    findMovement(protestName: string) {
        return this.movement_database.filter((movement) => {
            let protests = movement.getProtests();
            return protests.includes(protestName);
        })
            .map((movement) => movement.getName());
    }
}


// search and return an array of elements from the database,
// of which names contain the quary (case insensitive)
function search(database, quary) {
    return database
        .filter((elementSearched) => {
            return elementSearched.getName().toLowerCase()
                .includes(quary.toLowerCase())
        })
        .map((protester) => protester.getName());
}

// find and return the element from the database, of which name matches the quary
function find(database, quary) {
    return database
        .find((elementSearched) => elementSearched.getName() == quary);
}


class Protester {
    private location: Location;
    constructor(private name: string, private email: string, location: string) {
        this.location = new Location(location);
    }
    getName():string {
        return this.name;
    }
    getEmail(): string {
        return this.email;
    }
    getZipLocation(): string {
        return this.location.getZip();
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
    getName() {
        return this.name;
    }

    getZipLocation() {
        return this.location.getZip();
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
    getNearBy(database, distance: number) {
        return this.location.getNearBy(database, distance);
    }
    getDate():string {
        return this.date;
    }
    resetInfo(newTitle?: string, newTime?: string) {
        this.name = newTitle;
        this.date = newTime;
    }
}

class Movement {
    private protests: string[] = new Array<string>();
    constructor(private name: string) {
    }

    getName() {
        return this.name;
    }
    addProtest(name: string) {
        if (!this.protests.includes(name))
            this.protests.push(name);
    }
    getProtests(): string[] {
        return this.protests;
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
    getZip(): string {
        return this.locationZip;
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
