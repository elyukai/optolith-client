export interface UIState {
	location: string;
}

export default (state: UIState, action: any): UIState => {
	return {
		location: 'test'
	}
};
