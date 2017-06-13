/// <reference path="../types/external.d.ts" />

import { Dispatcher } from 'flux';

export interface Action {
	type: string;
	payload?: any;
	prevState?: any;
	undo?: boolean;
	cost?: number;
}

export const AppDispatcher = new Dispatcher<Action>();
