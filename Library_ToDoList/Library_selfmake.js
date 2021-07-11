// kho du lieu ban dau
const init=[
    {
        cars:["Mercedes","BMW"],
    },
];

//reducer.js

function reducer(state=init,action,args){
    switch(action){
        case:'ADD'
        const newCar=[...args];
        return {
            ...args,
            cars:[...state.cars,newcar],
        };
        default:
        return state;
    }
}

//core.js

function html([first,...strings],...values){
    return values.reduce(
        (acc,cur)=>acc.concat(cur,strings.shift()),
        [first]
    )
    .filter(x=>x&&x!==true||x===0)
    .join('');
}


function createStore(reducer){
        
    let state=reducer();
    const roots=new Map();

    function render(){
        for(const [root,component] of roots){
            const output=component();
            root.innerHTML=output;
        }
    }
    return {
        attach(component,root){
            roots.set(root,component);
            render();
        },

        connect(selector=state=>state){
            return component(props,...args)=>
            component(Object.assign({},props,selector(state),...args))
        },

        dispatch(action,...args){
            state=reducer(state,action,args);
            render();
        },
    }
}

//store.js

window.dispatch=dispatch;

const {attach ,connect,dispatch}=createStore(reducer);

const connector=connect();
//app.js

function app({cars}){
    return html `
    <ul>
    ${cars.map(car=>`<li>${car}</li>`)}
    </ul>
    <button onclick="dispatch('ADD','VinFast')">Add car</button>
    `
}
connector(app);

attach(app,document.getElementById('root'));