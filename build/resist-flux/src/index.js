// import * as UI from './ui'; //import UI
"use strict";
// UI.start(); //start up the UI
const store_1 = require("./store");
const view_1 = require("./view");
const action_1 = require("./action");
let store = new store_1.ProtesterStore();
let view = new view_1.ProtestertView(store);
// store.sendMassage();
action_1.ToDoActions.addMember("patrick", "pa", "98105");
