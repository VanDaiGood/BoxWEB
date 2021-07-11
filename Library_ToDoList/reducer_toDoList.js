import ToDoItem from "./component/ToDoItem.js";
import storage from "./ultistorage.js";

const init = {
  todos: storage.get(),
  filter:'all', // danh dau filter(tat ca, hoan thanh, chua hoan thanh)
  filters:{
      all:()=>true,
      active:todo=>!todo.complete,
      complete:todo=>todo.complete
  },
  editIndex:null
};

const actions = {
  add({ todos }, title) {
    if (title) {
      todos.push({ title, complete: false });
      storage.set(todos);
    }
  },
  toggle({ todos }, index) {
    const todo = todos[index];
    todo.complete = !todo.complete;
    storage.set(todos);
  },
  toggleAll({ todos }, complete) {
    todos.forEach((todo) => {
      todo.complete = complete;
      storage.set(todos);
    });
  },
  destroy({todos},index){
      todos.splice(index,1);
      storage.set(todos);
  },
  switchFilter(state,Filter){
     state.filter=Filter;
  },
  clearComplete(state){
    state.todos=state.todos.filter(state.filters.active)
    storage.set(state.todos);
  },
  StartEdit(state,index){
    state.editIndex=index;
  },
  endEdit(state,title){
    if(state.editIndex!==null){
      if(title){
        state.todos[state.editIndex].title=title;
        storage.set(state.todos);
      } else {
        this.destroy(state,state.editIndex);
      }
      state.editIndex=null;
    }
  },
  CancelEdit(state){
    state.editIndex=null;
  }
};
export default function (state = init, action, args) {
  actions[action] && actions[action](state, ...args); // actions.add()
  return state;
}
