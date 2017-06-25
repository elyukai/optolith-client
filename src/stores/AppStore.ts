import { createStore } from 'redux';
import { app } from '../reducers/app';

export const store = createStore(app);
