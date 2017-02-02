import { Dispatcher } from 'flux';

export interface Action {
	[id: string]: any;
	type: string;
}

export default new Dispatcher<Action>();
