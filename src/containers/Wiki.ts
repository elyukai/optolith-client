import { connect, Dispatch } from 'react-redux';
import { Action } from 'redux';
import { AppState } from '../reducers/app';
import { Wiki, WikiDispatchProps, WikiOwnProps, WikiStateProps } from '../views/wiki/Wiki';

function mapStateToProps(state: AppState) {
	return {
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
	};
}

export const WikiContainer = connect<WikiStateProps, WikiDispatchProps, WikiOwnProps>(mapStateToProps, mapDispatchToProps)(Wiki);
