export default function logger(reducer) {
  return (Prevstate, action, args) => {
    const nextState = reducer(Prevstate, action, args);
    // console.log('PrevState:',Prevstate);
    // console.log('Action arg:', args);
    // console.group(action);

    // console.log('NextState:', nextState);
    return nextState;
  };
}
