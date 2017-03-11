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

        $("#RPsubmit").click((e) => { //on user interaction
            e.preventDefault();
            console.log("clicked");
            ToDoActions.addProtest($("#RPtitle").val(), $("#RPdate").val(), $("#RPzipcode").val()); //generate an event!
        });
    }

    render() {
        $("#protestDiv").empty();
        let protests = this.store.getProtests();

        for (let i = 0; i < protests.length; i++) {
            let info = $("<p></p>").text("Name:" + protests[i].getName() + " Location:"
                + protests[i].getZipLocation() + " Date " + protests[i].getDate() +  " participants " + protests[i].getParticipants());
            $("#protestDiv").append(info);
        }
    }
}

export class MovementView {
    constructor() { }

    render() {
        // let items = store.getItems();
        let name = $("<p></p>").text();
        let protests = $("<p></p>").text();

        $("memberDiv").add(name);
        $("memberDiv").add(protests);
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