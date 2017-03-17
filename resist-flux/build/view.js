"use strict";
let $ = require('jquery');
const action_1 = require("./action");
class ProtestertView {
    constructor(store) {
        this.store = store;
        //register listener to the store
        this.store.on('change', (e) => {
            this.render();
        });
        $("#RMsubmit").click((e) => {
            e.preventDefault();
            action_1.ToDoActions.addMember($("#RMname").val(), $("#RMemail").val(), $("#RMzipCode").val()); //generate an event!
        });
    }
    render() {
        $("#memberDiv").empty();
        let protesters = this.store.getProtesters();
        for (let i = 0; i < protesters.length; i++) {
            let info = $("<p></p>").text("Name: " + protesters[i].getName() + " Email: "
                + protesters[i].getEmail() + " Zipcode: " + protesters[i].getZipLocation());
            $("#memberDiv").append(info);
        }
    }
}
exports.ProtestertView = ProtestertView;
class ProtestView {
    constructor(store) {
        this.store = store;
        //register listener to the store
        this.store.on('change', (e) => {
            this.render();
        });
        this.store.on('showList', (e) => {
            this.renderList();
        });
        this.store.on("showNearbyProtest", (e) => {
            this.renderNearbyProtest();
        });
        $("#RPsubmit").click((e) => {
            e.preventDefault();
            action_1.ToDoActions.addProtest($("#RPtitle").val(), $("#RPzipcode").val(), $("#RPdate").val()); //generate an event!
            if ($('#RPprotestor') != undefined) {
                action_1.ToDoActions.addMemberToProtest($('#RPprotestor').val(), $("#RPtitle").val());
            }
        });
        $("#addMemeberSubmit").click((e) => {
            e.preventDefault();
            action_1.ToDoActions.addMemberToProtest($("#addMemeberProtester").val(), $("#addMemeberProtest").val()); //generate an event!
        });
        $("#MNPsubmit").click((e) => {
            e.preventDefault();
            action_1.ToDoActions.getUsersNearProtest($("#MNPname").val(), $("#MNPdistance").val()); //generate an event!
        });
        $("#MNLsubmit").click((e) => {
            e.preventDefault();
            action_1.ToDoActions.getNearbyProtests($("#MNLzipcode").val(), $("#MNLdistance").val());
        });
        $("#MPsubmit").click((e) => {
            e.preventDefault();
            action_1.ToDoActions.modifyProtest($("#MPtitle").val(), $("#MPNewtitle").val(), $("#MPdate").val()); //generate an event!
            if ($('#MPNewtitle') != undefined) {
                action_1.ToDoActions.updateProtestsInMovement($("#MPtitle").val(), $("#MPNewtitle").val());
            }
        });
    }
    renderNearbyProtest() {
        $("#listDiv").empty();
        let nearbyProtests = this.store.getNearbyProtests();
        let info = $("<p></p>").text("Neaby protest: ");
        for (let i = 0; i < nearbyProtests.length; i++) {
            info.append(nearbyProtests[i] + " ");
        }
        $("#listDiv").append(info);
    }
    render() {
        $("#protestDiv").empty();
        let protests = this.store.getProtests();
        for (let i = 0; i < protests.length; i++) {
            let info = $("<p></p>").text("Name: " + protests[i].getName() + " Location: "
                + protests[i].getZipLocation() + " Date: " + protests[i].getDate() + " Participants: " + protests[i].getParticipants().join(", "));
            $("#protestDiv").append(info);
        }
    }
    renderList() {
        $("#listMember").empty();
        let nearProtestors = this.store.getUsersNearProtest();
        let info = $("<p></p>").text("Member near " + $("#MNPname").val() + ": ");
        $("#listMember").append(info);
        for (let i = 0; i < nearProtestors.length; i++) {
            let info = nearProtestors[i];
            $("#listMember").append(info);
        }
    }
}
exports.ProtestView = ProtestView;
class MovementView {
    constructor(store) {
        this.store = store;
        this.store.on('change', (e) => {
            this.render();
        });
        $("#Msubmit").click((e) => {
            e.preventDefault();
            action_1.ToDoActions.addMovement($("#Mname").val(), $("#MaddProtest").val());
        });
        $("#addPToMSubmit").click((e) => {
            e.preventDefault();
            action_1.ToDoActions.addProtestToMovement($('#addPToMProtest').val(), $("#addPToMMovement").val());
        });
    }
    render() {
        $("#movementDiv").empty();
        let movements = this.store.getMovements();
        for (let i = 0; i < movements.length; i++) {
            let movement = movements[i];
            let info = $("<p></p>").text("Name: " + movement.getName() + " Protests: " + movement.getProtests());
            $("#movementDiv").append(info);
        }
    }
}
exports.MovementView = MovementView;
//# sourceMappingURL=view.js.map