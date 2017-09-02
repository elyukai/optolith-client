import { Action } from 'redux';

export type Reducer<S> = (state: S | undefined, action: Action) => S;
export type CrossSliceReducer<S> = (intermediateState: S, action: Action, previousState: S) => S;

export function reduceReducers<S>(combinedReducer: Reducer<S>, ...crossSlicereducers: CrossSliceReducer<S>[]) {
	return (previous: S, action: Action) =>
		crossSlicereducers.reduce(
			(intermediateState, reducer) => reducer(intermediateState, action, previous),
			combinedReducer(previous, action)
		);
}
