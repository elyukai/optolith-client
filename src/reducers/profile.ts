import { Hero } from '../types/data.d';

export interface ProfileState {
	name?: string;
	dateCreated?: Date;
	dateModified?: Date;
	professionName?: string;
	sex?: 'm' | 'f';
	avatar?: string;
	family?: string;
	placeofbirth?: string;
	dateofbirth?: string;
	age?: string;
	haircolor?: number;
	eyecolor?: number;
	size?: string;
	weight?: string;
	title?: string;
	socialstatus?: number;
	characteristics?: string;
	otherinfo?: string;
	cultureAreaKnowledge?: string;
}

const initialState: ProfileState = {};

export function profile(state: ProfileState = initialState, action: Action): ProfileState {
	return state;
}
