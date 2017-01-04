import { Dispatcher } from 'flux';

export interface Action {
	[id: string]: any;
	type: string;
}

const dispatcher = new Dispatcher<Action>();

export default dispatcher;
