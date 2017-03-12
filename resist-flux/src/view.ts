let $ = require('jquery');
import { ToDoActions } from './action';
export class ProtestertView {
    private store;
    constructor(store) {
        this.store = store;
        //register listener to the store
        this.store.on('change', (e) => {
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
            this.render();
        });

        $("#RPsubmit").click((e) => { //on user interaction
            e.preventDefault();
            ToDoActions.addProtest($("#RPtitle").val(), $("#RPdate").val(), $("#RPzipcode").val()); //generate an event!
            if ($('#RPprotestor') != undefined) {
            ToDoActions.addMemberToProtest($('#RPprotestor').val(), $("#RPtitle").val());  
            }
        });

        $("#addMemeberSubmit").click((e) => { //on user interaction
            e.preventDefault();
            ToDoActions.addMemberToProtest($("#addMemeberProtester").val(), $("#addMemeberProtest").val()); //generate an event!
        });

        $("#MPsubmit").click((e) => { //on user interaction
            e.preventDefault();
            ToDoActions.modifyProtest($("#MPtitle").val(), $("#MPNewtitle").val(), $("#MPdate").val()); //generate an event!
            if ($('#MPprotestor') != undefined) {
            ToDoActions.addMemberToProtest($('#MPprotestor').val(), $("#MPtitle").val());  
            }
        });     
    }

    render() {
        $("#protestDiv").empty();
        let protests = this.store.getProtests();
        for (let i = 0; i < protests.length; i++) {
            let info = $("<p></p>").text("Name: " + protests[i].getName() + " Location: "
                + protests[i].getZipLocation() + " Date: " + protests[i].getDate() +  " Participants: " + protests[i].getParticipants().join(", "));
            $("#protestDiv").append(info);
        }
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

        $("#Msubmit").click((e) =>{
            e.preventDefault();
            console.log("movement button clicked");
            ToDoActions.addMovement($("#Mname").val(),$("#MaddProtest").val());
        });

        $("#addPToMSubmit").click((e) => { //on user interaction
            e.preventDefault();
            ToDoActions.addProtestToMovement($('#addPToMProtest').val(), $("#addPToMMovement").val());  
        });
    }

    render() {
        $("#movementDiv").empty();
        // let items = store.getItems();
        let movements = this.store.getMovements();

        for (let i = 0; i < movements.length; i++) {
            let movement = movements[i];
            console.log(movement.getProtests());
            console.log("in for loop");
            let info = $("<p></p>").text("Name: " + movement.getName() + "Protests: " + movement.getProtests());
            $("#movementDiv").append(info);
        }
    }
}
