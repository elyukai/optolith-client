import { connect } from 'react-redux';
import { AppState } from '../reducers/app';
import { getCurrentCultureId, getCurrentRaceId } from '../selectors/rcpSelectors';
import { RCP, RCPDispatchProps, RCPOwnProps, RCPStateProps } from '../views/rcp/RCP';

function mapStateToProps(state: AppState) {
	return {
		currentRaceId: getCurrentRaceId(state),
		currentCultureId: getCurrentCultureId(state)
	};
}

function mapDispatchToProps() {
	return {};
}

export const RCPContainer = connect<RCPStateProps, RCPDispatchProps, RCPOwnProps>(mapStateToProps, mapDispatchToProps)(RCP);
