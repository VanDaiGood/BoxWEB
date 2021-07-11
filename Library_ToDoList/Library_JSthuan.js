const init = {
    cars: ['BMW']
}

// reducer.js (thằng này có chức năng xử lí và đưa dữ liệu vào trong store)
function reducer(state=init, action, args) {
    switch(action) {
        case 'ADD':
            const [newCar] = args
            console.log({
                ...state,
                cars: [...state.cars, newCar]
            })
            return { 
                ...state,
                cars: [...state.cars, newCar]
            }
            break
        default:
            return state
    }
}

// core.js // Bộ xử lí trung tâm
function html([first, ...strings], ...values) { // Hàm này gọi là template engine, hàm này xử lí một số lỗi linh tinh của html thôi
    return values.reduce(
        (acc, cur) => acc.concat(cur, strings.shift()),
        [first]
    )
    .filter(x => x && x !== true || x === 0) 
    .join('')
}

function createStore(reducer) { // Ham này tạo ra dữ liệu trong store thông qua reducer và các thao tác trên view
    let state = reducer()
    const roots = new Map()

    function render() { // render ra view
        for (const [root, component] of roots) {  
            console.log(component)
            const output = component()  
            root.innerHTML = output
        }
    }

    return {
        // Hàm này nhận mấy cái dòng HTML của component để hiển thị ra view
        attach(component, root) {
            roots.set(root, component) // doi voi obj thuong thi gan luon, nhung voi Map thi dung phuon thuc set
            render()
        },

        connect(selector = state => state) {
            // props và args là một obj, nó là các key: value mà ta muốn đưa thêm vào store và đưa ra view
            return component => (props, ...args) =>
                component(Object.assign({}, props, selector(state), ...args))
        },

        // Hàm này có tác dụng gửi thông tin đến reducer để xử lí dư liệu trong store và cả render ra view
        dispatch(action, ...args) {
            state = reducer(state, action, args)
            render();
        }
    }
}


// store.js // Thằng này chứa dữ liệu để đưa ra view thôi
const { attach, connect, dispatch } = createStore(reducer)

window.dispatch = dispatch

// app.js // Ông này là để xử lí html để xuất khẩu thôi
const connector = connect()

// Hàm này có tác dụng tạo ra HTML đã qua xử lí để chuẩn bị cho xuất khẩu
function App({ cars }) { 
    return html`
    <ul>
    ${cars.map(car => `<li>${car}</li>`)}
    </ul>
    
    <button onclick="dispatch('ADD', 'Ferrari')">Add car</button>
    `
}

connector(App) // Thằng này các bạn dễ nhầm lần nè, chú ý trong bài, khi import App từ component/App.js
							// thì thực ra là import connector(App) với tên là App chứ không phải là App đâu

// App đây không phải là App ở trên mà phải là connector(App)
attach(connector(App), document.getElementById('root'))
