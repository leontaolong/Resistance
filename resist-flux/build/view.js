"use strict";
class ProtestertView {
    constructor(store) {
        //register listener to the store
        store.on('change', (e) => {
            // console.log("change!!!!!");
            // console.log(store.getMember());    
        });
        // $('button').on('click', () => { //on user interaction
        //   ToDoActions.addItem(...); //generate an event!
        // });
    }
}
exports.ProtestertView = ProtestertView;
class ProtestView {
    constructor() { }
}
class MovementView {
    constructor() { }
}
//# sourceMappingURL=view.js.map