import html from "../core.js";
import { connect } from "../store.js";

function Footer({ todos,filter, filters }) {
  console.log(filters);
  return html`
    <footer class="footer">
      <span class="todo-count">
        <strong>${todos.filter(filters.active).length}</strong> item left</span
      >
      <ul class="filters">
     
        ${Object.keys(filters) //cac key cua filters trung voi
                               // ten cua button trang thai
                               // ==> truyen vao bien 'type'
         .map((type) => html`           
            <li>
              <a class="${filter===type && 'selected'}" 
              href="#" onclick="dispatch('switchFilter','${type}')"
              >${type[0].toUpperCase()
                +type.slice(1)}</a>
            </li>
          `
        )}
      </ul>
      ${todos.filter(filters.complete).length>0 && html
        ` 
            <button class="clear-completed" 
                  onclick="dispatch('clearComplete')">
            Clear completed</button>
        `}
     
    </footer>
  `;
}

export default connect()(Footer);
