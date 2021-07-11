import html from '../core.js'

function ToDoItem({todo,index,editIndex}){
    return html ` 
        <li class="${todo.complete && 'completed'}
        ${editIndex===index && 'editing'}">
            <div class="view">
                <input 
                class="toggle" 
                type="checkbox" 
                ${todo.complete && 'checked'}
                onchange="dispatch('toggle',${index})"
                >
                <label ondblclick="dispatch('StartEdit',${index})">${todo.title}</label>
                <button class="destroy"
                        onclick="dispatch('destroy',${index})">
                </button>
            </div>
            <input 
            class="edit" 
            value="${todo.title}"
            onkeyup="event.keyCode===13 && dispatch('endEdit',this.value.trim())|| event.keyCode===27 && dispatch('CancelEdit')"
            onblur="dispatch('endEdit',this.value)">
        </li>
    `
}

export default ToDoItem