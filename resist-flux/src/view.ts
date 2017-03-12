let $ = require('jquery');
import { ToDoActions } from './action';
export class ProtestertView {
    private store;
    constructor(store) {
        this.store = store;
        //register listener to the store
        this.store.on('change', (e) => {
            console.log("change");
            this.render();
        });

        $("#RMsubmit").click((e) => { //on user interaction
            e.preventDefault();
            ToDoActions.addMember($("#RMname").val(), $("#RMemail").val(), $("#RMzipCode").val()); //generate an event!
        });
    }

    render() {
        $("#memberDiv").empty();
        let protesters = this.store.getProtesters();

        for (let i = 0; i < protesters.length; i++) {
            let info = $("<p></p>").text("Name:" + protesters[i].getName() + " Email:"
                + protesters[i].getEmail() + " Zipcode: " + protesters[i].getZipLocation());
            $("#memberDiv").append(info);
        }
    }
}

export class ProtestView {
    private store;
    constructor(store) {
        this.store = store;
        //register listener to the store
        this.store.on('change', (e) => {
            console.log("change");
            this.render();
        });

        this.store.on('showList', (e) => {
            console.log("showList");
            this.renderList();
        });

        this.store.on("showNearbyProtest", (e) => {
            this.renderNearbyProtest();
        });
        $("#RPsubmit").click((e) => { //on user interaction
            e.preventDefault();
            console.log("clicked");
            ToDoActions.addProtest($("#RPtitle").val(), $("#RPzipcode").val(), $("#RPdate").val()); //generate an event!
        });

        $("#MNPsubmit").click((e) => { //on user interaction
            e.preventDefault();
            console.log("clicked");
            ToDoActions.getUsersNearProtest($("#MNPname").val(), $("#MNPdistance").val()); //generate an event!
        });

        $("#MNLsubmit").click((e) => {
            e.preventDefault();
            ToDoActions.getNearbyProtests($("#MNLzipcode").val(), $("#MNLdistance").val());
        });
    }

    renderNearbyProtest() {
        $("#listDiv").empty();
        let nearbyProtests = this.store.getNearbyProtests();
        let info = $("<p></p>").text("Neaby protest: ");
        for(let i = 0; i < nearbyProtests.length; i++) {
            info.append(nearbyProtests[i] + " ");
        }
        $("#listDiv").append(info);
    }

    render() {
        $("#protestDiv").empty();
        let protests = this.store.getProtests();

        for (let i = 0; i < protests.length; i++) {
            let info = $("<p></p>").text("Name:" + protests[i].getName() + " Location:"
                + protests[i].getZipLocation() + " Date " + protests[i].getDate() + " participants " + protests[i].getParticipants());
            $("#protestDiv").append(info);
        }
    }

    renderList() {
        $("#listMember").empty();
        let nearProtestors = this.store.getUsersNearProtest();
        let info = $("<p></p>").text("Member near" + $("#MNPname").val() + ": " + nearProtestors[0]

        );

        //         for (let i = 0; i < nearProtestors.length; i++) {
        //     // info.append(nearProtestors[i].getName() + " ");
        // } 
        $("#listMember").append(info);
    }
}

export class MovementView {
    private store;
    constructor(store) {
        this.store = store;
        this.store.on('change', (e) => {
            console.log("change");
            this.render();
        });
        $("#Msubmit").click((e) => {
            e.preventDefault();
            console.log("movement button clicked");
            ToDoActions.addMovement($("#Mname").val(), $("#MaddProtest").val());
        });
    }

    render() {
        $("#movementDiv").empty();
        // let items = store.getItems();
        let movements = this.store.getMovements();
        for (let i = 0; i < movements.length; i++) {
            let movement = movements[i];
            console.log("in for loop");
            let info = $("<p></p>").text("Name: " + movement.getName() + "Protests: " + movement.getProtests());
            $("#movementDiv").append(info);
        }
    }
}

class LocationView {
    constructor() { }

    render() {
        // let items = store.getItems();
        let protests = $("<p></p>").text();

        $("memberDiv").add(protests);
    }
}