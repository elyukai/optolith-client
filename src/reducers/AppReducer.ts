import { combineReducers } from 'redux';
import auth from './AuthReducer';
import hero from './HeroReducer';
import herolist from './HerolistReducer';
import loading from './LoadingReducer';
import location from './LocationReducer';

export const version = [ 0, 14, 59 ];

export default combineReducers({
	auth,
	hero,
	herolist,
	loading,
	location
} );
