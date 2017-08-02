import { AppState } from '../reducers/app';

export function mapGetToSlice<T>(sliceSelector: (state: AppState) => Map<string, T>, id: string) {
	return (state: AppState) => sliceSelector(state).get(id);
}

export function mapSliceToGet<T>(sliceSelector: (state: AppState) => Map<string, T>) {
	return (state: AppState) => (id: string) => sliceSelector(state).get(id);
}
