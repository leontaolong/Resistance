let locationData = require("../data/zipcode-locations"); // import location dictionary
let db = require("../data/database");
let geolib = require('geolib'); // import geolib module
let jsonfile = require('jsonfile') // for json file I/O
let dbPath = "../data/database.json";

class Protester  {
    constructor(readonly name: string, readonly email: string, readonly location: string) {}
}

class Protest {
    readonly participants: string[];
    constructor(private name: string, private location: string, private date: string) {
        this.participants = new Array<string>();
    }
}

class Movement  {
    private protests: string[];
    constructor(private name: string) {
        this.protests = new Array<string>();
    }
}

export class ResistanceManager {
    constructor() {}

    addMember(name: string, email: string, location: string) {
        if (this.find(db.protesters, name) == undefined) {
            db.protesters.push((new Protester(name, email, location)));
            jsonfile.writeFileSync(dbPath, db, { spaces: 2 });
        }
        return name;
    }

    addProtest(name: string, location: string, date: string) {
        if (this.find(db.protests, name) == undefined) {
            db.protests.push(new Protest(name, location, date));
            jsonfile.writeFileSync(dbPath, db, { spaces: 2 });
        }
        return name;
    }

    addMovement(name: string) {
        if (this.find(db.movements, name) == undefined) {
            db.movements.push(new Movement(name));
            jsonfile.writeFileSync(dbPath, db, { spaces: 2 });
        }
        return name;
    }

    addMemberToProtest(memberName: string, protestName: string) {
        let participants = this.find(db.protests, protestName).participants;
        if (!participants.includes(memberName))
            participants.push(memberName);
        jsonfile.writeFileSync(dbPath, db, { spaces: 2 });
    }

    findMemberNames(quary: string) {
        return this.search(db.protesters, quary);
    }

    findProtestNames(quary: string) {
        return this.search(db.protests, quary);
    }

    findMovementNames(quary: string) {
        return this.search(db.movements, quary);
    }

    modifyProtest(protestName: string, newTitle?: string, newTime?: string) {
        if (newTitle)
            this.find(db.protests, protestName).name = newTitle;
        if (newTime)
            this.find(db.protests, protestName).date = newTime;
        jsonfile.writeFileSync(dbPath, db, { spaces: 2 });
    }

    addProtestToMovement(protestName: string, movementName: string) {
        let protests = this.find(db.movements, movementName).protests;
        if (!protests.includes(protestName))
            protests.push(protestName);
        jsonfile.writeFileSync(dbPath, db, { spaces: 2 });
    }

    // find an array of emails of the protesters involved in the given protestName
    getProtesters(protestName) {
        let protest: Protest = this.find(db.protests, protestName);
        if (protest) {
            return protest.participants
                .map((participant) => {
                    return participant + ": " + this.find(db.protesters, participant).email;
                });
        }
        return null;
    }

    // find an array of emails of the registered users within a distance range of a particular geoLocation
    getUsersNearProtest(protestName: string, distance: number) {
        let protest = this.find(db.protests, protestName);
        let protesters = this.getNearBy(this.getGeo(protest.location), db.protesters, distance * 1609.34);
        if (protesters)
            return protesters.map((protester) => protester.name + ": " + protester.email);
        return null;
    }

    // find an array of all protests and its movement(s) within a distance range of a particular location data
    getNearbyProtests(location: string, distance: number) {
        let protests = this.getNearBy(this.getGeo(location), db.protests, distance * 1609.34);
        if (protests) {
            return protests.map((protest) => {
                let protestName = protest.name;
                return protestName + `(movements: ${this.findMovement(protestName).join(", ")})`;
            });
        }
        return null;
    }

    // find an array of nation-wide movement(s) that the given protestName is part of
    findMovement(protestName: string) {
        return db.movements.filter((movement) => {
            let protests = movement.protests;
            return protests.includes(protestName);
        })
            .map((movement) => movement.name);
    }

    // search and return an array of elements from the database,
    // of which names contain the quary (case insensitive)
    search(database, quary) {
        return database
            .filter((elementSearched) => {
                return elementSearched.name.toLowerCase()
                    .includes(quary.toLowerCase())
            })
            .map((protester) => protester.name);
    }

    // find and return the element from the database, of which name matches the quary
    find(database, quary) {
        return database
            .find((elementSearched) => elementSearched.name == quary);
    }

    // return an array rtepresentatio of the geo location
    getGeo(locationZip: string): number[] {
        return locationData[locationZip];
    }

    // take in a database and a distance
    // return an array of elements from the databae, 
    // of which locations are in the distance range of this location
    getNearBy(geoLoc, database, distance: number) {
        return database.filter((elementSearched) => {
            let userLoc: number[] = this.getGeo(elementSearched.location);
            let distance_diff = geolib.getDistance(
                { latitude: userLoc[0], longitude: userLoc[1] },
                { latitude: geoLoc[0], longitude: geoLoc[1] }
            )
            return distance_diff <= distance;
        });
    }
}














