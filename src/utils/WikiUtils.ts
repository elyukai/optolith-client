import { WikiState } from '../reducers/wikiReducer';
import { getWikiStateKeyById } from './IDUtils';

export function get(state: WikiState, id: string) {
	const key = getWikiStateKeyById(id);
	const slice = key && state[key];
	return slice && slice.get(id);
}
