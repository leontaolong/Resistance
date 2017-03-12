import { Dispatcher } from 'flux';

//define the dispatcher (singleton)
export let AppDispatcher = new Dispatcher();

export class Action {
    constructor(readonly actionType: string,
        readonly data1?: any, readonly data2?: any, readonly data3?: any) { }
}

export class ToDoActions {
    static readonly ADD_MEMBER = "ADD_MEMBER";
    static readonly ADD_PROTEST = "ADD_PROTEST";
    static readonly ADD_MOVEMENT = "ADD_MOVEMENT";
    static readonly ADD_MEMBER_TO_PROTEST = "ADD_MEMBER_TO_PROTEST";
    static readonly MODIFY_PROTEST = "MODIFY_PROTEST";
    static readonly ADD_PROTEST_TO_MOVEMENT = "ADD_PROTEST_TO_MOVEMENT";
    static readonly GET_PROTESTERS = "GET_PROTESTERS";
    static readonly GET_USERS_NEAR_PROTEST = "GET_USERS_NEAR_PROTEST";
    static readonly GET_NEARBY_PROTEST = "GET_NEARBY_PROTEST";

    //Action Creators!
    static addMember(name: string, email: string, location: string) {
        let action = new Action(ToDoActions.ADD_MEMBER, name, email, location);
        AppDispatcher.dispatch(action);
    }

    static addProtest(name: string, location: string, date: string) {
        let action = new Action(ToDoActions.ADD_PROTEST, name, location, date);
        AppDispatcher.dispatch(action);
    }

    static addMovement(name: string) {
        let action = new Action(ToDoActions.ADD_MOVEMENT, name);
        AppDispatcher.dispatch(action);
    }

    static addMemberToProtest(memberName: string, protestName: string) {
        let action = new Action(ToDoActions.ADD_MEMBER_TO_PROTEST, memberName, protestName);
        AppDispatcher.dispatch(action);        
    }

    static modifyProtest(MODIFY_PROTEST: string, newTitle?: string, newTime?: string) {
        let action = new Action(ToDoActions.MODIFY_PROTEST, MODIFY_PROTEST, newTitle, newTime);
        AppDispatcher.dispatch(action);   
    }

    static addProtestToMovement(protestName: string, movementName: string) {
        let action = new Action(ToDoActions.ADD_PROTEST_TO_MOVEMENT, movementName);
        AppDispatcher.dispatch(action); 
    }

    static getProtesters(protestName) {
        let action = new Action(ToDoActions.GET_PROTESTERS, protestName);
        AppDispatcher.dispatch(action); 
    }

    static getUsersNearProtest(protestName: string, distance: number) {
        let action = new Action(ToDoActions.GET_USERS_NEAR_PROTEST, protestName, distance);
        AppDispatcher.dispatch(action);
    }

    static getNearbyProtests(location: string, distance: number) {
        let action = new Action(ToDoActions.GET_NEARBY_PROTEST, location, distance);
        AppDispatcher.dispatch(action);
    }
}