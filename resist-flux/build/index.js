// import * as UI from './ui'; //import UI
"use strict";
// UI.start(); //start up the UI
const store_1 = require("./store");
const view_1 = require("./view");
let protesterStore = new store_1.ProtesterStore();
let protesterView = new view_1.ProtestertView(protesterStore);
let movementStore = new store_1.MovementStore;
let movementView = new store_1.MovementStore;
let protestStore = new store_1.ProtestStore(protesterStore, movementStore);
let protestView = new view_1.ProtestView(protestStore);
// store.sendMassage();
//# sourceMappingURL=index.js.map