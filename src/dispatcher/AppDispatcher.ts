/// <reference path="../@types/external.d.ts" />
/// <reference path="../@types/rawdata.d.ts" />

import { Dispatcher } from 'flux';

export interface Action {
	[id: string]: any;
	type: string;
}

export default new Dispatcher<Action>();
