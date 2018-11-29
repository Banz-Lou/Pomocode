import { createStore } from 'redux';
import reduce from './reducers';

const store = createStore(reducer);

export default store;
