// import * as UI from './ui'; //import UI

// UI.start(); //start up the UI

import {ProtesterStore, ProtestStore, MovementStore} from './store';
import {ProtestertView, ProtestView, MovementView} from './view';
import {ToDoActions} from './action';

let protesterStore = new ProtesterStore();
let protesterView = new ProtestertView(protesterStore);

let movementStore = new MovementStore();
let movementView = new MovementView(movementStore);

let protestStore = new ProtestStore(protesterStore, movementStore);
let protestView = new ProtestView(protestStore);



// store.sendMassage();
