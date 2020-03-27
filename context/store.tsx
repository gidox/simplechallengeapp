// store.js
import React, {createContext, useReducer} from 'react';

const initialState = {

   metaData: {},

};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ( { children } ) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};
function reducer(state, action) {
  switch(action.type) {


    
    case 'SET_META':
      return {...state, metaData: action.data };
    case 'SET_META_ACTIVE':
      state.metaData.subsidiaries[action.data].actived = true;
      return {...state };
    case 'SET_META_DISABLE':
      state.metaData.subsidiaries[action.data].actived = false;
      return {...state };
    case 'SET_META_CITY_ACTIVE':
      state.metaData.cities[action.data].actived = true;
      return {...state };
    case 'SET_META_CITY_DISABLE':
      state.metaData.cities[action.data].actived = false;
      return {...state };
  
    default:
      throw new Error();
  };
}
export { store, StateProvider }