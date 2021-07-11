import html from '../core.js'
import ToDoItem from './ToDoItem.js';
import { connect } from '../store.js';


const connector=connect();
function ToDoList({todos,filter,filters,editIndex}){
   
    return html `
<section class="main">
        <input 
        id="toggle-all" 
        class="toggle-all" 
        type="checkbox"
        onchange="dispatch('toggleAll',this.checked)"
        ${todos.every(filters.complete) && 'checked'}
        >

        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
        ${todos
            .filter(filters[filter])
            .map((todo,index)=>ToDoItem({todo,index,editIndex})
            )}
        </ul>
</section>
    `
}

export default connector(ToDoList);