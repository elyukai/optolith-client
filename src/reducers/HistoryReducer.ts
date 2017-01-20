/// <reference path="../raw.d.ts" />

import { } from '../constants/ActionTypes';

type Action = {
	type: null;
};

export interface HistoryState {
	readonly past: any[];
	readonly current: any;
	readonly future: any[];
}

const initialState = <HistoryState>{
	past: [],
	current: null,
	future: []
};

export default (state: HistoryState = initialState, action: Action): HistoryState => {
	switch (action.type) {
		default:
			return state;
	}
}
