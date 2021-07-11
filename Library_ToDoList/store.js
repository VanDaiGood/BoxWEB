import {createStore} from '../Library_ToDoList/core.js';
import reducer from './reducer_toDoList.js';
import withLogger from './Logger.js';
const {attach, connect,dispatch}=createStore(withLogger(reducer));

window.dispatch=dispatch;

export{
    attach,
    connect,
};