"use strict";
const flux_1 = require("flux");
//define the dispatcher (singleton)
exports.AppDispatcher = new flux_1.Dispatcher();
class Action {
    constructor(actionType, data1, data2, data3) {
        this.actionType = actionType;
        this.data1 = data1;
        this.data2 = data2;
        this.data3 = data3;
    }
}
exports.Action = Action;
class ToDoActions {
    //Action Creators!
    static addMember(name, email, location) {
        let action = new Action(ToDoActions.ADD_MEMBER, name, email, location);
        exports.AppDispatcher.dispatch(action);
    }
    static addProtest(name, location, date) {
        let action = new Action(ToDoActions.ADD_PROTEST, name, location, date);
        exports.AppDispatcher.dispatch(action);
    }
    static addMovement(name, protest) {
        let action = new Action(ToDoActions.ADD_MOVEMENT, name, protest);
        exports.AppDispatcher.dispatch(action);
    }
    static addMemberToProtest(memberName, protestName) {
        let action = new Action(ToDoActions.ADD_MEMBER_TO_PROTEST, memberName, protestName);
        exports.AppDispatcher.dispatch(action);
    }
    static modifyProtest(MODIFY_PROTEST, newTitle, newTime) {
        let action = new Action(ToDoActions.MODIFY_PROTEST, MODIFY_PROTEST, newTitle, newTime);
        exports.AppDispatcher.dispatch(action);
    }
    static addProtestToMovement(protestName, movementName) {
        let action = new Action(ToDoActions.ADD_PROTEST_TO_MOVEMENT, protestName, movementName);
        exports.AppDispatcher.dispatch(action);
    }
    static getProtesters(protestName) {
        let action = new Action(ToDoActions.GET_PROTESTERS, protestName);
        exports.AppDispatcher.dispatch(action);
    }
    static getUsersNearProtest(protestName, distance) {
        let action = new Action(ToDoActions.GET_USERS_NEAR_PROTEST, protestName, distance);
        exports.AppDispatcher.dispatch(action);
    }
    static getNearbyProtests(location, distance) {
        let action = new Action(ToDoActions.GET_NEARBY_PROTEST, location, distance);
        exports.AppDispatcher.dispatch(action);
    }
    static updateProtestsInMovement(protestName, newTitle) {
        let action = new Action(ToDoActions.UPDATE_PROTESTERS_IN_MOVEMENT, protestName, newTitle);
        exports.AppDispatcher.dispatch(action);
    }
    static setProtestStore(ps) {
        let action = new Action(ToDoActions.SET_PROTEST_STORE, ps);
        exports.AppDispatcher.dispatch(action);
    }
}
ToDoActions.ADD_MEMBER = "ADD_MEMBER";
ToDoActions.ADD_PROTEST = "ADD_PROTEST";
ToDoActions.ADD_MOVEMENT = "ADD_MOVEMENT";
ToDoActions.ADD_MEMBER_TO_PROTEST = "ADD_MEMBER_TO_PROTEST";
ToDoActions.MODIFY_PROTEST = "MODIFY_PROTEST";
ToDoActions.ADD_PROTEST_TO_MOVEMENT = "ADD_PROTEST_TO_MOVEMENT";
ToDoActions.GET_PROTESTERS = "GET_PROTESTERS";
ToDoActions.GET_USERS_NEAR_PROTEST = "GET_USERS_NEAR_PROTEST";
ToDoActions.GET_NEARBY_PROTEST = "GET_NEARBY_PROTEST";
ToDoActions.UPDATE_PROTESTERS_IN_MOVEMENT = "UPDATE_PROTESTERS_IN_MOVEMENT";
ToDoActions.SET_PROTEST_STORE = "SET_PROTEST_STORE";
exports.ToDoActions = ToDoActions;
//# sourceMappingURL=action.js.map