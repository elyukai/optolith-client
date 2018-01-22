interface Action {
	type: any;
	payload?: object;
}

export interface Reducer<S, A extends Action> {
	// tslint:disable-next-line:callable-types
	(state: S | undefined, action: A): S;
}

export interface CrossSliceReducer<S, A extends Action> {
	// tslint:disable-next-line:callable-types
	(intermediateState: S, action: A, previousState: S | undefined): S;
}

export function reduceReducers<S, A extends Action>(
	combinedReducer: Reducer<S, A>,
	...crossSlicereducers: CrossSliceReducer<S, A>[]
) {
	return (previous: S | undefined, action: A) =>
		crossSlicereducers.reduce(
			(intermediateState, reducer) => {
				return reducer(intermediateState, action, previous);
			},
			combinedReducer(previous, action)
		);
}
