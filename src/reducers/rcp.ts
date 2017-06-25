export interface RCPState {
	race?: string;
	culture?: string;
	profession?: string;
	professionVariant?: string;
}

export function rcp(state: RCPState = {}, action: Action): RCPState {
	return state;
}
