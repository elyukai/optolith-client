type Action = {
	type: string;
};

type ReducerMapObject<S> = {
	[K in keyof S]: ((state: S[K], action: Action) => S[K]) | [(state: S[K], action: Action, add: any) => S[K], any];
};

export default <S extends { [key: string]: any }>(reducers: ReducerMapObject<S>) => {
	const finalReducers = {} as ReducerMapObject<S>;
	Object.keys(reducers).forEach(key => {
		const reducer = reducers[key];
		if (typeof reducer === 'function' || (Array.isArray(reducer) && typeof reducer[0] === 'function')) {
			finalReducers[key] = reducer;
		}
	});

	return (state: S = {} as S, action: Action) => {
		let hasChanged = false;
		const nextState = {} as S;

		Object.keys(finalReducers).forEach(key => {
			const reducerRaw = finalReducers[key];
			const prevStateForKey = state[key];
			let nextStateForKey;
			if (Array.isArray(reducerRaw)) {
				const [ reducer, add ] = reducerRaw;
				nextStateForKey = reducer(state, action, add);
			}
			else {
				const reducer = reducerRaw;
				nextStateForKey = reducer(state, action);
			}
			nextState[key] = nextStateForKey;
			hasChanged = hasChanged || nextStateForKey !== prevStateForKey;
		});

		return hasChanged ? nextState : state;
	}
};
