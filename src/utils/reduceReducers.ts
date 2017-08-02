import { Reducer } from 'redux';

export function reduceReducers<S>(...reducers: Reducer<S>[]) {
	return (previous: S, current: S) =>
		reducers.reduce(
			(p, r) => r(p, current),
			previous
		);
}
