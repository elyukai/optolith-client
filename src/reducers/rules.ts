
export interface RulesState {
	higherParadeValues: number;
	attributeValueLimit: boolean;
}

const initialState: RulesState = {
	higherParadeValues: 0,
	attributeValueLimit: false
};

export function rules(state: RulesState = initialState, action: Action): RulesState {
	return state;
}
