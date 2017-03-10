// import * as UI from './ui'; //import UI

// UI.start(); //start up the UI

import {ProtesterStore} from './store';
import {ProtestertView} from './view';
import {ToDoActions} from './action';

let store = new ProtesterStore();
let view = new ProtestertView(store);

// store.sendMassage();

ToDoActions.addMember("patrick", "pa", "98105");
