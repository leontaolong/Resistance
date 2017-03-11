import $ = require("jquery");


export class ProtestertView {
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

    render() {
        // let items = store.getItems();
        let name = $("<p></p>").text();
        let email = $("<p></p>").text();
        let zipcode = $("<p></p>").text();
        $("memberDiv").add(name);
        $("memberDiv").add(email);
        $("memberDiv").add(zipcode);
    }
}

class ProtestView {
    constructor() { }

    render() {
        // let items = store.getItems();
        let name = $("<p></p>").text();
        let email = $("<p></p>").text();
        let zipcode = $("<p></p>").text();

        let protestors = $("<p></p>").text();
        $("memberDiv").add(name);
        $("memberDiv").add(email);
        $("memberDiv").add(zipcode);
        $("memberDiv").add(protestors);
    }
}

class MovementView {
    constructor() {}

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