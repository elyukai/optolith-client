import { UIMessages } from '../types/ui.d';

export interface LocaleState {
	id?: string;
	type: string;
	messages?: UIMessages;
}

export function locale(state: LocaleState = {
	type: 'default'
}, action: Action): LocaleState {
	return state;
}
