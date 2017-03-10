let locationData = require("../data/zipcode-locations"); // import location dictionary
let geolib = require('geolib'); // import geolib module

// a skeleton class that has a name field and getName() method.
class Subject {
    constructor(protected name: string) { };
    getName(): string {
        return this.name;
    }
}

interface hasLocation {
    getGeoLocation(): number[];
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

class Protester extends Subject implements hasLocation {
    private location: Location;
    constructor(name: string, private email: string, location: string) {
        super(name);
        this.location = new Location(location);
    }
    getEmail(): string {
        return this.email;
    }
    getGeoLocation(): number[] {
        return this.location.getGeo();
    }
}

class Protest extends Subject implements hasLocation {
    private participants: string[] = new Array<string>();
    private location: Location;
    constructor(name: string, location: string, private date: string) {
        super(name);
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

class Movement extends Subject {
    private protests: string[] = new Array<string>();
    constructor(name: string) {
        super(name);
    }
    addProtest(name: string) {
        if (!this.protests.includes(name))
            this.protests.push(name);
    }
    getProtests(): string[] {
        return this.protests;
    }
}

export class ResistanceManager {
    private protester_database: Protester[]
    private protest_database: Protest[];
    private movement_database: Movement[];

    constructor() {
        this.protester_database = new Array<Protester>();
        this.protest_database = new Array<Protest>();
        this.movement_database = new Array<Movement>();
    }

    addMember(name: string, email: string, location: string) {
        if (this.find(this.protester_database, name) == undefined)
            this.protester_database.push(new Protester(name, email, location));
        return name;
    }

    addProtest(newProtestName: string, location: string, date: string) {
        if (this.find(this.protest_database, newProtestName) == undefined)
            this.protest_database.push(new Protest(newProtestName, location, date));
        return newProtestName;
    }

    addMovement(newMovementName: string) {
        if (this.find(this.movement_database, newMovementName) == undefined)
            this.movement_database.push(new Movement(newMovementName));
        return newMovementName;
    }

    addMemberToProtest(memberName: string, protestName: string) {
        this.find(this.protest_database, protestName).addParticipant(memberName);
    }

    findMemberNames(quary: string) {
        return this.search(this.protester_database, quary);
    }

    findProtestNames(quary: string) {
        return this.search(this.protest_database, quary);
    }

    findMovementNames(quary: string) {
        return this.search(this.movement_database, quary);
    }

    modifyProtest(protestName: string, newTitle?: string, newTime?: string) {
        this.find(this.protest_database, protestName).resetInfo(newTitle, newTime);
    }

    addProtestToMovement(protestName: string, movementName: string) {
        this.find(this.movement_database, movementName).addProtest(protestName);
    }

    // find an array of emails of the protesters involved in the given protestName
    getProtesters(protestName) {
        let protest: Protest = this.find(this.protest_database, protestName);
        if (protest) {
            return protest.getParticipants()
                .map((participant) => {
                    return participant + ": " + this.find(this.protester_database, participant).getEmail();
                });
        }
        return null;
    }

    // find an array of emails of the registered users within a distance range of a particular geoLocation
    getUsersNearProtest(protestName: string, distance: number) {
        let protesters = this.find(this.protest_database, protestName).getNearBy(this.protester_database, distance * 1609.34);
        if (protesters)
            return protesters.map((protester) => protester.getName() + ": " + protester.getEmail());
        return null;
    }

    // find an array of all protests and its movement(s) within a distance range of a particular location data
    getNearbyProtests(location: string, distance: number) {
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
    findMovement(protestName: string) {
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
                    .includes(quary.toLowerCase())
            })
            .map((protester) => protester.getName());
    }

    // find and return the element from the database, of which name matches the quary
    find(database, quary) {
        return database
            .find((elementSearched) => elementSearched.getName() == quary);
    }
}














