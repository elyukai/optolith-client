import { createStore } from 'redux';
import AppReducer from '../reducers/AppReducer';

const store = createStore(AppReducer);

export default store;
