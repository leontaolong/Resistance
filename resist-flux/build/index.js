// import * as UI from './ui'; //import UI
"use strict";
// UI.start(); //start up the UI
const store_1 = require("./store");
const view_1 = require("./view");
const action_1 = require("./action");
let protesterStore = new store_1.ProtesterStore();
let protesterView = new view_1.ProtestertView(protesterStore);
let movementStore = new store_1.MovementStore();
let movementView = new view_1.MovementView(movementStore);
let protestStore = new store_1.ProtestStore(protesterStore, movementStore);
let protestView = new view_1.ProtestView(protestStore);
action_1.ToDoActions.setProtestStore(protestStore);
//# sourceMappingURL=index.js.map